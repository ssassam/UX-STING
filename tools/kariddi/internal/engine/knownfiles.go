package engine

import (
	"bufio"
	"context"
	"html"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

// katana v1.8.0 fetches robots.txt and sitemap.xml but then drops every URL it
// finds there: those requests carry no root hostname, so its scope check
// rejects them. kariddi therefore reads the two files itself (as cariddi does)
// and hands the URLs to katana as extra crawl seeds.

const (
	knownFileBodyLimit = 5 * 1024 * 1024
	maxSitemaps        = 5
	defaultUserAgent   = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) " +
		"Chrome/126.0.0.0 Safari/537.36"
)

var sitemapLoc = regexp.MustCompile(`(?is)<loc>\s*(.*?)\s*</loc>`)

// ParseRobots returns the paths and sitemap URLs named in a robots.txt body.
func ParseRobots(body string) (paths, sitemaps []string) {
	sc := bufio.NewScanner(strings.NewReader(body))
	sc.Buffer(make([]byte, 64*1024), 1024*1024)

	for sc.Scan() {
		line := sc.Text()
		if i := strings.Index(line, "#"); i >= 0 {
			line = line[:i]
		}

		name, value, ok := strings.Cut(line, ":")
		if !ok {
			continue
		}

		value = strings.TrimSpace(value)

		switch strings.ToLower(strings.TrimSpace(name)) {
		case "allow", "disallow":
			// Keep the literal prefix of wildcard rules: "/private/*.php" -> "/private/".
			if i := strings.IndexAny(value, "*$"); i >= 0 {
				value = value[:i]
			}

			if value != "" && value != "/" && strings.HasPrefix(value, "/") {
				paths = append(paths, value)
			}
		case "sitemap":
			if value != "" {
				sitemaps = append(sitemaps, value)
			}
		}
	}

	return paths, sitemaps
}

// ParseSitemap returns every <loc> value in a sitemap or sitemap index.
func ParseSitemap(body string) []string {
	var out []string

	for _, m := range sitemapLoc.FindAllStringSubmatch(body, -1) {
		loc := strings.TrimSpace(m[1])
		loc = strings.TrimSuffix(strings.TrimPrefix(loc, "<![CDATA["), "]]>")

		if loc = html.UnescapeString(strings.TrimSpace(loc)); loc != "" {
			out = append(out, loc)
		}
	}

	return out
}

func knownFileClient(cfg Config) *http.Client {
	transport := http.DefaultTransport.(*http.Transport).Clone()

	if cfg.Proxy != "" {
		if proxyURL, err := url.Parse(cfg.Proxy); err == nil {
			transport.Proxy = http.ProxyURL(proxyURL)
		}
	}

	timeout := time.Duration(cfg.Timeout) * time.Second
	if timeout <= 0 {
		timeout = 10 * time.Second
	}

	return &http.Client{Transport: transport, Timeout: timeout}
}

func fetchText(ctx context.Context, client *http.Client, cfg Config, target string) (string, bool) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target, nil)
	if err != nil {
		return "", false
	}

	req.Header.Set("User-Agent", defaultUserAgent)

	for _, h := range cfg.Headers {
		if name, value, ok := strings.Cut(h, ":"); ok {
			req.Header.Set(strings.TrimSpace(name), strings.TrimSpace(value))
		}
	}

	resp, err := client.Do(req)
	if err != nil {
		return "", false
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return "", false
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, knownFileBodyLimit))
	if err != nil {
		return "", false
	}

	return string(body), true
}

// KnownFileSeeds reads robots.txt and/or sitemap.xml for target and returns up
// to limit URLs on the same host that are worth crawling.
func KnownFileSeeds(ctx context.Context, cfg Config, target string, limit int) []string {
	if cfg.KnownFiles == "" || limit <= 0 {
		return nil
	}

	base, err := url.Parse(target)
	if err != nil {
		return nil
	}

	root := &url.URL{Scheme: base.Scheme, Host: base.Host}
	client := knownFileClient(cfg)

	var (
		out  []string
		seen = map[string]bool{strings.TrimSuffix(base.String(), "/"): true}
	)

	add := func(ref string) {
		u, err := root.Parse(ref)
		if err != nil || (u.Scheme != "http" && u.Scheme != "https") || !strings.EqualFold(u.Hostname(), base.Hostname()) {
			return
		}

		u.Fragment = ""

		s := u.String()
		if key := strings.TrimSuffix(s, "/"); !seen[key] && len(out) < limit {
			seen[key] = true

			out = append(out, s)
		}
	}

	sitemaps := []string{}

	if cfg.KnownFiles == "all" || cfg.KnownFiles == "robotstxt" {
		if body, ok := fetchText(ctx, client, cfg, root.String()+"/robots.txt"); ok {
			paths, fromRobots := ParseRobots(body)

			for _, p := range paths {
				add(p)
			}

			if cfg.KnownFiles == "all" {
				sitemaps = append(sitemaps, fromRobots...)
			}
		}
	}

	if cfg.KnownFiles == "all" || cfg.KnownFiles == "sitemapxml" {
		queue := append([]string{root.String() + "/sitemap.xml"}, sitemaps...)
		fetched := map[string]bool{}

		for i := 0; i < len(queue) && len(fetched) < maxSitemaps && len(out) < limit; i++ {
			u, err := root.Parse(queue[i])
			if err != nil || !strings.EqualFold(u.Hostname(), base.Hostname()) || fetched[u.String()] {
				continue
			}

			fetched[u.String()] = true

			body, ok := fetchText(ctx, client, cfg, u.String())
			if !ok {
				continue
			}

			for _, loc := range ParseSitemap(body) {
				// A sitemap index points at more sitemaps; follow those instead.
				if strings.HasSuffix(strings.ToLower(strings.SplitN(loc, "?", 2)[0]), ".xml") {
					queue = append(queue, loc)
					continue
				}

				add(loc)
			}
		}
	}

	return out
}
