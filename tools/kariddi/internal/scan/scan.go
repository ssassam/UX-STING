// Package scan runs cariddi's detection rules (secrets, juicy parameters,
// juicy file extensions, error messages and useful information) over URLs
// and response bodies handed to it by the crawl engine.
//
// The rule sets come straight from github.com/edoardottt/cariddi/pkg/scanner,
// so kariddi follows upstream whenever that module is upgraded.
package scan

import (
	"net/url"
	"regexp"
	"runtime"
	"sort"
	"strings"
	"sync"

	"github.com/edoardottt/cariddi/pkg/scanner"
)

// Severity levels, most to least important.
const (
	High   = "high"
	Medium = "medium"
	Low    = "low"
	Info   = "info"
)

// Finding types.
const (
	TypeSecret    = "secret"
	TypeEndpoint  = "endpoint"
	TypeExtension = "extension"
	TypeError     = "error"
	TypeInfo      = "info"
	TypeAPI       = "api"
)

// Engine names recorded on each finding.
const (
	EngineCariddi = "cariddi"
	EngineKatana  = "katana"
)

// Finding is one thing worth a human look.
type Finding struct {
	Type     string         `json:"type"`
	Name     string         `json:"name"`
	Severity string         `json:"severity"`
	URL      string         `json:"url"`
	Match    string         `json:"match,omitempty"`
	Engine   string         `json:"engine"`
	Detail   map[string]any `json:"detail,omitempty"`
}

// Key identifies a finding for de-duplication.
func (f Finding) Key() string {
	return f.Type + "\x00" + f.Name + "\x00" + f.URL + "\x00" + f.Match
}

// SeverityRank orders severities; higher is more severe. Unknown values rank 0.
func SeverityRank(s string) int {
	switch strings.ToLower(s) {
	case "critical":
		return 5
	case High:
		return 4
	case Medium:
		return 3
	case Low:
		return 2
	case Info:
		return 1
	}

	return 0
}

// Options selects which cariddi detectors run.
type Options struct {
	Secrets   bool
	Endpoints bool
	Errors    bool
	Info      bool
	// ExtLevel is cariddi's -ext level: 1 keeps only the juiciest file types,
	// 7 keeps every known one, 0 disables the detector.
	ExtLevel int
	// CustomSecrets replaces the built-in secret rules when non-empty.
	CustomSecrets []*regexp.Regexp
	// CustomParams replaces the built-in juicy parameter list when non-empty.
	CustomParams []string
	// MaxBody caps how many bytes of a body are scanned (0 = no cap).
	MaxBody int
}

// Scanner applies the selected detectors. It is safe for concurrent use.
type Scanner struct {
	opts   Options
	params map[string][]string
	exts   []scanner.FileType
	sem    chan struct{}
}

// New builds a Scanner.
func New(opts Options) *Scanner {
	s := &Scanner{
		opts:   opts,
		params: map[string][]string{},
		sem:    make(chan struct{}, runtime.GOMAXPROCS(0)),
	}

	if len(opts.CustomParams) > 0 {
		for _, p := range opts.CustomParams {
			if p = strings.ToLower(strings.TrimSpace(p)); p != "" {
				s.params[p] = nil
			}
		}
	} else {
		for _, p := range scanner.GetJuicyParameters() {
			s.params[strings.ToLower(p.Parameter)] = p.Attacks
		}
	}

	// Longest extension first so "tar.gz" wins over "gz".
	s.exts = append(s.exts, scanner.GetExtensions()...)
	sort.SliceStable(s.exts, func(i, j int) bool {
		return len(s.exts[i].Extension) > len(s.exts[j].Extension)
	})

	return s
}

// URL checks a discovered URL for juicy query parameters and file extensions.
func (s *Scanner) URL(rawURL string) []Finding {
	var out []Finding

	u, err := url.Parse(rawURL)
	if err != nil {
		return nil
	}

	if s.opts.Endpoints && u.RawQuery != "" {
		query, _ := url.ParseQuery(u.RawQuery)

		names := make([]string, 0, len(query))
		for name := range query {
			names = append(names, name)
		}

		out = append(out, s.Params(rawURL, names, "query")...)
	}

	if s.opts.ExtLevel > 0 {
		path := strings.ToLower(u.Path)
		for _, ext := range s.exts {
			if ext.Severity <= s.opts.ExtLevel && strings.HasSuffix(path, "."+ext.Extension) {
				out = append(out, Finding{
					Type:     TypeExtension,
					Name:     "." + ext.Extension + " file",
					Severity: extSeverity(ext.Severity),
					URL:      rawURL,
					Match:    ext.Extension,
					Engine:   EngineCariddi,
					Detail:   map[string]any{"level": ext.Severity},
				})

				break
			}
		}
	}

	return out
}

// Params matches parameter names (from a query string or a form) against
// cariddi's juicy parameter list. where says where the names were seen.
func (s *Scanner) Params(rawURL string, names []string, where string) []Finding {
	if !s.opts.Endpoints {
		return nil
	}

	sort.Strings(names)

	var out []Finding

	seen := map[string]bool{}

	for _, name := range names {
		key := strings.ToLower(name)

		attacks, ok := s.params[key]
		if !ok || seen[key] {
			continue
		}

		seen[key] = true

		f := Finding{
			Type:     TypeEndpoint,
			Name:     "Juicy parameter",
			Severity: paramSeverity(attacks),
			URL:      rawURL,
			Match:    name,
			Engine:   EngineCariddi,
			Detail:   map[string]any{"in": where},
		}
		if len(attacks) > 0 {
			f.Detail["attacks"] = attacks
		}

		out = append(out, f)
	}

	return out
}

