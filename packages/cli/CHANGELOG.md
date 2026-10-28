# ux-sting

## 0.6.2

### Patch Changes

- 1292ec4: Restore the npm package README with installation instructions, command examples,
  documentation links, creator attribution, and the existing Buy Me a Coffee link.
  Add a prepack check so a missing package README cannot silently ship again.

## 0.6.1

## 0.6.0

## 0.5.0

## 0.4.0

## 0.3.0

## 0.2.0

### Minor Changes

- 13c728c: New `@ux-sting/qa` package and `ux-sting qa <url|path>` command: screenshots at 375/768/1440, axe, contrast, layout checks (overflow, unequal margins, orphans, empty stretches, title on the first screen), console errors and LCP/CLS, with a short markdown report, JSON and ranked top-3 fixes.
- a11a84a: New `@ux-sting/extract` package and `ux-sting extract`, `ux-sting theme import` and `ux-sting dna` commands: measure any live page into W3C DTCG tokens (colors, type, spacing, radii, shadows, motion, breakpoints) with provenance, import DTCG from any tool into an OKLCH UX-STING theme with WCAG AA enforced, and match a design to the nearest preset without inventing missing measurements.
- 45b17d1: New `@ux-sting/images` package and `ux-sting images` command (Wikimedia Commons, The Met Open Access, Openverse; public domain, CC0, CC BY and CC BY-SA only; credits recorded automatically). `ux-sting qa` adds anti-slop checks (`slop:*`, `data:numbers-misaligned`; disable with `--no-taste`). The `ux-sting-taste` skill is rebuilt as a full art-direction pipeline with a dashboard route.
