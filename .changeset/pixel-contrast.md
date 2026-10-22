---
"@ux-sting/qa": minor
"@ux-sting/react": patch
---

`ux-sting qa` measures contrast for text over photos and gradients on the rendered pixels (hide the text, screenshot its box, take the worst 5%) instead of reporting 1:1 against an assumed white page; SVG text is measured with its `fill`. New exports: `decodePng`, `pixelContrast`, `measurePixelContrast`.

`@ux-sting/react`: `CarouselDots` buttons are now full 24px targets that no longer overlap (WCAG 2.5.8), and `CategoryCard`'s scrim is stronger so labels stay readable over light photos.
