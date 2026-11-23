// kariddi is an all-in-one web crawler and scanner. It uses katana
// (github.com/projectdiscovery/katana) as the crawl engine and cariddi
// (github.com/edoardottt/cariddi) as the detection engine: every URL and
// response katana finds is checked with cariddi's rules for secrets, juicy
// parameters, juicy files, error messages and useful information.
//
// Only use it against systems you own or are authorized to test.
//
// SPDX-License-Identifier: GPL-3.0-or-later
package main

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/signal"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/ssassam/UX-STING/tools/kariddi/internal/engine"
	"github.com/ssassam/UX-STING/tools/kariddi/internal/report"
	"github.com/ssassam/UX-STING/tools/kariddi/internal/scan"
)

const (
	toolName = "kariddi"
	version  = "0.1.0"
)

// Exit codes.
const (
	exitOK       = 0
	exitError    = 1
	exitFindings = 2 // -fail-on threshold reached
	exitUsage    = 64
)

type listFlag []string

func (l *listFlag) String() string { return strings.Join(*l, ",") }

func (l *listFlag) Set(v string) error {
	for _, part := range strings.Split(v, ",") {
		if part = strings.TrimSpace(part); part != "" {
			*l = append(*l, part)
		}
	}

	return nil
}

// rawFlag is repeatable but never split on commas (regexes use them).
type rawFlag []string

func (r *rawFlag) String() string { return strings.Join(*r, " ") }

func (r *rawFlag) Set(v string) error {
	*r = append(*r, v)

	return nil
}

// headerFlag is repeatable, never split on commas, and must be 'Name: value'.
type headerFlag []string

func (h *headerFlag) String() string { return strings.Join(*h, "; ") }

func (h *headerFlag) Set(v string) error {
	if !strings.Contains(v, ":") {
		return fmt.Errorf("header must look like 'Name: value'")
	}

	*h = append(*h, v)

	return nil
}

type config struct {
	targets  listFlag
	listFile string

	engine engine.Config

	headless bool
	hybrid   bool
	duration time.Duration
	maxBody  int

	scanList      listFlag
	extLevel      int
	secretsFile   string
	paramsFile    string
	katanaSecrets bool
	katanaAPI     bool

	outDir    string
	jsonOut   bool
	silent    bool
	noColor   bool
	redact    bool
	storeResp bool
	failOn    string
	showVer   bool
}

const usageText = `kariddi %s — katana crawling + cariddi detection in one binary

Usage:
  kariddi -u https://example.com [flags]
  cat targets.txt | kariddi [flags]

Only scan systems you own or are authorized to test.

INPUT
  -u value          target URL or host (repeatable, comma-separated)
  -l file           file with one target per line (stdin is read when neither -u nor -l is given)

CRAWL (katana)
  -d int            maximum crawl depth (default 3)
  -jc               parse JavaScript files for endpoints (default true)
  -jsl              also parse JavaScript with jsluice; finds more, uses more memory
  -kf string        read robots.txt / sitemap.xml for more URLs: all, robotstxt, sitemapxml, off (default "all")
  -kf-max int       maximum URLs taken from those files per target (default 50)
  -fx               extract forms and their fields (default true)
  -aff              fill in and submit forms automatically (sends data to the target; off by default)
  -pc               path climbing: also crawl each parent directory of a found path
  -td               detect technologies (default true)
  -iqp              treat URLs that differ only by query string as one
  -strategy string  depth-first or breadth-first (default "depth-first")
  -em value         only crawl these extensions (e.g. php,html,js)
  -ef value         skip these extensions (e.g. png,css)
  -ct duration      stop crawling each target after this long (e.g. 5m)
  -mdp int          maximum pages per domain (0 = unlimited)

BROWSER (katana, needs Chrome/Chromium)
  -hl               headless crawl: drive a real browser
  -hh               hybrid crawl: HTTP crawl plus browser rendering
  -xhr              record XHR/fetch requests made by pages (with -hl or -hh)
  -sc               use the locally installed Chrome
  -scp path         path to a Chrome/Chromium binary
  -nos              start Chrome with --no-sandbox

SCOPE
  -fs string        scope field: rdn (root domain), fqdn (exact host), dn (domain keyword) (default "rdn")
  -cs value         in-scope URL regex (repeatable)
  -cos value        out-of-scope URL regex (repeatable)

RATE AND NETWORK
  -c int            concurrent fetchers per target (default 10)
  -p int            targets crawled in parallel (default 5)
  -rl int           maximum requests per second (default 100)
  -delay int        seconds to wait between requests
  -timeout int      request timeout in seconds (default 10)
  -retry int        retries per request (default 1)
  -H value          extra request header 'Name: value' (repeatable)
  -proxy string     HTTP or SOCKS5 proxy URL
  -r value          custom DNS resolvers (comma-separated)

SCAN (cariddi + katana)
  -scan value       cariddi detectors: secrets, endpoints, errors, info, ext, all, none (default "all")
  -ext int          juicy file level 1-7: 1 = only the juiciest, 7 = every known type (default 2)
  -sf file          custom secret regexes, one per line (replaces the built-in rules)
  -pf file          custom juicy parameter names, one per line (replaces the built-in list)
  -ks               also run katana's built-in secret detector (default true)
  -ke               classify API endpoints (REST, GraphQL, SOAP, XHR) with katana (default true)
  -pt               classify page types (login, error, ...) with katana
  -max-body int     megabytes of each response to read and scan (default 4)

OUTPUT
  -o dir            write urls.txt, findings.jsonl, report.json and report.html to dir
  -sr               store raw HTTP responses under <dir>/responses (needs -o)
  -json             print JSON Lines to stdout instead of text
  -silent           print findings only, no URLs or banner
  -redact           mask secret values in all output
  -nc               no colors
  -fail-on string   exit with code 2 if a finding has this severity or higher (info, low, medium, high)
  -v                verbose: show katana's own log messages
  -version          print the version and exit

Bool flags that default to true are turned off with =false, e.g. -jc=false.
`

