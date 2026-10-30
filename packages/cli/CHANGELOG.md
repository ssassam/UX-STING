# ux-sting

## 0.7.0

### Minor Changes

- e708ae5: Add `ux-sting tokens export` — export the UX-STING design tokens to portable,
  framework-agnostic formats: W3C Design Tokens JSON (DTCG), CSS custom properties,
  SCSS variables and a Tailwind CSS v4 `@theme` mapping (`--format dtcg,css,scss,tailwind`,
  `--out <dir>`). The emitters live in `@ux-sting/tokens`; the command runs via
  `@ux-sting/extract`. Use `tokens.json` to drive non-React stacks (Vue, Svelte,
  native, Figma, Style Dictionary), making the design system usable beyond React.

  Also fixes CLI path handling on Windows: the entry guard now matches backslash
  `process.argv[1]` (every command was silently no-opping), `build-registry` keeps
  `registryDependencies` and POSIX file paths regardless of OS, and `ux-sting add`/
  `diff` write portable lockfile keys. The `ux-sting-design-agent` skill is now
  stack-aware (detects the stack, builds non-React targets from the exported tokens,
  keeps browser QA for every stack).

## 0.6.3

### Patch Changes

- 1dd18d2: Advertise the UX-STING Agent Skills + Universal Design Agent in the CLI README (cross-host install: `npx skills add ssassam/UX-STING` and the Claude Code plugin), so people browsing the npm package page can discover them.

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
