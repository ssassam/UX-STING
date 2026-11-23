// Package engine drives katana (github.com/projectdiscovery/katana) as a
// library and hands every crawled request/response to a callback.
package engine

import (
	"context"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/projectdiscovery/goflags"
	"github.com/projectdiscovery/gologger"
	"github.com/projectdiscovery/gologger/levels"
	"github.com/projectdiscovery/katana/pkg/engine/headless"
	"github.com/projectdiscovery/katana/pkg/engine/hybrid"
	"github.com/projectdiscovery/katana/pkg/engine/standard"
	"github.com/projectdiscovery/katana/pkg/output"
	"github.com/projectdiscovery/katana/pkg/types"
)

// seedParallelism is how many robots.txt / sitemap.xml URLs are crawled at once.
const seedParallelism = 10

// Browser modes.
const (
	BrowserOff      = ""
	BrowserHeadless = "headless" // katana -hl: full headless crawl
	BrowserHybrid   = "hybrid"   // katana -hh: HTTP crawl + browser rendering
)

// Config is the subset of katana's options kariddi exposes.
type Config struct {
	Depth          int
	Strategy       string
	FieldScope     string
	InScope        []string
	OutOfScope     []string
	Concurrency    int
	Parallelism    int
	RateLimit      int
	Delay          int
	Timeout        int
	Retries        int
	Duration       time.Duration
	MaxDomainPages int
	BodyReadSize   int

	JSCrawl bool
	JSLuice bool
	// KnownFiles is "all", "robotstxt", "sitemapxml" or "" (off). kariddi reads
	// the files itself; see knownfiles.go.
	KnownFiles     string
	KnownFilesMax  int
	FormExtraction bool
	AutoFormFill   bool
	PathClimb      bool
	TechDetect     bool
	XHR            bool
	IgnoreQuery    bool

	ExtensionMatch  []string
	ExtensionFilter []string

	Browser          string
	NoSandbox        bool
	SystemChrome     bool
	SystemChromePath string

	Headers   []string
	Proxy     string
	Resolvers []string

	// KatanaSecrets turns on katana's own (Titus-backed) secret extractor.
	KatanaSecrets bool
	// KatanaEndpoints turns on katana's API endpoint classifier.
	KatanaEndpoints bool
	// PageType turns on katana's page classifier (login, error, captcha, ...).
	PageType bool

	StoreResponseDir string
	Verbose          bool
}

// Form is an HTML form found on a page.
type Form struct {
	Method     string   `json:"method,omitempty"`
	Action     string   `json:"action,omitempty"`
	Enctype    string   `json:"enctype,omitempty"`
	Parameters []string `json:"parameters,omitempty"`
}

// Page is one crawl result: a request and, when it was fetched, its response.
type Page struct {
	Time        time.Time
	URL         string
	Method      string
	Source      string
	Tag         string
	Attribute   string
	Fetched     bool
	Status      int
	ContentType string
	Length      int64
	Body        string
	Forms       []Form
	Tech        []string
	XHR         []string
	Knowledge   map[string]any
	Error       string
}

// NormalizeTarget adds a scheme when the input has none, the same way katana's
// CLI does: http for ports 80/8080, https otherwise.
func NormalizeTarget(in string) (string, error) {
	in = strings.TrimSpace(in)
	if in == "" {
		return "", fmt.Errorf("empty target")
	}

	if !strings.Contains(in, "://") {
		host := in
		if i := strings.IndexAny(host, "/?#"); i >= 0 {
			host = host[:i]
		}

		scheme := "https"
		if strings.HasSuffix(host, ":80") || strings.HasSuffix(host, ":8080") {
			scheme = "http"
		}

		in = scheme + "://" + in
	}

	u, err := url.Parse(in)
	if err != nil {
		return "", fmt.Errorf("invalid target %q: %w", in, err)
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return "", fmt.Errorf("invalid target %q: only http and https are supported", in)
	}

	if u.Hostname() == "" {
		return "", fmt.Errorf("invalid target %q: no host", in)
	}

	return u.String(), nil
}

// resultTap forwards every result katana writes to onResult.
type resultTap struct {
	output.Writer
	onResult func(*output.Result)
}

