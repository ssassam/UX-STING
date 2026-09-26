# Introduction

unified-ui is an independent React UI system. It combines ideas that proved themselves across the ecosystem into **one coherent framework**:

| Idea | Inspired by | How unified-ui applies it |
| --- | --- | --- |
| Own your components | shadcn/ui | `npx unified-ui add dialog` copies readable source into your repo |
| Accessible primitives | Radix UI, React Aria | Radix handles focus, dismissal and ARIA for overlays and menus; our own headless logic covers the rest |
| Breadth | MUI | ~95 component families from layout to data grids, date pickers and commerce/local-discovery patterns |
| Design tokens | Chakra UI | Semantic CSS variables, responsive props, density and theme presets |
| Modern visual language | HeroUI | Soft surfaces, subtle borders, controlled shadows, refined motion |

The public API — names, props, variants, tokens — belongs to unified-ui. None of the five libraries is a runtime dependency; Radix primitives are used internally where they are the best accessible foundation.

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
| `@unified-ui/react` | All React components, per-component entry points, styles |
| `@unified-ui/tokens` | Palettes, semantic colors, scales → TypeScript + CSS variables + Tailwind v4 theme |
| `@unified-ui/themes` | Theme engine and presets |
| `@unified-ui/primitives` | Headless building blocks: Slot, Portal, VisuallyHidden, roving focus, calendar math |
| `@unified-ui/hooks` | Controllable state, disclosure, media queries, hotkeys, clipboard… |
| `@unified-ui/utils` | `cn`, `createVariants`, keyboard/focus/responsive/format helpers |
| `@unified-ui/icons` | Tree-shakeable SVG icons (Lucide data) and `<Icon name>` |
| `@unified-ui/core` | Framework-agnostic entry: tokens + themes + utils |
| `unified-ui` (CLI) | `init`, `add`, `list`, `diff` |

## Next steps

- [Installation](./installation.md)
- [Theming](./theming.md)
- [Accessibility](./accessibility.md)
