// Package report collects crawl results and findings, de-duplicates them and
// writes them out as text, JSON Lines, JSON and a self-contained HTML page.
package report

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/ssassam/UX-STING/tools/kariddi/internal/engine"
	"github.com/ssassam/UX-STING/tools/kariddi/internal/scan"
)

// URLRecord is one discovered URL.
type URLRecord struct {
	URL         string   `json:"url"`
	Method      string   `json:"method"`
	Status      int      `json:"status,omitempty"`
	ContentType string   `json:"content_type,omitempty"`
	Length      int64    `json:"length,omitempty"`
	Source      string   `json:"source,omitempty"`
	Tag         string   `json:"tag,omitempty"`
	Attribute   string   `json:"attribute,omitempty"`
	PageType    string   `json:"page_type,omitempty"`
	Tech        []string `json:"technologies,omitempty"`
	Error       string   `json:"error,omitempty"`
}

// FormRecord is an HTML form and the page it was found on.
type FormRecord struct {
	Page string `json:"page"`
	engine.Form
}

// Stats summarises a run.
type Stats struct {
	URLs       int            `json:"urls"`
	Fetched    int            `json:"fetched"`
	Forms      int            `json:"forms"`
	Findings   int            `json:"findings"`
	BySeverity map[string]int `json:"by_severity"`
	ByType     map[string]int `json:"by_type"`
	ByStatus   map[string]int `json:"by_status"`
}

// Report is the full result of a run.
type Report struct {
	Tool         string              `json:"tool"`
	Version      string              `json:"version"`
	Started      time.Time           `json:"started"`
	Finished     time.Time           `json:"finished"`
	Duration     string              `json:"duration"`
	Targets      []string            `json:"targets"`
	Interrupted  bool                `json:"interrupted,omitempty"`
	Stats        Stats               `json:"stats"`
	Technologies map[string][]string `json:"technologies,omitempty"`
	Findings     []scan.Finding      `json:"findings"`
	Forms        []FormRecord        `json:"forms,omitempty"`
	URLs         []URLRecord         `json:"urls"`
}

// Collector gathers results from concurrent goroutines.
type Collector struct {
	mu       sync.Mutex
	urls     map[string]*URLRecord
	order    []string
	findings map[string]scan.Finding
	forms    map[string]FormRecord
	tech     map[string]map[string]bool
}

// NewCollector returns an empty Collector.
func NewCollector() *Collector {
	return &Collector{
		urls:     map[string]*URLRecord{},
		findings: map[string]scan.Finding{},
		forms:    map[string]FormRecord{},
		tech:     map[string]map[string]bool{},
	}
}

// AddPage records a crawl result. It reports whether the URL is new.
func (c *Collector) AddPage(p engine.Page) bool {
	if p.URL == "" {
		return false
	}

	key := p.Method + " " + p.URL

	c.mu.Lock()
	defer c.mu.Unlock()

	rec, seen := c.urls[key]
	if !seen {
		rec = &URLRecord{URL: p.URL, Method: p.Method, Source: p.Source, Tag: p.Tag, Attribute: p.Attribute}
		c.urls[key] = rec
		c.order = append(c.order, key)
	}

	// A later fetch of a URL first seen as a bare link fills in the response.
	if p.Fetched && rec.Status == 0 {
		rec.Status = p.Status
		rec.ContentType = p.ContentType
		rec.Length = p.Length
		rec.Tech = p.Tech

		if pt, ok := p.Knowledge["PageType"]; ok {
			rec.PageType = fmt.Sprint(pt)
		}
	}

	if p.Error != "" && rec.Error == "" {
		rec.Error = p.Error
	}

	if len(p.Tech) > 0 {
		if u, err := url.Parse(p.URL); err == nil {
			host := u.Host
			if c.tech[host] == nil {
				c.tech[host] = map[string]bool{}
			}

			for _, t := range p.Tech {
				c.tech[host][t] = true
			}
		}
	}

	for _, f := range p.Forms {
		fk := f.Method + " " + f.Action + " " + strings.Join(f.Parameters, ",")
		if _, ok := c.forms[fk]; !ok {
			c.forms[fk] = FormRecord{Page: p.URL, Form: f}
		}
	}

	return !seen
}

// AddFinding records a finding. It reports whether the finding is new.
func (c *Collector) AddFinding(f scan.Finding) bool {
	key := f.Key()

	c.mu.Lock()
	defer c.mu.Unlock()

	if _, ok := c.findings[key]; ok {
		return false
	}

	c.findings[key] = f

	return true
}

// MaxSeverity returns the rank of the most severe finding collected so far.
func (c *Collector) MaxSeverity() int {
	c.mu.Lock()
	defer c.mu.Unlock()

	highest := 0
	for _, f := range c.findings {
		if r := scan.SeverityRank(f.Severity); r > highest {
			highest = r
		}
	}

	return highest
}

