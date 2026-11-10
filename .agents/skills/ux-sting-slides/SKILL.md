---
name: ux-sting-slides
description: "Plan and build a presentation deck (pitch deck, investor deck, sales pitch, product demo, QBR, board meeting, all-hands, conference talk, workshop, webinar, case study) as a UX-STING web deck: pick a researched deck strategy, plan each slide's story beat, layout, type scale, color by emotion, copy formula, chart and image, then build it with UX-STING components and tokens, export to PDF and verify it in a browser. Offline slide data via scripts/slide_data.py: 15 deck strategies with emotion arcs, 25 layouts, 25 copy formulas, 25 slide chart types, type scales, color-by-emotion and background rules. Use whenever someone asks for slides, a deck, a presentation, a keynote or a pitch."
---

# UX-STING slides — strategy, beats, then a deck that proves itself

A deck is a story with one job (fund us, buy this, approve that). Plan the story before any pixel, keep one idea per slide, and build it with the same tokens, components and QA as the rest of UX-STING. Write each step's output into `.ux-sting/slides/`.

## 1. Brief → `brief.md`

Five lines: the deck's one job, the audience and what they already believe, the setting (live talk, sent as PDF, read on a phone), the length or slot, and the facts you actually have (numbers, quotes, logos, team). If the brand exists, get its tokens first (`npx ux-sting extract <url>` → `theme import`, see `ux-sting-universal`). Otherwise run `ux-sting-taste` step 3 for a direction; a deck is a page with a stricter frame.

## 2. Plan → `plan.md`

```bash
python3 scripts/slide_data.py plan "seed pitch for a bakery chain" --persist   # → .ux-sting/slides/plan.md
python3 scripts/slide_data.py search "problem agitation" --domain copy
python3 scripts/slide_data.py search "market share" --domain chart
```

`plan` picks the closest strategy (YC seed, Kawasaki 10/20/30, Series A, sales pitch, product demo, Duarte sparkline, QBR, all-hands, conference talk, workshop, case study, competitive analysis, board meeting, webinar…) and gives every slide: its story beat (what is / what could be / proof / action), goal, emotion from the arc, a layout card, the type scale, the color treatment, a copy formula (PAS, AIDA, FAB…), a chart for proof slides, and an image search for slides that carry a picture. It also stops the same layout appearing twice in a row.

Then edit the plan by hand. Cut slides that don't serve the deck's job, merge thin ones, and write the real headline for each: **a sentence that states the point** ("Repeat orders doubled in 6 months"), not a topic label ("Traction"). Every number, quote and logo comes from the brief or a cited source, or stays a `{{placeholder}}`.

## 3. Build

**React / Next.js (default).** One route, one `<section>` per slide:

- Frame: `aspect-ratio: 16 / 9; width: min(100vw, 177.78vh)`, centered on a `bg-background` stage. Fixed 1920×1080 design grid scaled with `container-type: inline-size` and `cqi` units, so type sizes from the plan (`120px` → `calc(120 / 1920 * 100cqi)`) hold at every size.
- Navigation: `scroll-snap-type: y mandatory` on the stage, ←/→/PageUp/PageDown/Space/Home/End handlers, a slide counter (`aria-live="polite"`), `#n` deep links. Each slide is a `<section aria-roledescription="slide" aria-label="n of N: headline">`.
- Components: `Heading` / `Text` / `Blockquote` for the type scale, `Stat` / `AnimatedNumber` for metric callouts, `@ux-sting/react/chart` (`LineChart`, `BarChart`, `DonutChart`, `BarList`, `Sparkline`, `ChartMetrics`, always with `ChartTable` or direct labels) for proof slides, `Card` / `Grid` for card grids, `Timeline` for roadmaps, `Avatar` + `ProfileCard` for team, `Reveal` for builds (respect reduced motion), `Logo` for logo walls.
- Color by emotion: the plan's `dark-surface`, `surface-elevated`, `accent-bleed`, `gradient` map to token classes (`bg-surface`, `bg-card`, `bg-primary text-primary-foreground`…), never raw hex. Spend the accent on one thing per slide.
- Images: `npx ux-sting images "<plan query>" --download …`; credit them on a final credits slide.
- Speaker notes: a `<aside data-notes hidden>` per slide; a `?notes` view shows them.
- PDF: `@media print { @page { size: 1920px 1080px; margin: 0 } section { break-after: page } }`; export with the browser's print or Playwright `page.pdf({ width: "1920px", height: "1080px", printBackground: true })`.

**Other stacks.** `npx ux-sting tokens export` and build the same structure in plain HTML/CSS (or the stack's idiom). For Google Slides, Keynote or PowerPoint output, use the plan and tokens as the spec and that tool's own builder.

## 4. Prove it

- `npx ux-sting qa <deck-url> --viewports 1920,1280,390` and fix the top findings (contrast, overflow, cramped text). Check the PDF too.
- Read every slide at thumbnail size: is the headline the point? Is there one focal element? Could it be cut?
- 16 px floor for any text the audience must read when sent as PDF; 24 px when projected.

## 5. Hand off

The plan (strategy + slide table), open `{{placeholders}}`, image credits, the PDF path, the QA table and anything left undone. Run `ux-sting-review` before calling it done.

Slide data adapted from the MIT-licensed UI/UX Pro Max design-system skill (see `THIRD_PARTY_NOTICES.md` in UX-STING): Chart.js advice mapped to `@ux-sting/react/chart`, stock-photo sources replaced by openly licensed `ux-sting images`.