// Body runs the body detectors (secrets, errors, info) over a response body.
func (s *Scanner) Body(rawURL, body string) []Finding {
	const minBody = 10 // same floor cariddi uses before hunting secrets

	if s.opts.MaxBody > 0 && len(body) > s.opts.MaxBody {
		body = body[:s.opts.MaxBody]
	}

	var (
		out []Finding
		mu  sync.Mutex
		wg  sync.WaitGroup
	)

	run := func(fn func() []Finding) {
		wg.Add(1)

		go func() {
			defer wg.Done()

			s.sem <- struct{}{}

			found := fn()

			<-s.sem

			if len(found) == 0 {
				return
			}

			mu.Lock()
			out = append(out, found...)
			mu.Unlock()
		}()
	}

	if s.opts.Secrets && len(body) > minBody {
		if len(s.opts.CustomSecrets) > 0 {
			for _, re := range s.opts.CustomSecrets {
				run(func() []Finding { return matchCustomSecret(re, rawURL, body) })
			}
		} else {
			for _, rule := range scanner.GetSecretRegexes() {
				run(func() []Finding { return matchSecret(rule, rawURL, body) })
			}
		}
	}

	if s.opts.Errors {
		for _, rule := range scanner.GetErrorRegexes() {
			run(func() []Finding {
				return matchAll(&rule.Regex, rawURL, body, TypeError, rule.ErrorName, Medium)
			})
		}
	}

	if s.opts.Info {
		for _, rule := range scanner.GetInfoRegexes() {
			run(func() []Finding {
				return matchAll(&rule.Regex, rawURL, body, TypeInfo, rule.Name, Info)
			})
		}
	}

	wg.Wait()

	sort.SliceStable(out, func(i, j int) bool { return out[i].Key() < out[j].Key() })

	return dedupe(out)
}

func matchSecret(rule scanner.Secret, rawURL, body string) []Finding {
	var out []Finding

	for _, m := range rule.Regex.FindAllString(body, -1) {
		lower := strings.ToLower(m)
		falsePositive := false

		for _, fp := range rule.FalsePositives {
			if strings.Contains(lower, fp) {
				falsePositive = true
				break
			}
		}

		if falsePositive {
			continue
		}

		f := Finding{
			Type:     TypeSecret,
			Name:     rule.Name,
			Severity: High,
			URL:      rawURL,
			Match:    strings.TrimSpace(m),
			Engine:   EngineCariddi,
		}

		detail := map[string]any{}
		if rule.Description != "" && rule.Description != rule.Name {
			detail["description"] = rule.Description
		}

		if rule.Poc != "" && rule.Poc != "?" {
			detail["poc"] = rule.Poc
		}

		if len(detail) > 0 {
			f.Detail = detail
		}

		out = append(out, f)
	}

	return out
}

func matchCustomSecret(re *regexp.Regexp, rawURL, body string) []Finding {
	return matchAll(re, rawURL, body, TypeSecret, "Custom rule: "+re.String(), High)
}

func matchAll(re *regexp.Regexp, rawURL, body, typ, name, severity string) []Finding {
	var out []Finding

	for _, m := range re.FindAllString(body, -1) {
		out = append(out, Finding{
			Type:     typ,
			Name:     name,
			Severity: severity,
			URL:      rawURL,
			Match:    strings.TrimSpace(m),
			Engine:   EngineCariddi,
		})
	}

	return out
}

func dedupe(in []Finding) []Finding {
	seen := make(map[string]bool, len(in))
	out := in[:0]

	for _, f := range in {
		if key := f.Key(); !seen[key] {
			seen[key] = true

			out = append(out, f)
		}
	}

	return out
}

// paramSeverity: a parameter that only leaks information is low, one tied to
// an attack class (SQLi, XSS, SSRF, LFI, ...) is worth a closer look.
func paramSeverity(attacks []string) string {
	for _, a := range attacks {
		if !strings.EqualFold(a, "info") {
			return Medium
		}
	}

	return Low
}

func extSeverity(level int) string {
	switch {
	case level <= 1:
		return High
	case level <= 3:
		return Medium
	default:
		return Low
	}
}

// IsTextual reports whether a response with this Content-Type is worth
// running regexes over. An empty type is treated as text.
func IsTextual(contentType string) bool {
	ct := strings.ToLower(strings.TrimSpace(strings.SplitN(contentType, ";", 2)[0]))
	if ct == "" {
		return true
	}

	for _, prefix := range []string{"image/", "audio/", "video/", "font/"} {
		if strings.HasPrefix(ct, prefix) && ct != "image/svg+xml" {
			return false
		}
	}

	switch ct {
	case "application/octet-stream", "application/zip", "application/gzip", "application/pdf",
		"application/wasm", "application/x-tar", "application/x-7z-compressed",
		"application/vnd.ms-fontobject", "application/font-woff", "application/font-woff2":
		return false
	}

	return true
}
