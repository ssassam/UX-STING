# @ux-sting/qa

## 0.7.0

### Patch Changes

- @ux-sting/design-dna@0.7.0

## 0.6.3

### Patch Changes

- @ux-sting/design-dna@0.6.3

## 0.6.2

### Patch Changes

- @ux-sting/design-dna@0.6.2

## 0.6.1

### Patch Changes

- @ux-sting/design-dna@0.6.1

## 0.6.0

### Patch Changes

- @ux-sting/design-dna@0.6.0

## 0.5.0

### Patch Changes

- @ux-sting/design-dna@0.5.0

## 0.4.0

### Patch Changes

- @ux-sting/design-dna@0.4.0

## 0.3.0

### Minor Changes

- ff7a929: `ux-sting qa` measures contrast for text over photos and gradients on the rendered pixels (hide the text, screenshot its box, take the worst 5%) instead of reporting 1:1 against an assumed white page; SVG text is measured with its `fill`. New exports: `decodePng`, `pixelContrast`, `measurePixelContrast`.

  `@ux-sting/react`: `CarouselDots` buttons are now full 24px targets that no longer overlap (WCAG 2.5.8), and `CategoryCard`'s scrim is stronger so labels stay readable over light photos.

### Patch Changes

- @ux-sting/design-dna@0.3.0

## 0.2.0

### Minor Changes

- 13c728c: New `@ux-sting/qa` package and `ux-sting qa <url|path>` command: screenshots at 375/768/1440, axe, contrast, layout checks (overflow, unequal margins, orphans, empty stretches, title on the first screen), console errors and LCP/CLS, with a short markdown report, JSON and ranked top-3 fixes.
- 45b17d1: New `@ux-sting/images` package and `ux-sting images` command (Wikimedia Commons, The Met Open Access, Openverse; public domain, CC0, CC BY and CC BY-SA only; credits recorded automatically). `ux-sting qa` adds anti-slop checks (`slop:*`, `data:numbers-misaligned`; disable with `--no-taste`). The `ux-sting-taste` skill is rebuilt as a full art-direction pipeline with a dashboard route.

### Patch Changes

- b29382f: New `@ux-sting/motion` package: a zero-dependency CSS transition catalog (card resize, number pop-in, notification stack, list reorder with View Transitions + FLIP, accordion, tab indicator, toast, skeleton → content) with helpers and React hooks, plus an optional GSAP adapter (`@ux-sting/motion/gsap`: useGSAP hooks, ScrollTrigger reveal/pin/scrub, SplitText headings, Flip layouts, timeline presets). `ux-sting qa` no longer flags breadcrumb navs, headings or inline elements as orphaned or off-center bands.
- 9c2b2b2: `ux-sting qa`: wrapping rows of differently sized chips are no longer reported as orphaned grid items, and ©, ® and ™ no longer count as emoji icons. `ux-sting extract`: text that is unreadable on the page background (a dark label on a light button) is no longer taken as the muted text color. Found while building the toolkit demo site (`examples/toolkit`).
  - @ux-sting/design-dna@0.2.0
