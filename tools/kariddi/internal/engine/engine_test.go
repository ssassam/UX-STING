package engine

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"sort"
	"testing"
)

func TestNormalizeTarget(t *testing.T) {
	ok := map[string]string{
		"example.com":               "https://example.com",
		"example.com:8080/app":      "http://example.com:8080/app",
		"example.com:80":            "http://example.com:80",
		" http://example.com/a?b=1": "http://example.com/a?b=1",
		"https://example.com:8443":  "https://example.com:8443",
	}

	for in, want := range ok {
		got, err := NormalizeTarget(in)
		if err != nil || got != want {
			t.Errorf("NormalizeTarget(%q) = %q, %v; want %q", in, got, err, want)
		}
	}

	for _, bad := range []string{"", "   ", "ftp://example.com", "file:///etc/passwd", "http://"} {
		if got, err := NormalizeTarget(bad); err == nil {
			t.Errorf("NormalizeTarget(%q) = %q, want an error", bad, got)
		}
	}
}

func TestParseRobots(t *testing.T) {
	paths, sitemaps := ParseRobots(`# comment
User-agent: *
Disallow: /admin/
Allow: /public/page.html # trailing comment
Disallow: /private/*.php$
Disallow: /
Disallow:
disallow: relative
Sitemap: https://example.test/sitemap-news.xml
`)

	if want := []string{"/admin/", "/public/page.html", "/private/"}; !reflect.DeepEqual(paths, want) {
		t.Errorf("paths = %v, want %v", paths, want)
	}

	if want := []string{"https://example.test/sitemap-news.xml"}; !reflect.DeepEqual(sitemaps, want) {
		t.Errorf("sitemaps = %v, want %v", sitemaps, want)
	}
}

func TestParseSitemap(t *testing.T) {
	got := ParseSitemap(`<urlset><url><loc> https://example.test/a?x=1&amp;y=2 </loc></url>
<url><LOC><![CDATA[https://example.test/b]]></LOC></url><url><loc></loc></url></urlset>`)

	if want := []string{"https://example.test/a?x=1&y=2", "https://example.test/b"}; !reflect.DeepEqual(got, want) {
		t.Errorf("ParseSitemap = %v, want %v", got, want)
	}
}

func TestKnownFileSeeds(t *testing.T) {
	var srv *httptest.Server

	srv = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/robots.txt":
			fmt.Fprintf(w, "Disallow: /hidden/\nSitemap: %s/more.xml\n", srv.URL)
		case "/sitemap.xml":
			fmt.Fprintf(w, "<urlset><url><loc>%s/from-sitemap</loc></url>"+
				"<url><loc>https://elsewhere.example.org/off-host</loc></url></urlset>", srv.URL)
		case "/more.xml":
			fmt.Fprintf(w, "<urlset><url><loc>%s/from-robots-sitemap</loc></url></urlset>", srv.URL)
		default:
			http.NotFound(w, r)
		}
	}))
	defer srv.Close()

	cfg := Config{KnownFiles: "all", Timeout: 5}

	got := KnownFileSeeds(context.Background(), cfg, srv.URL, 50)
	sort.Strings(got)

	want := []string{srv.URL + "/from-robots-sitemap", srv.URL + "/from-sitemap", srv.URL + "/hidden/"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("seeds = %v, want %v", got, want)
	}

	if got := KnownFileSeeds(context.Background(), cfg, srv.URL, 1); len(got) != 1 {
		t.Errorf("limit 1 returned %v", got)
	}

	cfg.KnownFiles = "robotstxt"
	if got := KnownFileSeeds(context.Background(), cfg, srv.URL, 50); !reflect.DeepEqual(got, []string{srv.URL + "/hidden/"}) {
		t.Errorf("robotstxt only: %v", got)
	}

	cfg.KnownFiles = ""
	if got := KnownFileSeeds(context.Background(), cfg, srv.URL, 50); got != nil {
		t.Errorf("off: %v", got)
	}
}
