package main

import (
	"bufio"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/ssassam/UX-STING/tools/kariddi/internal/report"
	"github.com/ssassam/UX-STING/tools/kariddi/internal/scan"
)

// Assembled at run time so no secret-shaped literal sits in the repository.
var fakeAWSKey = "AKIA" + "QYLPMN5HHHFPZAM2"

func testSite(t *testing.T) *httptest.Server {
	t.Helper()

	pages := map[string]string{
		"/": `<html><head><script src="/js/app.js"></script></head><body>
<a href="/admin/login.html">login</a> <a href="/search?q=test&redirect=/home">search</a>
<a href="/.env">env</a> <a href="https://out-of-scope.example.org/x">elsewhere</a>
<form action="/admin/do" method="post"><input name="token"><input name="comment"></form>
</body></html>`,
		"/js/app.js":        `const cfg = { awsKey: "` + fakeAWSKey + `" };`,
		"/admin/login.html": `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version`,
		"/.env":             "DEBUG=true\n",
		"/search":           "<html><body>results</body></html>",
		"/robots.txt":       "User-agent: *\nDisallow: /hidden/\n",
		"/hidden/":          `<html><body><a href="/hidden/deep.html">deep</a></body></html>`,
		"/hidden/deep.html": "<html><body>deep page</body></html>",
	}

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, ok := pages[r.URL.Path]
		if !ok {
			http.NotFound(w, r)
			return
		}

		switch {
		case strings.HasSuffix(r.URL.Path, ".js"):
			w.Header().Set("Content-Type", "text/javascript")
		case strings.HasSuffix(r.URL.Path, ".txt"), r.URL.Path == "/.env":
			w.Header().Set("Content-Type", "text/plain")
		default:
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
		}

		_, _ = io.WriteString(w, body)
	}))
	t.Cleanup(srv.Close)

	return srv
}

// runTool runs kariddi with args and returns its exit code, stdout and stderr.
func runTool(t *testing.T, args ...string) (int, string, string) {
	t.Helper()

	dir := t.TempDir()

	open := func(name string) *os.File {
		f, err := os.Create(filepath.Join(dir, name))
		if err != nil {
			t.Fatal(err)
		}

		return f
	}

	stdin, stdout, stderr := open("stdin"), open("stdout"), open("stderr")
	code := run(args, stdin, stdout, stderr)

	read := func(f *os.File) string {
		_ = f.Close()

		b, err := os.ReadFile(f.Name())
		if err != nil {
			t.Fatal(err)
		}

		return string(b)
	}

	_ = stdin.Close()

	return code, read(stdout), read(stderr)
}

func TestEndToEnd(t *testing.T) {
	if testing.Short() {
		t.Skip("crawls a local server; skipped with -short")
	}

	srv := testSite(t)
	out := filepath.Join(t.TempDir(), "out")

	// -timeout 2: katana ends a crawl once its queue has been idle that long.
	code, stdout, stderr := runTool(t, "-u", srv.URL, "-o", out, "-timeout", "2", "-nc", "-fail-on", "high")
	if code != exitFindings {
		t.Fatalf("exit code = %d, want %d (-fail-on high)\nstdout:\n%s\nstderr:\n%s", code, exitFindings, stdout, stderr)
	}

	raw, err := os.ReadFile(filepath.Join(out, "report.json"))
	if err != nil {
		t.Fatal(err)
	}

	var rep report.Report
	if err := json.Unmarshal(raw, &rep); err != nil {
		t.Fatal(err)
	}

	urls := map[string]int{}
	for _, u := range rep.URLs {
		urls[strings.TrimPrefix(u.URL, srv.URL)] = u.Status
	}

	for _, path := range []string{"/js/app.js", "/admin/login.html", "/.env", "/hidden/", "/hidden/deep.html"} {
		if urls[path] != http.StatusOK {
			t.Errorf("%s not crawled (status %d); crawled: %v", path, urls[path], urls)
		}
	}

	for u := range urls {
		if strings.Contains(u, "out-of-scope.example.org") {
			t.Errorf("out-of-scope URL crawled: %s", u)
		}
	}

	has := func(typ, engine, nameContains, urlSuffix string) bool {
		for _, f := range rep.Findings {
			if f.Type == typ && f.Engine == engine && strings.Contains(f.Name, nameContains) &&
				strings.HasSuffix(f.URL, urlSuffix) {
				return true
			}
		}

		return false
	}

	checks := []struct{ typ, engine, name, url string }{
		{scan.TypeSecret, scan.EngineCariddi, "AWS", "/js/app.js"},
		{scan.TypeSecret, scan.EngineKatana, "", "/js/app.js"},
		{scan.TypeError, scan.EngineCariddi, "MySQL", "/admin/login.html"},
		{scan.TypeExtension, scan.EngineCariddi, ".env", "/.env"},
		{scan.TypeEndpoint, scan.EngineCariddi, "Juicy parameter", "/search?q=test&redirect=/home"},
		{scan.TypeEndpoint, scan.EngineCariddi, "Juicy parameter", "/admin/do"},
	}
	for _, c := range checks {
		if !has(c.typ, c.engine, c.name, c.url) {
			t.Errorf("missing %s finding %q from %s on %s", c.typ, c.name, c.engine, c.url)
		}
	}

	if rep.Stats.Findings != len(rep.Findings) || rep.Stats.URLs != len(rep.URLs) || rep.Stats.Forms != 1 {
		t.Errorf("stats do not match the report: %+v", rep.Stats)
	}

	if !strings.Contains(stdout, fakeAWSKey) {
		t.Errorf("secret not printed to stdout:\n%s", stdout)
	}

	for _, name := range []string{"urls.txt", "findings.jsonl", "report.html"} {
		st, err := os.Stat(filepath.Join(out, name))
		if err != nil || st.Size() == 0 {
			t.Errorf("%s missing or empty: %v", name, err)
		} else if st.Mode().Perm() != 0o600 {
			t.Errorf("%s mode = %v, want 0600", name, st.Mode().Perm())
		}
	}

	page, _ := os.ReadFile(filepath.Join(out, "report.html"))
	if !strings.Contains(string(page), fakeAWSKey) || !strings.Contains(string(page), "/hidden/deep.html") {
		t.Error("report.html is missing the secret or a crawled URL")
	}
}

