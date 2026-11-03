# @ux-sting/extract

Make Design DNA real: measure a live page into **W3C DTCG tokens**, turn any DTCG file into a **UX-STING theme** (OKLCH semantic tokens, WCAG AA enforced), and match a design to its **nearest UX-STING preset**.

```bash
npx ux-sting extract https://example.com --out brand        # brand/tokens.json + brand/extraction.json
npx ux-sting theme import brand/tokens.json --name acme     # acme.theme.ts, acme.theme.json, acme.css
npx ux-sting dna https://example.com                        # feature vector + nearest presets
npx ux-sting theme import designlang-tokens.json            # DTCG from other tools works too
npx ux-sting theme export editorial --out tokens            # UX-STING theme → DTCG, for Figma / Tokens Studio
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

## `theme export`

The reverse of `import`: a preset name or a `*.theme.json` (createTheme config) becomes DTCG 2025.10 tokens in two layers.

| File | Layer | Contents |
| --- | --- | --- |
| `<name>.palette.tokens.json` | 1 · palette | Every intent scale (`palette.primary.50` … `950`, neutral, destructive, success, warning, info, base white/black) in OKLCH with a hex fallback; `radius.base` and `font.*` when the theme sets them |
| `<name>.light.tokens.json`, `.dark`, `.high-contrast` | 2 · semantic | Every role (`color.background`, `color.primary-hover`, …) as an alias such as `{palette.primary.600}`; values that are not a palette step (overlays, chart colors, overrides) stay raw |

Bind designs to layer 2 only; a rebrand then changes layer 1. In Figma, import the palette into one variable collection and each mode file as a mode of a second one. Tools that cannot resolve references across files get `--resolved` (raw colors everywhere). Re-import by passing the palette and one mode together (files merge in order): `ux-sting theme import editorial.palette.tokens.json editorial.light.tokens.json` gives back the same core roles (tested).

## `dna`

A vector of measured features (`backgroundL`, `textContrast`, `primaryHue`/`Chroma`, `neutralChroma`, `radiusPx`, `serifHeadings`, `bodyPx`, `headingRatio`, `spacingUnit`, `motionMs`, `shadows`). Missing ones are `null` and skipped; matching uses only dimensions both sides measured and says how many.

## Security

Same guard as `@ux-sting/qa`: the named URL is allowlisted, other private/metadata addresses are blocked for navigation and subrequests. Page text is never copied into tokens.
