---
name: ux-sting-taste
description: "Give a UX-STING page a deliberate design direction so it does not look AI-generated. Use when building or redesigning landing pages, marketing sites, portfolios, hero sections, pricing pages or demo examples, or when someone says it looks generic, templated, bland, 'make it premium', 'make it look designed' or 'more personality'. Pairs with the ux-sting skill (components, a11y) and ux-sting-review (checks). Ideas adapted from the MIT-licensed design-taste and Better Design projects (see THIRD_PARTY_NOTICES.md)."
---

# UX-STING taste — direction before decoration

The ux-sting skill makes a screen correct. This one makes it intentional. Agents default to the same look: centered hero, purple gradient, three equal cards, one neutral sans, `rounded-2xl` everywhere. UX-STING's defaults are safe, not distinctive, so pick a direction on purpose.

## 1. Write a design read first

Before writing code, state in one line what you are building and why it looks the way it does:

> Reading this as: **[page kind]** for **[audience]**, **[direction]**, motion **[none / quiet / expressive]**, palette **[neutral + one accent]**.

Infer it from the brief: page kind (SaaS, consumer, editorial, portfolio, event, internal tool), the vibe words used, the audience (it picks the look, not your taste) and any existing brand. **Existing brand wins:** never swap a product's theme for a preset because it looks nicer. If the read is truly ambiguous, ask one question; otherwise proceed.

## 2. Pick one direction

| Direction | Theme preset | Type | Layout & surface | Motion budget |
| --- | --- | --- | --- | --- |
| Editorial / Swiss print | `editorial` | `font-serif` display, sans body, mono labels | Asymmetric 7/5 split, hairline rules (`Separator`), numbered sections, `GridPattern` | Quiet: `Reveal preset="fade"` |
| Quiet luxury | `luxury` | Serif throughout, italic accents, wide tracking on labels | Lots of whitespace, few elements, full-bleed photography (`Image`) | Quiet: slow `Reveal`, no loops |
| Dark tech | `terminal` + `colorMode="dark"` | Grotesk + `font-mono` metadata | Hairline borders, dense tables, `DotPattern`, code in `font-mono` | Precise: `TextEffect`, `Typewriter`, `AnimatedNumber` |
| Brutalist / neo-brutal | `brutalist` | Heavy grotesk caps, mono numbers | Visible grid, thick borders, hard `shadow-md`, flat color blocks | Snappy: short `Reveal`, `Marquee` of tags |
| Trust-first enterprise | `carbon`, `fluent`, `polaris`, `default` | System sans | Evidence tables (`DataTable`), compliance `Badge`s, restrained color | None to quiet |
| Friendly consumer | `soft`, `apple`, `modern` | Rounded sans, larger sizes | Photography, cards with real content, `Carousel` | Expressive: `Spotlight`, `Tilt`, `RotatingText` |
| Playful | `default` with a custom saturated `primary` | Giant heavy display type | Two saturated colors, stickers (`Badge`), offset shadows | Expressive, but motion is where the budget goes — keep color restrained |

Custom brand? `createTheme({ name, primary, neutral, radius, fontFamily })` from `@ux-sting/themes`, then check contrast with `contrastRatio()`. Theme tests enforce WCAG AA for every preset.

## 3. Banned defaults

Do not use these unless the design read gives a reason:

- Indigo/violet-to-purple gradient heroes or gradient text. `MeshGradient` is allowed when it is subtle (`intensity` ≤ 35) and uses the theme's own tokens.
- Centered pill badge + huge heading + two buttons + screenshot as the default hero.
- Three identical feature cards as the default section; vary the rhythm (split, indexed list, table, quote, full-bleed).
- Emoji as icons (`pnpm ux-audit` fails them) — use `@ux-sting/icons`.
- Glass cards everywhere; cards inside cards inside cards.
- One neutral sans for everything with no display contrast.
- An accent used on everything. It should point at one action, number or highlight per view.
- Motion on every element, looping animations nobody asked for, floating blobs.

## 4. Craft rules that move the needle

- **Type first.** Display headline large with tight leading (`text-5xl md:text-7xl leading-[1.02] tracking-tight text-balance`). Body 16–18px, line-height ≥ 1.5, 45–75 characters per line (`max-w-prose`). Labels in mono or small caps, uppercase, tracked (`font-mono text-xs uppercase tracking-[0.12em]`). At most ~3 sizes per section.
- **Color restraint.** One neutral + one accent is a full palette. Use tints of the neutral (`bg-muted`, `bg-surface`) for depth instead of new colors. Only semantic tokens.
- **Structure over shadows.** Hairlines (`border-border`, `Separator`), inset panels and tonal backgrounds give depth. Shadows only on things that float.
- **One grid per page,** asymmetric when the direction allows. Whitespace between sections ≥ `py-24`.
- **Real content.** Real numbers (`AnimatedNumber`, `Stat`), real names, real photography with `alt`. No lorem ipsum and no fake browser chrome around screenshots.
- **Copy.** Specific verbs, no "Unlock the power of". Buttons say what happens ("Book a table", not "Submit").

## 5. Motion budget

UX-STING's expressive components are opt-in and already respect reduced motion. Spend the budget on purpose:

| Want | Use | Limit |
| --- | --- | --- |
| Hero headline entrance | `TextEffect` (`preset="blur"` or `"slide"`) | One per page |
| Sections appearing on scroll | `Reveal` (`stagger` for card rows) | Key sections only, not every element |
| Several audiences in one line | `RotatingText` / `Typewriter` | Hero only; never for information people need |
| Stats and prices | `AnimatedNumber` | Numbers that matter |
| Logos / social proof | `Marquee` (has a pause button) | One row |
| Long article | `ScrollProgress` | Editorial pages |
| Card hover delight | `Spotlight`, `Tilt` | A few feature or pricing cards |
| Before/after | `ImageComparison` | Real comparisons |
| Texture without images | `MeshGradient`, `DotPattern`, `GridPattern`, `Grain`, `ProgressiveBlur` | One or two layers per section |
| "Thinking…" status | `TextShimmer` | Short status labels |
| Signature 3D / shader moment | three.js, following `ux-sting-3d` | One per page, with a poster and a still frame for reduced motion |
| Explaining a system or process | diagram-design, following `ux-sting-diagrams` | Only when a diagram beats a list or table |

App UI (dashboards, settings, forms) gets almost none of these: content should simply be there.

## 6. Pre-flight — fail the page if

- [ ] It could have come from typing "landing page" with no brief (be honest).
- [ ] The hero is the banned default from §3.
- [ ] Three identical cards appear out of habit.
- [ ] There is no display/body type contrast.
- [ ] More than two colors carry meaning, or the accent appears more than ~4 times per viewport.
- [ ] More than one looping animation is visible at once.
- [ ] A section could be deleted without losing the argument.

If any box is ticked, redo that section. Then run **ux-sting-review** — taste never overrides accessibility.