func TestJSONAndRedact(t *testing.T) {
	if testing.Short() {
		t.Skip("crawls a local server; skipped with -short")
	}

	srv := testSite(t)
	out := filepath.Join(t.TempDir(), "out")

	code, stdout, stderr := runTool(t, "-u", srv.URL, "-o", out, "-timeout", "2", "-json", "-redact", "-kf", "off",
		"-scan", "secrets", "-ks=false", "-ke=false")
	if code != exitOK {
		t.Fatalf("exit code = %d\nstderr:\n%s", code, stderr)
	}

	if stderr != "" {
		t.Errorf("-json should keep stderr quiet, got:\n%s", stderr)
	}

	kinds := map[string]int{}

	sc := bufio.NewScanner(strings.NewReader(stdout))
	for sc.Scan() {
		var ev map[string]any
		if err := json.Unmarshal(sc.Bytes(), &ev); err != nil {
			t.Fatalf("stdout line is not JSON: %q", sc.Text())
		}

		kinds[ev["kind"].(string)]++

		if ev["kind"] == "finding" && ev["type"] != scan.TypeSecret {
			t.Errorf("-scan secrets printed a %v finding", ev["type"])
		}
	}

	if kinds["url"] == 0 || kinds["finding"] != 1 {
		t.Errorf("want URL events and exactly one finding, got %v\n%s", kinds, stdout)
	}

	files, _ := filepath.Glob(filepath.Join(out, "*"))
	for _, name := range files {
		b, _ := os.ReadFile(name)
		if strings.Contains(string(b), fakeAWSKey) {
			t.Errorf("-redact left the secret in %s", filepath.Base(name))
		}
	}

	if strings.Contains(stdout, fakeAWSKey) {
		t.Error("-redact left the secret on stdout")
	}

	if strings.Contains(stdout, "/hidden/") {
		t.Error("-kf off still crawled robots.txt entries")
	}
}

func TestUsageErrors(t *testing.T) {
	cases := [][]string{
		{},
		{"-u", "ftp://example.com"},
		{"-u", "example.com", "-hl", "-hh"},
		{"-u", "example.com", "-xhr"},
		{"-u", "example.com", "-scan", "everything"},
		{"-u", "example.com", "-ext", "9"},
		{"-u", "example.com", "-fail-on", "severe"},
		{"-u", "example.com", "-sr"},
		{"-u", "example.com", "-cs", "("},
		{"-u", "example.com", "-H", "no-colon"},
		{"-u", "example.com", "-fs", "everything"},
		{"-u", "example.com", "stray"},
		{"-no-such-flag"},
	}

	for _, args := range cases {
		code, _, stderr := runTool(t, args...)
		if code != exitUsage || !strings.Contains(stderr, "kariddi:") {
			t.Errorf("args %v: exit %d, stderr %q; want exit %d with a message", args, code, stderr, exitUsage)
		}
	}
}

func TestHelpAndVersion(t *testing.T) {
	code, stdout, _ := runTool(t, "-version")
	if code != exitOK || !strings.HasPrefix(stdout, "kariddi "+version) {
		t.Errorf("-version: exit %d, stdout %q", code, stdout)
	}

	code, _, stderr := runTool(t, "-h")
	if code != exitOK || !strings.Contains(stderr, "CRAWL (katana)") || !strings.Contains(stderr, "SCAN (cariddi") {
		t.Errorf("-h: exit %d, stderr %q", code, stderr)
	}
}

func TestRedact(t *testing.T) {
	if got := report.Redact("short"); got != "*****" {
		t.Errorf("Redact(short) = %q", got)
	}

	got := report.Redact(fakeAWSKey)
	if strings.Contains(got, fakeAWSKey) || !strings.HasPrefix(got, "AKIA") || !strings.Contains(got, "20 chars") {
		t.Errorf("Redact = %q", got)
	}

	f := report.RedactFinding(scan.Finding{Type: scan.TypeInfo, Match: "ops@example.test"})
	if f.Match != "ops@example.test" {
		t.Errorf("only secrets are redacted, got %q", f.Match)
	}
}