// Build freezes the collected data into a Report.
func (c *Collector) Build(tool, version string, targets []string, started time.Time, interrupted bool) *Report {
	c.mu.Lock()
	defer c.mu.Unlock()

	finished := time.Now()
	r := &Report{
		Tool:        tool,
		Version:     version,
		Started:     started.UTC(),
		Finished:    finished.UTC(),
		Duration:    finished.Sub(started).Round(time.Millisecond).String(),
		Targets:     targets,
		Interrupted: interrupted,
		Findings:    make([]scan.Finding, 0, len(c.findings)),
		URLs:        make([]URLRecord, 0, len(c.urls)),
		Stats: Stats{
			BySeverity: map[string]int{},
			ByType:     map[string]int{},
			ByStatus:   map[string]int{},
		},
	}

	for _, key := range c.order {
		rec := *c.urls[key]
		r.URLs = append(r.URLs, rec)

		if rec.Status != 0 {
			r.Stats.Fetched++
			r.Stats.ByStatus[fmt.Sprintf("%dxx", rec.Status/100)]++
		}
	}

	sort.SliceStable(r.URLs, func(i, j int) bool { return r.URLs[i].URL < r.URLs[j].URL })

	for _, f := range c.findings {
		r.Findings = append(r.Findings, f)
		r.Stats.BySeverity[f.Severity]++
		r.Stats.ByType[f.Type]++
	}

	sort.SliceStable(r.Findings, func(i, j int) bool {
		a, b := r.Findings[i], r.Findings[j]
		if ra, rb := scan.SeverityRank(a.Severity), scan.SeverityRank(b.Severity); ra != rb {
			return ra > rb
		}

		return a.Key() < b.Key()
	})

	for _, f := range c.forms {
		r.Forms = append(r.Forms, f)
	}

	sort.SliceStable(r.Forms, func(i, j int) bool {
		if r.Forms[i].Action != r.Forms[j].Action {
			return r.Forms[i].Action < r.Forms[j].Action
		}

		return r.Forms[i].Page < r.Forms[j].Page
	})

	if len(c.tech) > 0 {
		r.Technologies = map[string][]string{}

		for host, set := range c.tech {
			for t := range set {
				r.Technologies[host] = append(r.Technologies[host], t)
			}

			sort.Strings(r.Technologies[host])
		}
	}

	r.Stats.URLs = len(r.URLs)
	r.Stats.Forms = len(r.Forms)
	r.Stats.Findings = len(r.Findings)

	return r
}

// Redact masks the middle of a secret so reports can be shared.
func Redact(s string) string {
	const keep = 4

	runes := []rune(s)
	if len(runes) <= keep*2 {
		return strings.Repeat("*", len(runes))
	}

	return string(runes[:keep]) + strings.Repeat("*", 8) + string(runes[len(runes)-2:]) +
		fmt.Sprintf(" (%d chars)", len(runes))
}

// RedactFinding returns f with a secret's matched value masked.
func RedactFinding(f scan.Finding) scan.Finding {
	if f.Type == scan.TypeSecret && f.Match != "" {
		f.Match = Redact(f.Match)
	}

	return f
}

// WriteDir writes urls.txt, findings.jsonl, report.json and report.html.
func (r *Report) WriteDir(dir string) error {
	if err := os.MkdirAll(dir, 0o750); err != nil {
		return err
	}

	if err := writeLines(filepath.Join(dir, "urls.txt"), func(w *bufio.Writer) error {
		seen := map[string]bool{}

		for _, u := range r.URLs {
			if !seen[u.URL] {
				seen[u.URL] = true

				if _, err := fmt.Fprintln(w, u.URL); err != nil {
					return err
				}
			}
		}

		return nil
	}); err != nil {
		return err
	}

	if err := writeLines(filepath.Join(dir, "findings.jsonl"), func(w *bufio.Writer) error {
		enc := json.NewEncoder(w)
		enc.SetEscapeHTML(false)

		for _, f := range r.Findings {
			if err := enc.Encode(f); err != nil {
				return err
			}
		}

		return nil
	}); err != nil {
		return err
	}

	if err := writeLines(filepath.Join(dir, "report.json"), func(w *bufio.Writer) error {
		enc := json.NewEncoder(w)
		enc.SetEscapeHTML(false)
		enc.SetIndent("", "  ")

		return enc.Encode(r)
	}); err != nil {
		return err
	}

	return writeLines(filepath.Join(dir, "report.html"), func(w *bufio.Writer) error {
		return r.WriteHTML(w)
	})
}

func writeLines(path string, fn func(*bufio.Writer) error) error {
	// Reports can hold live secrets: owner-only.
	f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		return err
	}

	w := bufio.NewWriter(f)

	if err := fn(w); err != nil {
		_ = f.Close()
		return err
	}

	if err := w.Flush(); err != nil {
		_ = f.Close()
		return err
	}

	return f.Close()
}