func (t *resultTap) Write(r *output.Result) error {
	err := t.Writer.Write(r)
	if err == nil && r != nil {
		t.onResult(r)
	}

	return err
}

var ansi = regexp.MustCompile(`\x1b\[[0-9;]*m`)

// logWriter keeps katana's own result lines off the terminal (kariddi prints
// its own) and sends katana's diagnostics to stderr.
type logWriter struct {
	mu      sync.Mutex
	verbose bool
}

func (w *logWriter) Write(data []byte, level levels.Level) {
	if level == levels.LevelSilent {
		return
	}

	if !w.verbose && level != levels.LevelError && level != levels.LevelFatal {
		return
	}

	w.mu.Lock()
	defer w.mu.Unlock()

	_, _ = os.Stderr.Write(append([]byte("[katana] "), ansi.ReplaceAll(data, nil)...))
	_, _ = os.Stderr.Write([]byte("\n"))
}

// Run crawls every target and calls onPage for each result. onPage is called
// from several goroutines at once. It returns when all targets are done or
// ctx is cancelled; per-target crawl errors go to onError.
func Run(ctx context.Context, cfg Config, targets []string, onPage func(Page), onError func(target string, err error)) error {
	gologger.DefaultLogger.SetWriter(&logWriter{verbose: cfg.Verbose})

	// visited: URLs katana has reported; seeds: URLs taken from robots.txt and
	// sitemap.xml that were crawled as extra entry points.
	var visited, seeds sync.Map

	options := &types.Options{
		Context:                ctx,
		MaxDepth:               cfg.Depth,
		Strategy:               cfg.Strategy,
		FieldScope:             cfg.FieldScope,
		Scope:                  goflags.StringSlice(cfg.InScope),
		OutOfScope:             goflags.StringSlice(cfg.OutOfScope),
		Concurrency:            cfg.Concurrency,
		Parallelism:            cfg.Parallelism,
		RateLimit:              cfg.RateLimit,
		Delay:                  cfg.Delay,
		Timeout:                cfg.Timeout,
		Retries:                cfg.Retries,
		TimeStable:             1,
		CrawlDuration:          cfg.Duration,
		MaxDomainPages:         cfg.MaxDomainPages,
		BodyReadSize:           cfg.BodyReadSize,
		ScrapeJSResponses:      cfg.JSCrawl,
		ScrapeJSLuiceResponses: cfg.JSLuice,
		FormExtraction:         cfg.FormExtraction,
		AutomaticFormFill:      cfg.AutoFormFill,
		PathClimb:              cfg.PathClimb,
		TechDetect:             cfg.TechDetect,
		XhrExtraction:          cfg.XHR,
		IgnoreQueryParams:      cfg.IgnoreQuery,
		ExtensionsMatch:        goflags.StringSlice(cfg.ExtensionMatch),
		ExtensionFilter:        goflags.StringSlice(cfg.ExtensionFilter),
		Headless:               cfg.Browser == BrowserHeadless,
		HeadlessHybrid:         cfg.Browser == BrowserHybrid,
		HeadlessNoSandbox:      cfg.NoSandbox,
		UseInstalledChrome:     cfg.SystemChrome || cfg.SystemChromePath != "",
		SystemChromePath:       cfg.SystemChromePath,
		CustomHeaders:          goflags.StringSlice(cfg.Headers),
		Proxy:                  cfg.Proxy,
		Resolvers:              goflags.StringSlice(cfg.Resolvers),
		Secrets:                cfg.KatanaSecrets,
		Endpoints:              cfg.KatanaEndpoints,
		KnowledgeBase:          cfg.PageType,
		StoreResponse:          cfg.StoreResponseDir != "",
		StoreResponseDir:       cfg.StoreResponseDir,
		NoColors:               true,
		DisableUpdateCheck:     true,
	}

	crawlerOptions, err := types.NewCrawlerOptions(options)
	if err != nil {
		return fmt.Errorf("katana options: %w", err)
	}
	defer func() { _ = crawlerOptions.Close() }()

	// Results are taken from katana's output writer rather than its OnResult
	// hook: the headless engine writes results without ever calling OnResult.
	crawlerOptions.OutputWriter = &resultTap{Writer: crawlerOptions.OutputWriter, onResult: func(r *output.Result) {
		p := toPage(*r)
		visited.Store(strings.TrimSuffix(p.URL, "/"), true)

		if _, ok := seeds.Load(p.URL); ok && p.Tag == "" {
			p.Tag, p.Attribute = "known-file", "robots/sitemap"
		}

		onPage(p)
	}}

	// katana's Verbose option also starts a debug HTTP server in headless
	// mode, so it stays off; logWriter decides what reaches the terminal.
	gologger.DefaultLogger.SetMaxLevel(levels.LevelInfo)

	if !cfg.Verbose {
		crawlerOptions.Logger = slog.New(slog.DiscardHandler)
	}

	var crawler interface {
		Crawl(string) error
		Close() error
	}

	switch cfg.Browser {
	case BrowserHeadless:
		crawler, err = headless.New(crawlerOptions)
	case BrowserHybrid:
		crawler, err = hybrid.New(crawlerOptions)
	case BrowserOff:
		crawler, err = standard.New(crawlerOptions)
	default:
		return fmt.Errorf("unknown browser mode %q (want headless or hybrid)", cfg.Browser)
	}

	if err != nil {
		return fmt.Errorf("katana engine: %w", err)
	}
	defer func() { _ = crawler.Close() }()

	parallel := cfg.Parallelism
	if parallel < 1 {
		parallel = 1
	}

	var (
		wg  sync.WaitGroup
		sem = make(chan struct{}, parallel)
	)

	for _, target := range targets {
		if ctx.Err() != nil {
			break
		}

		wg.Add(1)

		sem <- struct{}{}

		go func(target string) {
			defer wg.Done()
			defer func() { <-sem }()

			// Read robots.txt / sitemap.xml while the main crawl runs.
			found := make(chan []string, 1)
			go func() { found <- KnownFileSeeds(ctx, cfg, target, cfg.KnownFilesMax) }()

			if err := crawler.Crawl(target); err != nil && ctx.Err() == nil && onError != nil {
				onError(target, err)
			}

			// Crawl the known-file URLs the main crawl did not reach by itself.
			var (
				seedWG  sync.WaitGroup
				seedSem = make(chan struct{}, seedParallelism)
			)

			for _, seed := range <-found {
				if _, done := visited.Load(strings.TrimSuffix(seed, "/")); done || ctx.Err() != nil {
					continue
				}

				seeds.Store(seed, true)
				seedWG.Add(1)

				seedSem <- struct{}{}

				go func(seed string) {
					defer seedWG.Done()
					defer func() { <-seedSem }()

					_ = crawler.Crawl(seed)
				}(seed)
			}

			seedWG.Wait()
		}(target)
	}

	wg.Wait()

	return nil
}

