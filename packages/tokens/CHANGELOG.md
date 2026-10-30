# @ux-sting/tokens

## 0.8.1

## 0.8.0

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

## 0.6.2

## 0.6.1

## 0.6.0

### Minor Changes

- 8fb121f: Add the chart family (`@ux-sting/react/chart`): `LineChart`/`AreaChart`, `BarChart`, `BarList`, `DonutChart`, `Sparkline` and `ChartMetrics`. Dependency-free SVG with crosshair/per-column tooltips, keyboard navigation, a live region and a visually hidden data table for every chart. New `--ui-chart-1` … `--ui-chart-8` tokens (Tailwind `chart-1` … `chart-8`): a colorblind-validated categorical palette with its own dark-mode steps.

## 0.5.0

## 0.4.0

## 0.3.0

## 0.2.0