func parseFlags(args []string, stderr io.Writer) (*config, error) {
	cfg := &config{}
	fs := flag.NewFlagSet(toolName, flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	fs.Usage = func() {}

	e := &cfg.engine

	fs.Var(&cfg.targets, "u", "")
	fs.StringVar(&cfg.listFile, "l", "", "")

	fs.IntVar(&e.Depth, "d", 3, "")
	fs.BoolVar(&e.JSCrawl, "jc", true, "")
	fs.BoolVar(&e.JSLuice, "jsl", false, "")
	fs.StringVar(&e.KnownFiles, "kf", "all", "")
	fs.IntVar(&e.KnownFilesMax, "kf-max", 50, "")
	fs.BoolVar(&e.FormExtraction, "fx", true, "")
	fs.BoolVar(&e.AutoFormFill, "aff", false, "")
	fs.BoolVar(&e.PathClimb, "pc", false, "")
	fs.BoolVar(&e.TechDetect, "td", true, "")
	fs.BoolVar(&e.IgnoreQuery, "iqp", false, "")
	fs.StringVar(&e.Strategy, "strategy", "depth-first", "")
	fs.Var((*listFlag)(&e.ExtensionMatch), "em", "")
	fs.Var((*listFlag)(&e.ExtensionFilter), "ef", "")
	fs.DurationVar(&cfg.duration, "ct", 0, "")
	fs.IntVar(&e.MaxDomainPages, "mdp", 0, "")

	fs.BoolVar(&cfg.headless, "hl", false, "")
	fs.BoolVar(&cfg.hybrid, "hh", false, "")
	fs.BoolVar(&e.XHR, "xhr", false, "")
	fs.BoolVar(&e.SystemChrome, "sc", false, "")
	fs.StringVar(&e.SystemChromePath, "scp", "", "")
	fs.BoolVar(&e.NoSandbox, "nos", false, "")

	fs.StringVar(&e.FieldScope, "fs", "rdn", "")
	fs.Var((*rawFlag)(&e.InScope), "cs", "")
	fs.Var((*rawFlag)(&e.OutOfScope), "cos", "")

	fs.IntVar(&e.Concurrency, "c", 10, "")
	fs.IntVar(&e.Parallelism, "p", 5, "")
	fs.IntVar(&e.RateLimit, "rl", 100, "")
	fs.IntVar(&e.Delay, "delay", 0, "")
	fs.IntVar(&e.Timeout, "timeout", 10, "")
	fs.IntVar(&e.Retries, "retry", 1, "")
	fs.Var((*headerFlag)(&e.Headers), "H", "")
	fs.StringVar(&e.Proxy, "proxy", "", "")
	fs.Var((*listFlag)(&e.Resolvers), "r", "")

	fs.Var(&cfg.scanList, "scan", "")
	fs.IntVar(&cfg.extLevel, "ext", 2, "")
	fs.StringVar(&cfg.secretsFile, "sf", "", "")
	fs.StringVar(&cfg.paramsFile, "pf", "", "")
	fs.BoolVar(&cfg.katanaSecrets, "ks", true, "")
	fs.BoolVar(&cfg.katanaAPI, "ke", true, "")
	fs.BoolVar(&e.PageType, "pt", false, "")
	fs.IntVar(&cfg.maxBody, "max-body", 4, "")

	fs.StringVar(&cfg.outDir, "o", "", "")
	fs.BoolVar(&cfg.storeResp, "sr", false, "")
	fs.BoolVar(&cfg.jsonOut, "json", false, "")
	fs.BoolVar(&cfg.silent, "silent", false, "")
	fs.BoolVar(&cfg.redact, "redact", false, "")
	fs.BoolVar(&cfg.noColor, "nc", false, "")
	fs.StringVar(&cfg.failOn, "fail-on", "", "")
	fs.BoolVar(&e.Verbose, "v", false, "")
	fs.BoolVar(&cfg.showVer, "version", false, "")

	if err := fs.Parse(args); err != nil {
		if errors.Is(err, flag.ErrHelp) {
			fmt.Fprintf(stderr, usageText, version)
		}

		return nil, err
	}

	if fs.NArg() > 0 {
		return nil, fmt.Errorf("unexpected argument %q (targets go in -u or -l)", fs.Arg(0))
	}

	return cfg, validate(cfg)
}

func validate(cfg *config) error {
	e := &cfg.engine

	if cfg.headless && cfg.hybrid {
		return errors.New("-hl and -hh cannot be combined")
	}

	switch {
	case cfg.headless:
		e.Browser = engine.BrowserHeadless
	case cfg.hybrid:
		e.Browser = engine.BrowserHybrid
	}

	if e.XHR && e.Browser == engine.BrowserOff {
		return errors.New("-xhr needs a browser: add -hl or -hh")
	}

	if e.AutoFormFill && e.Browser == engine.BrowserHybrid {
		return errors.New("-aff is not supported with -hh")
	}

	if e.Depth < 1 {
		return errors.New("-d must be at least 1")
	}

	if e.KnownFilesMax < 0 {
		return errors.New("-kf-max cannot be negative")
	}

	if e.Concurrency < 1 || e.Parallelism < 1 {
		return errors.New("-c and -p must be at least 1")
	}

	if e.RateLimit < 1 {
		return errors.New("-rl must be at least 1")
	}

	if e.Strategy != "depth-first" && e.Strategy != "breadth-first" {
		return errors.New("-strategy must be depth-first or breadth-first")
	}

	switch e.FieldScope {
	case "rdn", "fqdn", "dn":
	default:
		return errors.New("-fs must be rdn, fqdn or dn")
	}

	switch e.KnownFiles {
	case "off", "none":
		e.KnownFiles = ""
	case "", "all", "robotstxt", "sitemapxml":
	default:
		return errors.New("-kf must be all, robotstxt, sitemapxml or off")
	}

	for _, re := range append(append([]string{}, e.InScope...), e.OutOfScope...) {
		if _, err := regexp.Compile(re); err != nil {
			return fmt.Errorf("invalid scope regex %q: %w", re, err)
		}
	}

	if cfg.extLevel < 0 || cfg.extLevel > 7 {
		return errors.New("-ext must be between 0 and 7")
	}

	if cfg.maxBody < 1 {
		return errors.New("-max-body must be at least 1")
	}

	if cfg.failOn != "" && scan.SeverityRank(cfg.failOn) == 0 {
		return errors.New("-fail-on must be info, low, medium or high")
	}

	if cfg.storeResp && cfg.outDir == "" {
		return errors.New("-sr needs -o")
	}

	e.Duration = cfg.duration
	e.BodyReadSize = cfg.maxBody * 1024 * 1024
	e.KatanaSecrets = cfg.katanaSecrets
	e.KatanaEndpoints = cfg.katanaAPI

	if cfg.storeResp {
		e.StoreResponseDir = filepath.Join(cfg.outDir, "responses")
	}

	return nil
}

func scanOptions(cfg *config) (scan.Options, error) {
	opts := scan.Options{MaxBody: cfg.maxBody * 1024 * 1024}

	list := cfg.scanList
	if len(list) == 0 {
		list = listFlag{"all"}
	}

	ext := false

	for _, name := range list {
		switch strings.ToLower(name) {
		case "all":
			opts.Secrets, opts.Endpoints, opts.Errors, opts.Info, ext = true, true, true, true, true
		case "none":
		case "secrets":
			opts.Secrets = true
		case "endpoints":
			opts.Endpoints = true
		case "errors":
			opts.Errors = true
		case "info":
			opts.Info = true
		case "ext":
			ext = true
		default:
			return opts, fmt.Errorf("unknown detector %q in -scan", name)
		}
	}

	if ext {
		opts.ExtLevel = cfg.extLevel
	}

	if cfg.secretsFile != "" {
		lines, err := readLines(cfg.secretsFile)
		if err != nil {
			return opts, err
		}

		for _, line := range lines {
			re, err := regexp.Compile(line)
			if err != nil {
				return opts, fmt.Errorf("%s: invalid regex %q: %w", cfg.secretsFile, line, err)
			}

			opts.CustomSecrets = append(opts.CustomSecrets, re)
		}
	}

	if cfg.paramsFile != "" {
		lines, err := readLines(cfg.paramsFile)
		if err != nil {
			return opts, err
		}

		opts.CustomParams = lines
	}

	return opts, nil
}

func readLines(path string) ([]string, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer func() { _ = f.Close() }()

	return scanLines(f)
}

func scanLines(r io.Reader) ([]string, error) {
	var out []string

	sc := bufio.NewScanner(r)
	sc.Buffer(make([]byte, 64*1024), 1024*1024)

	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line != "" && !strings.HasPrefix(line, "#") {
			out = append(out, line)
		}
	}

	return out, sc.Err()
}

