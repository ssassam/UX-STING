# SEO engine architecture (Engine 6)

SEO in UX-STING is an engineering property of the code — correct HTML, metadata, links, structured data and indexing policy — verified by tests and audits. It is never a promise of rankings or indexing.

## Starting point (audit of this repository, 2026-10-14)

| Area | Before this work | Problem |
| --- | --- | --- |
| Metadata, canonical, Open Graph | `lib/seo.ts` copied into six examples (`car-rental`, `crypto`, `ember`, `shop`, `travel`, `watch`), ~60 lines each | Duplication; no hreflang; canonical rules re-implemented |
| Structured data | Hand-written JSON-LD objects in 9 example pages (8 after migrating Ember) | Untyped, unvalidated; easy to ship invalid or ineligible markup |
| Sitemaps | `sitemap.ts` per example + a hand-made index | No validation; no indexing policy |
| robots | `robots` metadata only | No `robots.ts`, no crawler policy |
| Components | `Pagination getHref` (crawlable links), `Breadcrumb`, `Heading level`, `Image` with reserved ratio, `SkipLink`, landmarks | Good base; breadcrumb and listings emit no structured data |
| Audit | `scripts/browser-audit.ts` (axe + overflow) | No SEO checks |

Now added: **`@ux-sting/seo-schema`** (typed builders, safe serialization, extraction, two-layer validation) — Ember uses it.

## Packages

All optional, ESM, `sideEffects: false`, no dependency on `@ux-sting/react` (and vice versa).

| Package | Scope | Depends on | Status |
| --- | --- | --- | --- |
| `@ux-sting/seo-schema` | JSON-LD builders, serializer, extractor, schema.org vs Google validation | — | ✔ 0.1 |
| `@ux-sting/seo-core` | URL normalisation, canonical resolution, hreflang sets + validation, robots directives model, sitemap XML build/parse/validate, metadata model (title/description length checks), indexing policy rules | — | Next |
| `@ux-sting/seo-nextjs` | App Router helpers: `createMetadata()` (canonical, alternates.languages, OG/Twitter), `sitemap()`/`robots()` factories, `<JsonLd>` server component, `generateStaticParams` guards for programmatic pages | seo-core, seo-schema, `next` (peer) | Next |
| `@ux-sting/seo-audit` | Polite crawler (robots.txt, rate limit, depth/page caps, same-origin, SSRF guard), page extractors, deterministic checks, report model | seo-core, seo-schema, `@playwright/test` (optional peer for rendered checks) | Phase 6 |
| `ux-sting seo …` (CLI) | Commands below, in the existing `ux-sting` CLI | seo-audit | Phase 6 |
| `@ux-sting/seo-mcp` | MCP tools wrapping the same functions for coding agents | seo-audit | Phase 8 |

### Proposed CLI (interfaces, not yet implemented)

```
ux-sting seo audit <url>        full crawl → report (JSON + Markdown)
ux-sting seo page <url>         one page: metadata, headings, links, images, JSON-LD
ux-sting seo schema <url|file>  extract + validate JSON-LD (wraps @ux-sting/seo-schema)
ux-sting seo technical <url>    status, redirects, canonical, robots, noindex, mixed content
ux-sting seo hreflang <url>     cluster pages by alternates, check reciprocity/self/x-default/codes
ux-sting seo sitemap <url>      fetch + validate sitemap(s), compare with crawl and indexing policy
ux-sting seo links <url>        internal link graph, orphans, broken links, generic anchors
ux-sting seo performance <url>  Lighthouse (local, documented conditions) + CWV field data if a CrUX key is set
```

Common flags: `--max-pages`, `--rate`, `--respect-robots` (default on, cannot be disabled for third-party hosts), `--allow-host host:port` for local dev servers, `--json`.

## SEO-ready component patterns

| Pattern | UX-STING pieces | SEO responsibility |
| --- | --- | --- |
| Breadcrumbs | `Breadcrumb` + `breadcrumbList()` | Visible trail and matching BreadcrumbList; real links |
| Article / guide / recipe | `ArticleCard`, typography, `Image`; `article()`, `recipe()` | One h1, logical headings, `time datetime`, author byline from real data |
| Product / business / service | `ProductCard`, `Price`, `BusinessCard`, `OpeningHours`; `product()`, `localBusiness()`, `service()` | Offers only with real price/availability; no self-serving ratings |
| Listings / search | `SearchResult`, `Pagination getHref`, `FilterPanel` | Crawlable pagination links; filter/search URLs `noindex` or canonicalised |
| Internal linking / related | `List`, `Card` with descriptive link text | Descriptive anchors, no "click here"; related items from taxonomy, not random |
| Images | `Image` (`alt` required, reserved ratio, lazy) | `sizes`/`srcset`, dimensions, priority for LCP image |
| Navigation | `Navbar`, `SkipLink`, `aria-current` | Real `<a href>` links, landmarks |

All are server-rendered; JSON-LD is emitted by server components via `jsonLdScriptProps`.

## International SEO (fr / en / ar)
- One URL per locale (`/fr/…`, `/en/…`, `/ar/…`); `lang` and `dir="rtl"` for Arabic set on `<html>`.
- `seo-core` builds a hreflang **set** once per page group and emits identical alternates on every member: self-reference, full reciprocity, optional `x-default`, canonical of each member pointing to itself (never canonicalise one language to another).
- Validation: BCP 47 language (optionally script/region), region only with a language, absolute URLs, every alternate returns 200 and is indexable, no duplicates.
- Sitemaps can carry `xhtml:link` alternates generated from the same set.

## Programmatic pages (category, city, product, directory)
Rules in `seo-core` `indexingPolicy` (deterministic, testable):
- A generated page is **indexable only if** it has unique primary content above a threshold (e.g. ≥ N listings, unique intro, non-empty facts), is not a near-duplicate of a sibling (shingle similarity < threshold), and is linked from the site's navigation or a hub.
- Otherwise: render for users but `noindex, follow`, and exclude from the sitemap.
- Never generate city × service × keyword combinations without data behind each one (doorway pages). Hard cap per batch with a review step before publishing.
- Faceted URLs canonicalise to the unfaceted listing unless the facet is a curated landing page.

## Agent workflow
See `SEO_AGENT_SPEC.md` (deterministic findings vs AI interpretation, approval before content edits).

## Security
The crawler uses the same guard as the design pipeline (`checkTargetUrl` + resolved-IP checks + per-request routing), honours robots.txt and rate limits, and stores API credentials (CrUX, Search Console) only from environment variables or the OS keychain, never in reports.
