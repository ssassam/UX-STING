# SEO competitive audit: Claude SEO vs UX-STING

Reference: [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) (MIT), cloned at `4b99de2` (2026-10-05).

## What Claude SEO is
A Claude Code plugin: 26 skills (one orchestrator), 19 sub-agents, ~70 Python scripts, ~70 pytest files, optional extensions (DataForSEO, Ahrefs, Bing Webmaster, Firecrawl, Matomo…).

| Area | How it works | Notes |
| --- | --- | --- |
| Orchestration | `seo` skill detects business type, spawns technical/content/schema/sitemap/performance/visual/GEO agents in parallel, conditionally local/maps/backlinks/e-commerce/drift | Health score + action plan aggregated from all agents |
| Technical | 9 categories: crawlability, indexability, security, URLs, mobile, CWV, structured data, JS rendering, IndexNow | Checklist-driven; scripts fetch/parse HTML |
| Schema | Detection (JSON-LD, Microdata, RDFa), validation, generation from templates; deprecated-types list with dates | Prose rules + `schema/templates.json` with bracketed placeholders |
| Content | E-E-A-T, readability, thin content, "humanize" scripts | Largely AI judgment |
| GEO / AI search | AI crawler access, citability, llms.txt, brand mentions | Fast-moving claims with dates |
| Local / maps | GBP signals, NAP, reviews, geo-grid (DataForSEO) | External paid APIs |
| International | hreflang skill: self-reference, return tags, x-default, ISO codes, sitemap alternates | Thorough checklist |
| Google APIs | PSI, CrUX (+history), GSC query/inspect, Indexing API, GA4, NLP | Credential tiers, ADC support |
| Reports | Markdown/HTML reports, PDF, drift baselines | Scores per category |
| Security | `url_safety.py`: SSRF validation, DNS pinning, metadata blocked, opt-in local allowlist for the top-level URL only; key masking | Strong; worth matching |
| Tests | Hostile inputs, ReDoS in schema hook, key safety, pagination, portability | Good coverage of the Python layer |
| Licence | MIT | Ideas and checklists reusable with attribution |

## Strengths to learn from
- Explicit **deprecation tracking** with dates (HowTo 2023, FAQ rich results retired 2026-05-07, 2025 retirements).
- **SSRF design**: allowlist applies only to the first URL; redirects and subresources never bypass it.
- Quality gates for programmatic and location pages (warning at 30, hard stop at 50).
- Hreflang validation list.

## Weaknesses / limits for our use
- **Different stack.** Python scripts beside a TypeScript monorepo; we need typed TS libraries usable at build time and in tests.
- **Prose rules.** Many requirements live in Markdown, so they cannot be unit-tested or versioned per rule; some dated claims need re-verification.
- **Scores mix deterministic and AI judgment** into one health number.
- **Audit, not prevention.** It inspects finished sites; UX-STING can prevent errors at build time (typed builders, metadata factories, tests).
- Heavy reliance on paid third-party APIs for local/backlink features.

## What UX-STING does differently
1. Typed, tested libraries first (`seo-schema`, `seo-core`), audits second (`seo-audit`).
2. Each Google rule carries `source`, `checkedAt`, `confidence` and is unit-tested.
3. Findings keep **deterministic** checks and **AI interpretation** in separate fields; no blended score.
4. Components and Next.js helpers make the correct output the default.

## Not duplicated
UX-STING already had crawlable `Pagination`, `Breadcrumb`, semantic headings, reserved-ratio images, skip links and per-page canonical/OG in examples; these are kept and wrapped, not rebuilt.
