# SEO implementation roadmap

Each step ships an independently useful package with tests; nothing requires adopting the rest.

| Step | Deliverable | Exit criteria | Status |
| --- | --- | --- | --- |
| 1 | `@ux-sting/seo-schema` | Builders for the 13 core types, safe serializer, extractor, two-layer validator, 25 tests, Ember migrated | ✔ done |
| 2 | Migrate remaining examples' JSON-LD to `seo-schema` | The 8 remaining hand-written blocks replaced; each example's built HTML validates with 0 schema errors in CI | Next |
| 3 | `@ux-sting/seo-core` | Canonical + hreflang set builder/validator, sitemap build/validate, robots model, metadata checks, indexing policy; unit tests from `SEO_TESTING_STRATEGY.md` | Next |
| 4 | `@ux-sting/seo-nextjs` | `createMetadata`, `sitemap`/`robots` factories, `<JsonLd>`; the six `lib/seo.ts` copies deleted; fr/en/ar demo route with hreflang | After 3 |
| 5 | Component integration | `Breadcrumb` docs show `breadcrumbList`; listing demos show crawlable pagination + noindex facets; recipes in `docs/recipes.md` | After 4 |
| 6 | `@ux-sting/seo-audit` + `ux-sting seo` CLI | Polite crawler with SSRF guard, technical/metadata/hreflang/sitemap/links/schema checks, JSON + Markdown report; runs in CI against built examples | Phase 6 of the universal roadmap |
| 7 | Lighthouse integration | `ux-sting seo performance`, documented conditions; CI job on examples | With 6 |
| 8 | `@ux-sting/seo-mcp` | MCP tools wrapping 6–7 for coding agents; read-only by default | Phase 8 |
| 9 | Optional Google APIs | CrUX field data, Search Console inspection via user-supplied credentials | Later, opt-in |

Rule maintenance: each Google rule is re-verified at least every 6 months or when Google's update log changes; `confidence: "review"` rules first (`merchant-listing`, `review-snippet`, `job-posting`, `site-name`, `retired-2025`).
