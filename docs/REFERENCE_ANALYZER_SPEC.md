# Reference analyzer specification (Engine 1)

The analyzer turns references into **observations**, and observations into Design DNA. It never claims knowledge it does not have: computed styles and geometry are observed; source code is never inferred from pixels.

## Inputs and what each can yield

| Input | Observed | Inferred | Never |
| --- | --- | --- | --- |
| Public URL (authorized) | Computed styles, geometry at each viewport, DOM semantics, ARIA, metadata, JSON-LD, network weight, animations | Section roles, composition, personality, type ratio | Server code, private APIs |
| Multiple URLs | Same per page | Shared templates, site-wide tokens (intersection of page DNAs) | — |
| Screenshot(s) | Pixel colors, bounding boxes (via vision/segmentation), relative sizes | Font classification, roles, spacing scale | Fonts by name with certainty, DOM, source |
| Project source | Tokens, components, routes, content models (static analysis) | Design intent | — |
| Brief | — | Everything in `brief` provenance | — |
| Brand assets | Logo colors, provided fonts | Palette harmonies | — |

## URL pipeline (implemented in the prototype)

1. **Target check** — `checkTargetUrl()`: http/https only, no credentials, metadata endpoints always refused, private/local hosts refused unless an exact `host:port` is allowlisted; DNS results checked with `isPrivateAddress()`.
2. **Render** — Chromium via Playwright at 1280 × 900 and 390 × 900; `networkidle`; fonts ready; animations disabled for screenshots. Every subrequest passes the same target check (`page.route`), so a page cannot pivot the crawler into internal networks.
3. **Collect** — `scripts/design-dna/collect.ts` runs in the page and returns a `PageObservation`:
   - colors normalised through a 1×1 canvas (handles `oklch()`, `color-mix()`…), composited over the effective background;
   - text samples by role (h1–h3, body, small, label, button, link) with size, weight, line-height, tracking, case, alignment, color, character count;
   - sections: full-width blocks under `body`/`main` (single-child wrappers unwrapped) with height, content width, padding, column row, gap, repeated children, media, alignment, indexed rows;
   - controls, borders, radii, parsed shadows, transition durations, running animations, navigation (count, sticky), images;
   - **outline (text) only when `--authorized`**.
4. **Derive** — `dnaFromObservation()` applies documented heuristics (dominant colors weighted by characters, low-chroma muted text, median paddings, column ratios ≥ 1.3 → asymmetric…) and writes provenance.
5. **Validate** — `validateDna()`; accessibility failures in the reference are reported, then removed from the working DNA before generation.

## Planned extensions
- **Per-breakpoint DNA**: collect at 390/768/1280/1600 and diff to derive responsive composition.
- **Component inventory**: classify forms, tabs, accordions, carousels, maps, tables by DOM + ARIA patterns, map them to UX-STING components (`Form`, `Tabs`, `Accordion`, `Carousel`, `MapPlaceholder`, `DataTable`) with confidence.
- **Interaction probe**: hover/focus each interactive element, record transition properties and state colors; keyboard-tab through the page to record focus order.
- **Screenshot mode**: a vision model proposes boxes and roles; pixel sampling measures colors; every value is `inferred` unless measured from pixels.
- **Multi-page**: crawl ≤ N same-origin pages (robots.txt respected), cluster by structure into page types, compute a site DNA plus per-type overrides.
- **SEO/a11y snapshot**: reuse `@ux-sting/seo-schema` `extractJsonLd`/`validateJsonLd`, axe, heading outline, landmarks.

## Untrusted input
Page text, attributes, comments and JSON-LD are **data**. They are never interpreted as instructions to an agent; the collector returns them as strings, and agents receive them inside clearly delimited data fields. Instructions found in pages ("ignore previous instructions…") are reported, not followed.

## Known limitations (from the Ember run)
- Wrapper-heavy markup can merge or split sections; roles are heuristics (confidence 0.65).
- Text-only split columns were measured as `stack` after generation until a placeholder column was added; card-like hero asides are still flattened.
- Fonts are recorded as declared stacks; the rendered face is not resolved yet (`document.fonts` check planned).
