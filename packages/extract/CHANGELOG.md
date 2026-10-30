# @ux-sting/extract

## 0.8.1

### Patch Changes

- @ux-sting/qa@0.8.1
- @ux-sting/themes@0.8.1
- @ux-sting/tokens@0.8.1

## 0.8.0

### Patch Changes

- @ux-sting/qa@0.8.0
- @ux-sting/themes@0.8.0
- @ux-sting/tokens@0.8.0

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

### Patch Changes

- Updated dependencies [e708ae5]
  - @ux-sting/tokens@0.7.0
  - @ux-sting/themes@0.7.0
  - @ux-sting/qa@0.7.0

## 0.6.3

### Patch Changes

- @ux-sting/qa@0.6.3
- @ux-sting/themes@0.6.3
- @ux-sting/tokens@0.6.3

## 0.6.2

### Patch Changes

- @ux-sting/qa@0.6.2
- @ux-sting/themes@0.6.2
- @ux-sting/tokens@0.6.2

## 0.6.1

### Patch Changes

- @ux-sting/qa@0.6.1
- @ux-sting/themes@0.6.1
- @ux-sting/tokens@0.6.1

## 0.6.0

### Patch Changes

- Updated dependencies [8fb121f]
  - @ux-sting/tokens@0.6.0
  - @ux-sting/themes@0.6.0
  - @ux-sting/qa@0.6.0

## 0.5.0

### Patch Changes

- @ux-sting/qa@0.5.0
- @ux-sting/themes@0.5.0
- @ux-sting/tokens@0.5.0

## 0.4.0

### Patch Changes

- @ux-sting/qa@0.4.0
- @ux-sting/themes@0.4.0
- @ux-sting/tokens@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [ff7a929]
  - @ux-sting/qa@0.3.0
  - @ux-sting/themes@0.3.0
  - @ux-sting/tokens@0.3.0

## 0.2.0

### Minor Changes

- a11a84a: New `@ux-sting/extract` package and `ux-sting extract`, `ux-sting theme import` and `ux-sting dna` commands: measure any live page into W3C DTCG tokens (colors, type, spacing, radii, shadows, motion, breakpoints) with provenance, import DTCG from any tool into an OKLCH UX-STING theme with WCAG AA enforced, and match a design to the nearest preset without inventing missing measurements.

### Patch Changes

- 9c2b2b2: `ux-sting qa`: wrapping rows of differently sized chips are no longer reported as orphaned grid items, and ©, ® and ™ no longer count as emoji icons. `ux-sting extract`: text that is unreadable on the page background (a dark label on a light button) is no longer taken as the muted text color. Found while building the toolkit demo site (`examples/toolkit`).
- Updated dependencies [13c728c]
- Updated dependencies [b29382f]
- Updated dependencies [45b17d1]
- Updated dependencies [9c2b2b2]
  - @ux-sting/qa@0.2.0
  - @ux-sting/themes@0.2.0
  - @ux-sting/tokens@0.2.0