func toPage(r output.Result) Page {
	p := Page{Time: r.Timestamp, Error: r.Error}

	if req := r.Request; req != nil {
		p.URL = req.URL
		p.Method = req.Method
		p.Source = req.Source
		p.Tag = req.Tag
		p.Attribute = req.Attribute
	}

	if p.Method == "" {
		p.Method = "GET"
	}

	resp := r.Response
	if resp == nil {
		return p
	}

	p.Fetched = resp.StatusCode != 0
	p.Status = resp.StatusCode
	p.Length = resp.ContentLength
	p.Body = resp.Body
	p.Tech = resp.Technologies
	p.Knowledge = resp.KnowledgeBase

	for name, value := range resp.Headers {
		if strings.EqualFold(strings.ReplaceAll(name, "_", "-"), "content-type") {
			p.ContentType = value
			break
		}
	}

	if p.Length <= 0 {
		p.Length = int64(len(resp.Body))
	}

	for _, f := range resp.Forms {
		p.Forms = append(p.Forms, Form{Method: f.Method, Action: f.Action, Enctype: f.Enctype, Parameters: f.Parameters})
	}

	for _, x := range resp.XhrRequests {
		if x.URL != "" {
			p.XHR = append(p.XHR, x.URL)
		}
	}

	return p
}
