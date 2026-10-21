# Design DNA specification (v1)

Design DNA is a JSON document describing a design identity as **measurable decisions**. It is framework-independent, human-editable and versioned. TypeScript types live in `packages/design-dna/src/types.ts`; this document is the normative description.

## Goals
- Capture what makes a design recognisable: proportions, type, color relationships, rhythm, composition — not adjectives.
- Record **provenance** for every value so reconstruction claims are auditable.
- Be specific enough to regenerate a page and to compare two pages token by token.
- Allow irregular, editorial, asymmetric and immersive compositions — composition is a value, not a template.

## Top-level shape

```jsonc
// Values measured from the UX-STING Ember example (docs/universal/prototype/reconstruct-reference-dna.json), abridged.
{
  "version": 1,
  "name": "Ember — a nine-course tasting menu in Ghent",
  "mode": "reconstruct",              // reconstruct | original | remix
  "sources": [{ "kind": "url", "ref": "http://localhost:4100/", "authorized": true, "capturedAt": "…" }],
  "personality": { "keywords": ["dark", "sans display", "tight headings", "rounded", "single accent", "left-aligned"], "density": "balanced", "contrast": "medium" },
  "color": { "scheme": "dark", "background": "#171c23", "surface": "#171c24", "foreground": "#adb9c5", "heading": "#f9fafb",
             "muted": "#79828c", "border": "#3b4652", "accent": "#ca8200", "accentForeground": "#301300" },
  "typography": {
    "display": { "family": "ui-sans-serif, system-ui, …", "classification": "sans", "weight": 700 },
    "body":    { "family": "ui-sans-serif, system-ui, …", "classification": "sans", "weight": 400 },
    "scale": { "base": 18, "ratio": 1.414, "steps": { "small": 14, "body": 18, "h3": 16, "h2": 30, "h1": 72, "display": 72 } },
    "headingTracking": -0.025, "headingLeading": 1.05, "bodyLeading": 1.5, "uppercaseLabels": false, "measure": 68
  },
  "layout": {
    "container": 1232, "pagePadding": 24, "columns": 12, "gutter": 16, "sectionGap": 144, "spacingUnit": 8, "alignment": "start",
    "sections": [{ "id": "s2-hero", "role": "hero", "composition": "split", "columns": 2, "surface": "background", "heightPx": 699 }]
  },
  "shape":   { "radius": 18, "controlRadius": 11, "borderWidth": 1, "shadow": "soft" },
  "imagery": { "treatment": "none" },
  "motion":  { "level": "subtle", "durationMs": 150 },
  "navigation": { "pattern": "top-bar", "sticky": true, "itemCount": 7 },
  "provenance": { "color.accent": { "source": "observed", "confidence": 0.95, "evidence": "most common colored button background" } }
}
```

Note what the measurement exposes: Ember's `h3` (16 px) is smaller than its body text (18 px), so `validateDna` reports `scale-order`. Observations are recorded as they are, not tidied.

All lengths are CSS px at the measured viewport (1280 px by default). Colors are opaque `#rrggbb`; translucent colors are composited over their effective background before recording.

## Provenance

| `source` | Meaning | Typical confidence |
| --- | --- | --- |
| `observed` | Read from computed style or geometry of a rendered page | 0.8–0.95 |
| `inferred` | Derived from observations (ratios, roles, muted/border colors, personality) | 0.4–0.7 |
| `brief` | Chosen by the planner from a written brief | 0.7 |
| `remix` | Taken from another DNA | 0.8 |
| `edited` | Changed by a person or by the improvement loop (evidence names the fix) | 0.8 |
| `default` | Nothing better available | 0.3 |

Keys are dot paths (`color.accent`, `layout.sections`, `typography.scale.steps.h1`). A missing key means "not individually tracked; see the parent".

**Screenshots never yield `observed` code-level facts.** From pixels alone, colors and geometry may be `observed` (with lower confidence for anti-aliased or image-covered regions); font families are always `inferred`.

## Sections and composition

`role` (what a section is for) and `composition` (how it is arranged) are independent:

| Composition | Arrangement |
| --- | --- |
| `stack` | One column |
| `centered` | Narrow centered measure |
| `split` | Two roughly equal columns |
| `asymmetric` | Uneven columns (≈ 7/5) or offset content |
| `grid` | Repeated items in `columns` columns |
| `index` | Numbered, ruled rows (editorial) |
| `full-bleed` | Edge-to-edge band, media or color field |

Roles: `navigation, hero, intro, features, list, gallery, stats, testimonials, pricing, menu, schedule, faq, cta, contact, content, footer`. Unknown roles fall back to `content`.

`paddingBlock` may override a section's vertical padding. Improvement loops may change it but must not use spacing to fake missing content (the prototype caps it at `sectionGap`).

## Invariants (checked by `validateDna`)
- Foreground, heading and muted text ≥ 4.5:1 on background (and surface); accent foreground ≥ 4.5:1 on accent — **errors**.
- Accent ≥ 3:1 on background; body ≥ 16 px; body line-height ≥ 1.4; ascending type steps — warnings.
- Container 320–2400 px; at least one section.

## Exports
- `dnaToCss` → `--dna-*` variables and UX-STING `--ui-*` semantic tokens.
- `dnaToDtcg` → W3C Design Tokens Community Group JSON.
- `dnaToUxStingTheme` → `createTheme()` input for `@ux-sting/themes`.

## Versioning
Breaking changes bump `version`. Additive optional fields (like `mobileDisplay`, `heading`, `pagePadding` added during the prototype) stay in v1 until the first release; `pagePadding` becomes required at release.

## Planned in v2
Per-breakpoint overrides (`responsive: { md: {...}, sm: {...} }`), component inventory (detected buttons, cards, forms with their geometry), image crops and focal points, motion curves, and multi-page `templates` (page types sharing one DNA).
