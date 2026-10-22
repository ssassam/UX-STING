# Craft rules

## Type first
- Display headline large with tight leading (`text-5xl md:text-7xl leading-[1.02] tracking-tight text-balance`). Body 16–18px, line-height ≥ 1.5, 45–75 characters per line (`max-w-prose`).
- Labels in mono or small caps, uppercase, tracked (`font-mono text-xs uppercase tracking-[0.12em]`). At most ~3 sizes per section.
- A real display/body contrast: serif + grotesk, condensed + humanist, or one family with a big weight jump.

## Color restraint
- One neutral + one accent is a full palette. Tints of the neutral (`bg-muted`, `bg-surface`) for depth instead of new colors. Semantic tokens only.
- Custom brand: `createTheme({ name, primary, neutral, radius, fontFamily })` from `@ux-sting/themes`, or `npx ux-sting theme import tokens.json`; theme tests and the importer enforce WCAG AA.

## Structure over shadows
- Hairlines (`border-border`, `Separator`), inset panels and tonal backgrounds give depth. Shadows only on things that float.
- One grid per page, asymmetric when the direction allows. Whitespace between sections ≥ `py-24` on marketing pages.

## Direction → preset

| Direction | Theme preset | Type | Layout & surface |
| --- | --- | --- | --- |
| Editorial / Swiss print | `editorial` | `font-serif` display, sans body, mono labels | Asymmetric 7/5 split, hairline rules, numbered sections |
| Quiet luxury | `luxury` | Serif throughout, italic accents, wide tracking on labels | Lots of whitespace, few elements, full-bleed photography |
| Dark tech | `terminal` + `colorMode="dark"` | Grotesk + `font-mono` metadata | Hairline borders, dense tables, `DotPattern` |
| Brutalist | `brutalist` | Heavy grotesk caps, mono numbers | Visible grid, thick borders, hard shadows, flat color blocks |
| Trust-first enterprise | `carbon`, `fluent`, `polaris`, `default` | System sans | Evidence tables, compliance `Badge`s, restrained color |
| Friendly consumer | `soft`, `apple`, `modern` | Rounded sans, larger sizes | Photography, cards with real content |

## Motion budget

| Want | Use | Limit |
| --- | --- | --- |
| Hero headline entrance | `TextEffect` (`preset="blur"` or `"slide"`) | One per page |
| Sections appearing on scroll | `Reveal` (`stagger` for rows) | Key sections only |
| Numbers that change | `AnimatedNumber` | Numbers that matter |
| Signature 3D / shader moment | `ux-sting-3d` | One per page, poster + still frame for reduced motion |

App UI gets almost none of these.

## Pre-flight — fail the page if
- [ ] It could have come from typing "landing page" with no brief.
- [ ] Nothing on the first screen comes from `unique.md`.
- [ ] An anti-slop pattern appears without a written reason.
- [ ] There is no display/body type contrast.
- [ ] More than two colors carry meaning, or the accent appears more than ~4 times per viewport.
- [ ] An image is uncredited, or a credit is hidden where nobody can find it.
- [ ] A section could be deleted without losing the argument.
