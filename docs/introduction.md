# Introduction

UX-STING is a design system and React component library built as **one coherent framework**:

| Pillar | How UX-STING applies it |
| --- | --- |
| Own your components | `npx ux-sting add dialog` copies readable source into your repo |
| Accessible primitives | Focus management, dismissal, keyboard support and ARIA patterns built into every interactive component |
| Breadth | ~95 component families from layout to data grids, date pickers and commerce/local-discovery patterns |
| Design tokens | Semantic CSS variables, responsive props, density and theme presets |
| Visual language | Soft surfaces, subtle borders, controlled shadows, refined motion |

## Principles

- **Accessible by default.** WCAG 2.2 AA is the baseline, verified with axe in tests and contrast checks on every theme.
- **Composition over configuration.** `<Card><CardHeader>…</CardHeader></Card>` rather than `<Card title footer image />`.
- **One vocabulary.** `variant`, `size`, `disabled`, `loading`, `asChild`, `className` mean the same thing everywhere. See [API conventions](./api-consistency.md).
- **Tokens, not raw colors.** Components only reference semantic variables, so dark mode, high contrast and custom themes need no per-component overrides.
- **Server-first.** Layout, typography, cards and most patterns are server components. Only interactive parts ship `"use client"`.
- **Light-first, global-ready.** Light mode by default; dark, high-contrast, RTL and localized labels built in.

## Packages

| Package | Purpose |
| --- | --- |
| `@ux-sting/react` | All React components, per-component entry points, styles |
| `@ux-sting/tokens` | Palettes, semantic colors, scales → TypeScript + CSS variables + Tailwind v4 theme |
| `@ux-sting/themes` | Theme engine and presets |
| `@ux-sting/primitives` | Headless building blocks: Slot, Portal, VisuallyHidden, roving focus, calendar math |
| `@ux-sting/hooks` | Controllable state, disclosure, media queries, hotkeys, clipboard… |
| `@ux-sting/utils` | `cn`, `createVariants`, keyboard/focus/responsive/format helpers |
| `@ux-sting/icons` | Tree-shakeable SVG icons (Lucide data) and `<Icon name>` |
| `@ux-sting/core` | Framework-agnostic entry: tokens + themes + utils |
| `ux-sting` (CLI) | `init`, `add`, `list`, `diff` |

## Next steps

- [Installation](./installation.md)
- [Theming](./theming.md)
- [Accessibility](./accessibility.md)
