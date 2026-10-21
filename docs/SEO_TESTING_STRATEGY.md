# SEO testing strategy

Tests live next to the code (Vitest, jsdom) and in the browser pipeline (Playwright). Every SEO rule that can be expressed deterministically has a unit test; every example site gets regression checks in CI.

| Area | Test | Where | Status |
| --- | --- | --- | --- |
| JSON-LD validity | Builders emit no empty values; enums expand to schema.org URLs; serializer cannot break out of `<script>`; extractor is linear on hostile input and Unicode-safe; formats, placeholders, impossible ratings rejected | `packages/seo-schema/src/seo-schema.test.ts` | ✔ 25 tests |
| Google eligibility | Required/one-of properties per feature; AggregateOffer rejected for merchant listings; self-serving reviews blocked; retired features reported as info; every rule cites a google.com source with a date | same | ✔ |
| Example regression | Build an example, extract and validate its JSON-LD (done manually for Ember: valid, `local-business` eligible) | `seo-audit` CI step | Planned |
| Metadata rendering | `createMetadata()` snapshot per page type: title template, description, canonical absolute, OG/Twitter | `seo-nextjs` | Planned |
| Canonical correctness | Self-canonical by default; trailing-slash and base-path normalisation; no cross-locale canonicals | `seo-core` | Planned |
| Hreflang | Set generation is reciprocal and self-referencing; invalid codes (`en-uk`, `eng`, region-only) rejected; x-default single | `seo-core` | Planned |
| Sitemap XML | Well-formed XML, ≤ 50,000 URLs/50 MB per file, absolute URLs, no noindex URLs, valid `lastmod` | `seo-core` | Planned |
| Indexing directives | Policy decides index/noindex for programmatic pages; conflicts (noindex + in sitemap) detected | `seo-core` | Planned |
| Broken internal links | Crawl built example on a local server; every internal link 200 | Playwright, CI | Planned |
| Multilingual routes | fr/en/ar routes exist, `lang` and `dir` correct, alternates match | Playwright, CI | Planned |
| Accessibility | axe on every page in light/dark at 390/1280 | `scripts/browser-audit.ts` (CI today for docs) | ✔ docs, planned examples |
| Mobile performance | Lighthouse mobile median of 3 runs; record conditions | CI (scheduled) | Planned |
| SEO regressions | Snapshot of per-page SEO facts (title, canonical, robots, hreflang, JSON-LD types) diffed on PRs | CI | Planned |

## Principles
- Fixtures are real pages from UX-STING examples, never third-party sites.
- Network-free unit tests; browser tests only against local servers.
- A rule change requires a test change and an updated `checkedAt`.
