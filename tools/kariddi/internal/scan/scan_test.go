package scan

import (
	"regexp"
	"strings"
	"testing"
)

// Fake credentials are assembled at run time so no secret-shaped literal sits
// in the repository.
var (
	fakeAWSKey   = "AKIA" + "QYLPMN5HHHFPZAM2"
	fakeGitHubPA = "ghp_" + "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789"
)

func all() *Scanner {
	return New(Options{Secrets: true, Endpoints: true, Errors: true, Info: true, ExtLevel: 2})
}

func find(fs []Finding, typ, nameContains string) *Finding {
	for i := range fs {
		if fs[i].Type == typ && strings.Contains(fs[i].Name, nameContains) {
			return &fs[i]
		}
	}

	return nil
}

func TestBodySecrets(t *testing.T) {
	body := `const cfg = { key: "` + fakeAWSKey + `" }; const t = "` + fakeGitHubPA + `";`
	got := all().Body("https://example.test/app.js", body)

	aws := find(got, TypeSecret, "AWS")
	if aws == nil || !strings.Contains(aws.Match, fakeAWSKey) {
		t.Fatalf("AWS key not reported: %+v", got)
	}

	if aws.Severity != High || aws.Engine != EngineCariddi || aws.URL != "https://example.test/app.js" {
		t.Errorf("unexpected finding fields: %+v", aws)
	}

	if gh := find(got, TypeSecret, "Github"); gh == nil || !strings.Contains(gh.Match, fakeGitHubPA) {
		t.Errorf("GitHub token not reported: %+v", got)
	}
}

func TestBodyErrorsAndInfo(t *testing.T) {
	body := `<!-- staging build --> mail ops@example-corp.test host 192.168.10.44
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version`
	got := all().Body("https://example.test/", body)

	if f := find(got, TypeError, "MySQL"); f == nil || f.Severity != Medium {
		t.Errorf("MySQL error not reported: %+v", got)
	}

	if f := find(got, TypeInfo, "Email"); f == nil || f.Match != "ops@example-corp.test" {
		t.Errorf("email not reported: %+v", got)
	}

	if f := find(got, TypeInfo, "Internal IP"); f == nil || f.Match != "192.168.10.44" {
		t.Errorf("internal IP not reported: %+v", got)
	}
}

func TestBodyRespectsDetectorSelection(t *testing.T) {
	s := New(Options{Errors: true})
	got := s.Body("https://example.test/", `key "`+fakeAWSKey+`" ops@example-corp.test`)

	if len(got) != 0 {
		t.Errorf("only the errors detector is on, got %+v", got)
	}
}

func TestBodyDeduplicates(t *testing.T) {
	body := strings.Repeat(`"`+fakeAWSKey+`" `, 5)
	got := New(Options{Secrets: true}).Body("https://example.test/", body)

	n := 0

	for _, f := range got {
		if f.Name == find(got, TypeSecret, "AWS").Name {
			n++
		}
	}

	if n != 1 {
		t.Errorf("want the repeated key reported once, got %d: %+v", n, got)
	}
}

func TestBodyMaxBody(t *testing.T) {
	body := strings.Repeat("x", 100) + ` "` + fakeAWSKey + `"`
	if got := New(Options{Secrets: true, MaxBody: 50}).Body("https://example.test/", body); len(got) != 0 {
		t.Errorf("secret past the MaxBody cap should not be scanned: %+v", got)
	}
}

func TestCustomSecrets(t *testing.T) {
	s := New(Options{Secrets: true, CustomSecrets: []*regexp.Regexp{regexp.MustCompile(`internal-[0-9]{4}`)}})
	got := s.Body("https://example.test/", `id internal-4821 and "`+fakeAWSKey+`"`)

	if len(got) != 1 || got[0].Match != "internal-4821" {
		t.Errorf("custom rules should replace the built-in ones: %+v", got)
	}
}

func TestURLParametersAndExtensions(t *testing.T) {
	s := all()

	got := s.URL("https://example.test/search?q=1&redirect=/home&plain=1")
	if len(got) != 2 {
		t.Fatalf("want q and redirect flagged, got %+v", got)
	}

	for _, f := range got {
		if f.Type != TypeEndpoint || f.Detail["in"] != "query" {
			t.Errorf("unexpected finding: %+v", f)
		}
	}

	env := s.URL("https://example.test/.env?v=2")
	if len(env) != 1 || env[0].Type != TypeExtension || env[0].Match != "env" || env[0].Severity != High {
		t.Errorf(".env not flagged as a high-severity file: %+v", env)
	}

	if got := s.URL("https://example.test/index.html"); len(got) != 0 {
		t.Errorf("plain page flagged: %+v", got)
	}

	if got := New(Options{Endpoints: true}).URL("https://example.test/.env"); len(got) != 0 {
		t.Errorf("extension detector is off (level 0), got %+v", got)
	}
}

func TestFormParams(t *testing.T) {
	got := all().Params("https://example.test/admin/do", []string{"Token", "comment", "file"}, "form")
	if len(got) != 2 {
		t.Fatalf("want token and file flagged, got %+v", got)
	}

	for _, f := range got {
		if f.Detail["in"] != "form" {
			t.Errorf("want in=form: %+v", f)
		}
	}
}

func TestCustomParams(t *testing.T) {
	s := New(Options{Endpoints: true, CustomParams: []string{"tenant"}})

	got := s.URL("https://example.test/?id=1&tenant=acme")
	if len(got) != 1 || got[0].Match != "tenant" {
		t.Errorf("custom list should replace the built-in one: %+v", got)
	}
}

func TestIsTextual(t *testing.T) {
	cases := map[string]bool{
		"":                                 true,
		"text/html; charset=utf-8":         true,
		"application/javascript":           true,
		"application/json":                 true,
		"image/svg+xml":                    true,
		"image/png":                        false,
		"font/woff2":                       false,
		"application/octet-stream":         false,
		"Application/PDF":                  false,
		"video/mp4; codecs=\"avc1.4d401\"": false,
	}

	for ct, want := range cases {
		if got := IsTextual(ct); got != want {
			t.Errorf("IsTextual(%q) = %v, want %v", ct, got, want)
		}
	}
}

func TestSeverityRank(t *testing.T) {
	if SeverityRank("HIGH") <= SeverityRank(Medium) || SeverityRank(Medium) <= SeverityRank(Low) ||
		SeverityRank(Low) <= SeverityRank(Info) || SeverityRank("nonsense") != 0 {
		t.Error("severity ranks are out of order")
	}
}