func gatherTargets(cfg *config, stdin *os.File) ([]string, error) {
	raw := append([]string{}, cfg.targets...)

	if cfg.listFile != "" {
		lines, err := readLines(cfg.listFile)
		if err != nil {
			return nil, err
		}

		raw = append(raw, lines...)
	}

	if len(raw) == 0 && stdin != nil {
		if st, err := stdin.Stat(); err == nil && st.Mode()&os.ModeCharDevice == 0 {
			lines, err := scanLines(stdin)
			if err != nil {
				return nil, err
			}

			raw = append(raw, lines...)
		}
	}

	var (
		out  []string
		seen = map[string]bool{}
	)

	for _, t := range raw {
		n, err := engine.NormalizeTarget(t)
		if err != nil {
			return nil, err
		}

		if !seen[n] {
			seen[n] = true

			out = append(out, n)
		}
	}

	if len(out) == 0 {
		return nil, errors.New("no targets: use -u, -l or pipe targets on stdin (-h for help)")
	}

	return out, nil
}

// printer serialises terminal / JSON Lines output.
type printer struct {
	mu     sync.Mutex
	out    io.Writer
	json   bool
	silent bool
	color  bool
	redact bool
}

func (p *printer) paint(code, s string) string {
	if !p.color {
		return s
	}

	return "\x1b[" + code + "m" + s + "\x1b[0m"
}

