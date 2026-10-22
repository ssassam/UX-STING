# @ux-sting/extract

Make Design DNA real: measure a live page into **W3C DTCG tokens**, turn any DTCG file into a **UX-STING theme** (OKLCH semantic tokens, WCAG AA enforced), and match a design to its **nearest UX-STING preset**.

```bash
npx ux-sting extract https://example.com --out brand        # brand/tokens.json + brand/extraction.json
npx ux-sting theme import brand/tokens.json --name acme     # acme.theme.ts, acme.theme.json, acme.css
npx ux-sting dna https://example.com                        # feature vector + nearest presets
npx ux-sting theme import designlang-tokens.json            # DTCG from other tools works too
```

## What `extract` measures

Headless Chromium at 1440 px (`--width`, `--dark`), computed styles only:

| Group | Source | DTCG output |
| --- | --- | --- |
| Colors | Backgrounds by painted area, text by characters, borders, button fills and links | `color.background`, `foreground`, `muted-foreground`, `heading`, `surface`, `border`, `primary`, `primary-foreground`, `palette.*` |
| Type | Font stacks by usage, h1–h3, body copy (the paragraph size carrying the most text), all sizes | `font.*`, `fontSize.*`, `fontWeight.*`, `lineHeight.*` |
| Space | Paddings, gaps, margins; centered container widths | `spacing.unit` (8/4/2 fit), `spacing.scale.*`, `spacing.container` |
| Shape & depth | Corner radii, box-shadows (parsed into DTCG shadow objects) | `radius.*`, `shadow.*` |
| Motion | Computed transitions and CSS animations, plus script-driven Web Animations from `document.getAnimations()` | `duration.default` (transitions), `duration.entrance` (animations), `easing.*` as `cubicBezier` |
| Breakpoints | `@media` width conditions from the CSSOM **and** from cross-origin stylesheet bodies read off the network | `breakpoint.*` |

Every semantic token carries `$extensions["dev.ux-sting"]` = `{ source: "observed" | "inferred", confidence, evidence }`. **Anything not measured is left out and listed in `$extensions["dev.ux-sting"].missing` — never invented.** Values use the DTCG 2025.10 shapes (`{ colorSpace, components, hex }`, `{ value, unit }`).

## `theme import`

Reads DTCG from any tool: groups, inherited `$type`, `{alias}` references, 2025.10 object values or older strings, Style Dictionary `value`/`type`. Roles are found by name (UX-STING's own names, designlang-style `semantic.color.action.primary` / `surface.default` / `text.body`, common Figma naming), then from a bare palette by lightness and chroma (marked `fallback`).

- The source's own scheme gets exact OKLCH overrides; primary and neutral scales are rebuilt from their hue/chroma so the other modes (dark, high contrast) stay coherent.
- Every pair UX-STING's theme tests require is enforced at AA (4.5:1 text, 3:1 primary on background); each change is reported as `adjusted`. Accessibility outranks fidelity.
- Roles the file does not provide are reported as `missing` and fall back to UX-STING defaults.

## `dna`

A vector of measured features (`backgroundL`, `textContrast`, `primaryHue`/`Chroma`, `neutralChroma`, `radiusPx`, `serifHeadings`, `bodyPx`, `headingRatio`, `spacingUnit`, `motionMs`, `shadows`). Missing ones are `null` and skipped; matching uses only dimensions both sides measured and says how many.

## Security

Same guard as `@ux-sting/qa`: the named URL is allowlisted, other private/metadata addresses are blocked for navigation and subrequests. Page text is never copied into tokens.
