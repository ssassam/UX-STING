# Visual QA system and quality gates (Engines 7 and 9)

QA proves a generated site works; it does not grade taste. Every check below is deterministic unless marked *judgment*.

## The loop

```
build → start → render (Chromium) at 390 / 768 / 1280 / 1600 px, light + dark
      → screenshots → measure → compare → findings → fixes (deterministic first) → rebuild changed parts → retest
```

Stop conditions: no findings; or the same fixes recur without measured gain; or a finding needs a human decision.

## `ux-sting qa` (shipped)

`@ux-sting/qa` runs the deterministic checks below on any URL, static export or HTML file at 375 / 768 / 1440 px and writes a short `report.md` (per-viewport table + ranked top 3 fixes), `report.json` and screenshots. The `ux-sting-qa` skill drives the loop: QA → fix top 3 → re-run, at most three rounds. See `packages/qa/README.md`.

## Checks

| Check | Method | Status |
| --- | --- | --- |
| Horizontal overflow | `scrollWidth - clientWidth`, offending elements | ✔ prototype |
| Cramped / broken wrapping | text boxes narrower than ~6 em wrapping onto ≥ 3 lines | ✔ prototype (caught a real generator bug) |
| Accessibility | axe-core full run (incl. contrast) per viewport | ✔ prototype, ✔ CI for docs |
| DNA fidelity | re-measure the generated page → `compareDna` (color ΔE, type steps, container, sections, shape) | ✔ prototype |
| Pixel similarity | 160 px-wide downscale, mismatch share + 8×8 SSIM, per-band differences | ✔ prototype |
| Clipping / overlap | elements whose rect exceeds an `overflow:hidden` ancestor; overlapping interactive targets | Phase 4 |
| Alignment drift | left edges of sibling text blocks vs container grid | Phase 4 |
| Navigation | crawl internal links, assert 200 and no `#` dead ends; keyboard Tab order reaches every control | Phase 6 |
| Interaction | click/expand each control, assert state change and no console errors | Phase 6 |
| Runtime errors | `pageerror`/`console.error` and failed requests per page | ✔ `@ux-sting/qa` |
| Technical SEO | `@ux-sting/seo-schema` on every page; metadata/canonical/hreflang via `seo-audit` | Phase 6 |
| Layout sanity | unequal container margins, orphaned bands and last-row grid items, empty stretches > ¾ screen, h1 on the first screen | ✔ `@ux-sting/qa` |
| Core Web Vitals (lab basics) | LCP and CLS via PerformanceObserver at 375/768/1440 | ✔ `@ux-sting/qa` |
| Performance | Lighthouse on the production build, mobile profile | Phase 6 |
| Visual regression | Storybook baselines (existing CI) | ✔ CI |

## Comparing against references — guard rails
- Pixel metrics are reported, never maximised alone: when text and imagery differ (always, without authorization) mismatch stays high by design.
- Fixes are ordered **accessibility → layout → fidelity**. A fidelity fix that would break contrast or responsiveness is rejected.
- Spacing may not be used to fake missing content (padding fixes capped at the section gap). Residual height gaps are reported as structural differences for a component-level fix.

## Quality gates (targets, measured on production builds)

| Gate | Target | Measured how |
| --- | --- | --- |
| Lighthouse Performance | ≥ 95 | Lighthouse CLI, mobile, simulated throttling, 3 runs, median |
| Lighthouse Accessibility | ≥ 95 | same |
| Lighthouse Best Practices | ≥ 95 | same |
| Lighthouse SEO | ≥ 95 | same |
| Horizontal overflow | 0 px at all viewports | QA overflow check |
| Critical/serious axe violations | 0 | axe per viewport and color mode |
| Broken internal links | 0 | link crawl |
| Runtime errors | 0 | console + pageerror |
| Structured data | 0 schema-layer errors | `validateJsonLd` |

Scores are targets, not guarantees. Reports record Chromium version, device profile, throttling, number of runs and build commit. Gates are only declared passed when the run that measured them is attached to the report.

## Current measured results (prototype, 2026-10-14)
- Ember reconstruction: 0 axe violations at 1280/390, 0 overflow, 0 cramped text; DNA fidelity 87 → 90.
- Atelier Noor original directions: 0 axe violations, 0 overflow; 1 cramped headline at 390 px per direction, fixed by the loop.
- Lighthouse has **not** been run on prototype output yet (standalone HTML, not a production build).