func severityColor(sev string) string {
	switch sev {
	case "critical", scan.High:
		return "1;31"
	case scan.Medium:
		return "33"
	case scan.Low:
		return "32"
	}

	return "36"
}

func statusColor(status int) string {
	switch {
	case status >= 500:
		return "31"
	case status >= 400:
		return "33"
	case status >= 300:
		return "36"
	case status >= 200:
		return "32"
	}

	return "90"
}

func (p *printer) writeJSON(v any) {
	b, err := json.Marshal(v)
	if err != nil {
		return
	}

	_, _ = p.out.Write(append(b, '\n'))
}

func (p *printer) page(pg engine.Page) {
	if p.silent {
		return
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	if p.json {
		p.writeJSON(struct {
			Kind        string `json:"kind"`
			URL         string `json:"url"`
			Method      string `json:"method"`
			Status      int    `json:"status,omitempty"`
			ContentType string `json:"content_type,omitempty"`
			Length      int64  `json:"length,omitempty"`
			Source      string `json:"source,omitempty"`
			Tag         string `json:"tag,omitempty"`
		}{"url", pg.URL, pg.Method, pg.Status, pg.ContentType, pg.Length, pg.Source, pg.Tag})

		return
	}

	status := " - "
	if pg.Status != 0 {
		status = fmt.Sprintf("%d", pg.Status)
	}

	_, _ = fmt.Fprintf(p.out, "%s %s %s\n", p.paint(statusColor(pg.Status), "["+status+"]"), pg.Method, pg.URL)
}

func (p *printer) finding(f scan.Finding) {
	if p.redact {
		f = report.RedactFinding(f)
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	if p.json {
		p.writeJSON(struct {
			Kind string `json:"kind"`
			scan.Finding
		}{"finding", f})

		return
	}

	line := p.paint(severityColor(f.Severity), "["+f.Severity+"]") + " " +
		p.paint("35", "["+f.Type+"]") + " " + f.Name

	if f.Match != "" {
		match := strings.Join(strings.Fields(f.Match), " ")
		if len(match) > 160 {
			match = match[:160] + "…"
		}

		line += ": " + p.paint("1", match)
	}

	_, _ = fmt.Fprintf(p.out, "%s  %s %s\n", line, p.paint("90", "←"), f.URL)
}

// knowledgeFindings turns katana's per-response knowledge base (its own secret
// detector and API endpoint classifier) into findings.
func knowledgeFindings(pg engine.Page) []scan.Finding {
	var out []scan.Finding

	if secrets, ok := pg.Knowledge["secrets"].(map[string]any); ok {
		for _, item := range asMaps(secrets["findings"]) {
			name := fmt.Sprint(item["kind"])
			if item["kind"] == nil || name == "" {
				name = fmt.Sprint(item["rule"])
			}

			severity := strings.ToLower(fmt.Sprint(item["severity"]))
			if scan.SeverityRank(severity) == 0 {
				severity = scan.High
			}

			detail := map[string]any{}

			for _, k := range []string{"rule", "id", "score", "validation"} {
				if v, ok := item[k]; ok {
					detail[k] = v
				}
			}

			out = append(out, scan.Finding{
				Type:     scan.TypeSecret,
				Name:     name,
				Severity: severity,
				URL:      pg.URL,
				Engine:   scan.EngineKatana,
				Detail:   detail,
			})
		}
	}

	if ep, ok := pg.Knowledge["endpoints"].(map[string]any); ok {
		class := fmt.Sprint(ep["class"])

		names := map[string]string{"rest": "REST", "graphql": "GraphQL", "soap": "SOAP", "xhr": "XHR"}
		if n, ok := names[class]; ok {
			class = n
		}

		u := fmt.Sprint(ep["url"])
		if ep["url"] == nil || u == "" {
			u = pg.URL
		}

		detail := map[string]any{}

		for _, k := range []string{"content_type", "auth", "params"} {
			if v, ok := ep[k]; ok {
				detail[k] = v
			}
		}

		out = append(out, scan.Finding{
			Type:     scan.TypeAPI,
			Name:     class + " endpoint",
			Severity: scan.Info,
			URL:      u,
			Match:    fmt.Sprint(ep["method"]),
			Engine:   scan.EngineKatana,
			Detail:   detail,
		})
	}

	return out
}

func asMaps(v any) []map[string]any {
	switch t := v.(type) {
	case []map[string]any:
		return t
	case []any:
		var out []map[string]any

		for _, item := range t {
			if m, ok := item.(map[string]any); ok {
				out = append(out, m)
			}
		}

		return out
	}

	return nil
}

// process scans one crawl result and prints whatever is new.
func process(pg engine.Page, sc *scan.Scanner, col *report.Collector, pr *printer) {
	if pg.URL == "" {
		return
	}

	if col.AddPage(pg) {
		pr.page(pg)
	}

	findings := sc.URL(pg.URL)

	for _, form := range pg.Forms {
		where := form.Action
		if where == "" {
			where = pg.URL
		}

		findings = append(findings, sc.Params(where, append([]string{}, form.Parameters...), "form")...)
	}

	for _, x := range pg.XHR {
		xp := engine.Page{URL: x, Method: "GET", Source: pg.URL, Tag: "xhr"}
		if col.AddPage(xp) {
			pr.page(xp)
		}

		findings = append(findings, sc.URL(x)...)
	}

	if pg.Fetched && pg.Body != "" && scan.IsTextual(pg.ContentType) {
		findings = append(findings, sc.Body(pg.URL, pg.Body)...)
	}

	findings = append(findings, knowledgeFindings(pg)...)

	for _, f := range findings {
		if col.AddFinding(f) {
			pr.finding(f)
		}
	}
}

func isTerminal(f *os.File) bool {
	st, err := f.Stat()

	return err == nil && st.Mode()&os.ModeCharDevice != 0
}

func run(args []string, stdin, stdout, stderr *os.File) int {
	cfg, err := parseFlags(args, stderr)
	if err != nil {
		if errors.Is(err, flag.ErrHelp) {
			return exitOK
		}

		fmt.Fprintf(stderr, "%s: %v\n", toolName, err)

		return exitUsage
	}

	if cfg.showVer {
		fmt.Fprintf(stdout, "%s %s\n", toolName, version)
		return exitOK
	}

	scanOpts, err := scanOptions(cfg)
	if err != nil {
		fmt.Fprintf(stderr, "%s: %v\n", toolName, err)
		return exitUsage
	}

	targets, err := gatherTargets(cfg, stdin)
	if err != nil {
		fmt.Fprintf(stderr, "%s: %v\n", toolName, err)
		return exitUsage
	}

	quiet := cfg.silent || cfg.jsonOut
	if !quiet {
		fmt.Fprintf(stderr, "%s %s — katana crawl engine + cariddi detection engine\n", toolName, version)
		fmt.Fprintf(stderr, "Only scan systems you own or are authorized to test.\n")
		fmt.Fprintf(stderr, "targets: %d · depth %d · scope %s · %d req/s\n\n",
			len(targets), cfg.engine.Depth, cfg.engine.FieldScope, cfg.engine.RateLimit)
	}

	pr := &printer{
		out:    stdout,
		json:   cfg.jsonOut,
		silent: cfg.silent,
		redact: cfg.redact,
		color:  !cfg.noColor && !cfg.jsonOut && os.Getenv("NO_COLOR") == "" && isTerminal(stdout),
	}
	sc := scan.New(scanOpts)
	col := report.NewCollector()
	started := time.Now()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// The first Ctrl+C stops the crawl and still writes the report; a second
	// one exits straight away.
	finished := make(chan struct{})
	defer close(finished)

	go func() {
		select {
		case <-finished:
		case <-ctx.Done():
			stop()

			if !quiet {
				fmt.Fprintln(stderr, "\ninterrupted: finishing up (press Ctrl+C again to quit now)")
			}
		}
	}()

	pages := make(chan engine.Page, 256)

	var workers sync.WaitGroup

	for range runtime.NumCPU() {
		workers.Add(1)

		go func() {
			defer workers.Done()

			for pg := range pages {
				process(pg, sc, col, pr)
			}
		}()
	}

	var crawlFailed atomic.Bool

	runErr := engine.Run(ctx, cfg.engine, targets,
		func(pg engine.Page) { pages <- pg },
		func(target string, err error) {
			crawlFailed.Store(true)

			fmt.Fprintf(stderr, "%s: could not crawl %s: %v\n", toolName, target, err)
		})

	close(pages)
	workers.Wait()

	interrupted := ctx.Err() != nil
	rep := col.Build(toolName, version, targets, started, interrupted)

	if cfg.redact {
		for i := range rep.Findings {
			rep.Findings[i] = report.RedactFinding(rep.Findings[i])
		}
	}

	code := exitOK

	if runErr != nil {
		fmt.Fprintf(stderr, "%s: %v\n", toolName, runErr)

		code = exitError
	}

	if cfg.outDir != "" {
		if err := rep.WriteDir(cfg.outDir); err != nil {
			fmt.Fprintf(stderr, "%s: writing report: %v\n", toolName, err)

			code = exitError
		} else if !quiet {
			fmt.Fprintf(stderr, "\nreport: %s\n", filepath.Join(cfg.outDir, "report.html"))
		}
	}

	if !quiet {
		fmt.Fprintf(stderr, "\n%d URLs · %d fetched · %d forms · %d findings", rep.Stats.URLs, rep.Stats.Fetched,
			rep.Stats.Forms, rep.Stats.Findings)

		for _, sev := range []string{"critical", scan.High, scan.Medium, scan.Low, scan.Info} {
			if n := rep.Stats.BySeverity[sev]; n > 0 {
				fmt.Fprintf(stderr, " · %d %s", n, sev)
			}
		}

		fmt.Fprintf(stderr, " · %s\n", rep.Duration)
	}

	if code == exitOK && crawlFailed.Load() && rep.Stats.URLs == 0 {
		code = exitError
	}

	if code == exitOK && cfg.failOn != "" && col.MaxSeverity() >= scan.SeverityRank(cfg.failOn) {
		code = exitFindings
	}

	return code
}

func main() {
	os.Exit(run(os.Args[1:], os.Stdin, os.Stdout, os.Stderr))
}
