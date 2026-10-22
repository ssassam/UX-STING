# @ux-sting/react

## 0.4.0

### Minor Changes

- 8d157dc: `ThemeScript` takes an optional `theme` (and `getThemeScript` a third argument) that sets `data-ui-theme` on `<html>` before paint. Without it, a page using a named or custom `UIProvider` theme painted in the default theme's colors until React hydrated.

### Patch Changes

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
