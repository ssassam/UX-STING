# @ux-sting/react

## 0.6.3

### Patch Changes

- @ux-sting/hooks@0.6.3
- @ux-sting/icons@0.6.3
- @ux-sting/primitives@0.6.3
- @ux-sting/themes@0.6.3
- @ux-sting/tokens@0.6.3
- @ux-sting/utils@0.6.3

## 0.6.2

### Patch Changes

- @ux-sting/hooks@0.6.2
- @ux-sting/icons@0.6.2
- @ux-sting/primitives@0.6.2
- @ux-sting/themes@0.6.2
- @ux-sting/tokens@0.6.2
- @ux-sting/utils@0.6.2

## 0.6.1

### Patch Changes

- Updated dependencies [e457688]
  - @ux-sting/utils@0.6.1
  - @ux-sting/hooks@0.6.1
  - @ux-sting/icons@0.6.1
  - @ux-sting/primitives@0.6.1
  - @ux-sting/themes@0.6.1
  - @ux-sting/tokens@0.6.1

## 0.6.0

### Minor Changes

- 8fb121f: Add the chart family (`@ux-sting/react/chart`): `LineChart`/`AreaChart`, `BarChart`, `BarList`, `DonutChart`, `Sparkline` and `ChartMetrics`. Dependency-free SVG with crosshair/per-column tooltips, keyboard navigation, a live region and a visually hidden data table for every chart. New `--ui-chart-1` … `--ui-chart-8` tokens (Tailwind `chart-1` … `chart-8`): a colorblind-validated categorical palette with its own dark-mode steps.

### Patch Changes

- Updated dependencies [8fb121f]
  - @ux-sting/tokens@0.6.0
  - @ux-sting/themes@0.6.0
  - @ux-sting/hooks@0.6.0
  - @ux-sting/icons@0.6.0
  - @ux-sting/primitives@0.6.0
  - @ux-sting/utils@0.6.0

## 0.5.0

### Minor Changes

- b2a844e: New `Footer` pattern (`@ux-sting/react/footer`): `contentinfo` landmark with an optional `FooterCallout` CTA band, `FooterMain` (`FooterBrand` + `FooterTagline`, `FooterNav` of `FooterColumn`s with `FooterLink`s — `asChild`, `icon`, `badge`, `external`), and `FooterBottom` with `FooterCopyright` and dot-separated `FooterLegal`. `tone="inverse"` (dark in every color mode, default) or `tone="default"` (theme surface); retint through `--footer-bg/-fg/-muted/-border/-accent`.

### Patch Changes

- @ux-sting/hooks@0.5.0
- @ux-sting/icons@0.5.0
- @ux-sting/primitives@0.5.0
- @ux-sting/themes@0.5.0
- @ux-sting/tokens@0.5.0
- @ux-sting/utils@0.5.0

## 0.4.0

### Minor Changes

- 8d157dc: `ThemeScript` takes an optional `theme` (and `getThemeScript` a third argument) that sets `data-ui-theme` on `<html>` before paint. Without it, a page using a named or custom `UIProvider` theme painted in the default theme's colors until React hydrated.

### Patch Changes

- d11615f: `Badge` with `asChild` no longer throws when it wraps a link or other element. It passed the icon slot and the child to `Slot` as two children; the child is now marked with `Slottable`, so the icon or dot renders inside the link.
- Updated dependencies [8d157dc]
  - @ux-sting/utils@0.4.0
  - @ux-sting/hooks@0.4.0
  - @ux-sting/primitives@0.4.0
  - @ux-sting/icons@0.4.0
  - @ux-sting/themes@0.4.0
  - @ux-sting/tokens@0.4.0

## 0.3.0

### Patch Changes

- ff7a929: `ux-sting qa` measures contrast for text over photos and gradients on the rendered pixels (hide the text, screenshot its box, take the worst 5%) instead of reporting 1:1 against an assumed white page; SVG text is measured with its `fill`. New exports: `decodePng`, `pixelContrast`, `measurePixelContrast`.

  `@ux-sting/react`: `CarouselDots` buttons are now full 24px targets that no longer overlap (WCAG 2.5.8), and `CategoryCard`'s scrim is stronger so labels stay readable over light photos.
  - @ux-sting/hooks@0.3.0
  - @ux-sting/icons@0.3.0
  - @ux-sting/primitives@0.3.0
  - @ux-sting/themes@0.3.0
  - @ux-sting/tokens@0.3.0
  - @ux-sting/utils@0.3.0

## 0.2.0

### Patch Changes

- @ux-sting/hooks@0.2.0
- @ux-sting/icons@0.2.0
- @ux-sting/primitives@0.2.0
- @ux-sting/themes@0.2.0
- @ux-sting/tokens@0.2.0
- @ux-sting/utils@0.2.0
