# SEO feature matrix

**✔** shipped & tested · **◐** partial · **✗** missing · *(det)* deterministic · *(ai)* AI interpretation

| Feature | Claude SEO | UX-STING before | UX-STING now | Planned package |
| --- | --- | --- | --- | --- |
| Typed JSON-LD builders (Organization, WebSite, BreadcrumbList, Article/BlogPosting, Product/Offer, LocalBusiness/Restaurant/Hotel, Service, Event, Recipe, JobPosting) | ✗ (templates) | ✗ (hand-written) | ✔ | seo-schema |
| Safe JSON-LD serialization (`</script>`, U+2028) | ◐ | ◐ (`<` only) | ✔ | seo-schema |
| JSON-LD extraction from HTML | ✔ | ✗ | ✔ linear-time | seo-schema |
| schema.org validity checks *(det)* | ✔ prose | ✗ | ✔ | seo-schema |
| Google rich-result eligibility, cited and dated *(det)* | ◐ prose | ✗ | ✔ | seo-schema |
| Self-serving review detection | ✔ | ✗ | ✔ | seo-schema |
| Retired features (FAQ, HowTo, 2025 set) | ✔ | ✗ | ✔ | seo-schema |
| Microdata / RDFa detection | ✔ | ✗ | ✗ | seo-audit |
| Metadata factory (title, description, canonical, OG, Twitter) | ✗ | ◐ ×6 copies | ◐ | seo-nextjs |
| Title/description length & duplication *(det)* | ✔ | ✗ | ✗ | seo-core / seo-audit |
| Canonical resolution & conflicts *(det)* | ✔ | ◐ | ◐ | seo-core |
| Hreflang generation | ✔ | ✗ | ✗ | seo-core / seo-nextjs |
| Hreflang validation (self, reciprocity, codes, x-default) *(det)* | ✔ | ✗ | ✗ | seo-core |
| robots.txt / meta robots / X-Robots-Tag checks *(det)* | ✔ | ◐ | ◐ | seo-core |
| Sitemap build + XML validation *(det)* | ✔ | ◐ | ◐ | seo-core |
| Indexing policy for programmatic pages *(det)* | ◐ quality gates | ✗ | ✗ | seo-core |
| Internal link graph, orphans, broken links *(det)* | ✔ | ✗ | ✗ | seo-audit |
| Descriptive anchor text *(det + ai)* | ✔ | ◐ (a11y lint) | ◐ | seo-audit |
| Heading hierarchy *(det)* | ✔ | ✔ (`Heading level`) | ✔ | — |
| Image alt / dimensions / formats *(det)* | ✔ | ✔ (`Image`) | ✔ | seo-audit (crawl check) |
| Core Web Vitals lab (Lighthouse) | ✔ PSI API | ✗ | ✗ | seo-audit |
| CWV field data (CrUX) | ✔ | ✗ | ✗ | seo-audit (optional key) |
| Search Console | ✔ | ✗ | ✗ | seo-mcp (optional, OAuth) |
| Content quality / E-E-A-T *(ai)* | ✔ | ✗ | ✗ | agent only, labelled AI |
| GEO / AI crawler policy | ✔ | ✗ | ✗ | seo-core (robots for AI bots) |
| Local SEO (NAP consistency) *(det)* | ✔ | ◐ (examples) | ◐ | seo-audit |
| Crawl safety (SSRF, robots, rate limits) | ✔ | n/a | ✔ (design pipeline guard) | shared |
| Tests | ✔ pytest | ◐ | ✔ 25 seo-schema tests | all |
