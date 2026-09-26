# Design tokens

Tokens are defined in TypeScript (`@ux-sting/tokens`) and compiled to CSS variables prefixed with `--ui-` (change `PREFIX` in `css.ts` to rebrand).

## Semantic colors

Components only use semantic roles:

| Role | Use |
| --- | --- |
| `background` / `foreground` | Page |
| `surface`, `muted`, `subtle` | Secondary surfaces |
| `card`, `popover` (+ `-foreground`) | Elevated surfaces |
| `primary`, `secondary`, `accent` | Actions and emphasis |
| `destructive`, `success`, `warning`, `info` | Status (each with `-foreground`, `-hover`, `-subtle`, `-subtle-foreground`) |
| `border`, `border-strong`, `input`, `ring` | Lines and focus |
| `overlay` | Modal scrims |

In Tailwind they are utilities: `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`.

## Palettes

Twelve 11-step OKLCH scales (`gray`, `slate`, `blue`, `indigo`, `violet`, `pink`, `red`, `orange`, `amber`, `green`, `teal`, `sky`) are generated from hue and chroma, so custom scales are one call: `createScale(hue, chroma)`.

## Scales

| Group | Variables |
| --- | --- |
| Spacing | `--ui-space-0` … `--ui-space-24` (4px grid) |
| Typography | `--ui-font-sans/serif/mono`, `--ui-text-xs…6xl` + `-leading`, `--ui-weight-*`, `--ui-leading-*`, `--ui-tracking-*` |
| Radius | `--ui-radius` (base) and `--ui-radius-xs…2xl`, `full` |
| Shadows | `--ui-shadow-xs…xl` |
| Borders | `--ui-border-0/1/2` |
| Z-index | `--ui-z-sticky`, `header`, `overlay`, `modal`, `popover`, `toast`, `tooltip` |
| Motion | `--ui-duration-*`, `--ui-duration-exit-*` (≈65% of enter), `--ui-ease-*` |
| Breakpoints | `--ui-breakpoint-sm…2xl` |
| Containers | `--ui-container-xs…7xl`, `prose` |
| Component heights | `--ui-height-xs…xl` (density-dependent) |
| Icons | `--ui-icon-xs…xl`, `--ui-icon-stroke` |
| Targets | `--ui-target-min` (24px, WCAG 2.5.8), `--ui-target-touch` (44px) |

## Using tokens in TypeScript

```ts
import { palette, spacing, contrastRatio, createLightColors } from "@ux-sting/tokens";
```
