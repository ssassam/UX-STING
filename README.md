# UX-STING

An accessible, themeable, tree-shakeable design system and React component library for Next.js and any React app.

- **~95 component families** — layout, typography, buttons, a complete form system, date/time, navigation, overlays, feedback, data table/grid, media, command palette, and commerce / local-discovery / editorial patterns
- **Accessible by default** — WCAG 2.2 AA, keyboard support, focus management, axe-tested, contrast-tested tokens
- **Design tokens & themes** — OKLCH semantic tokens as CSS variables, 13 presets (including Material, Fluent, Carbon, Polaris, Apple, Base Web and Stripe styles), custom themes, light/dark/high-contrast, 3 densities
- **Global** — RTL via logical properties, localized labels (en/fr/ar), `Intl` formatting everywhere
- **Next.js-first** — App Router, RSC-friendly (server components by default), per-component entry points
- **Own your code** — `npx ux-sting add dialog` copies source into your project, with a lockfile that protects your edits
- **Tailwind v4 native, Tailwind optional** — use `tailwind.css` or the precompiled `styles.css`

```bash
pnpm add @ux-sting/react
```

```css
@import "tailwindcss";
@import "@ux-sting/react/tailwind.css";
```

```tsx
import { UIProvider } from "@ux-sting/react/provider";
import { Button } from "@ux-sting/react/button";

<UIProvider theme="default">
  <Button loading>Save</Button>
</UIProvider>
```

## Repository

| Path | Description |
| --- | --- |
| `packages/react` | `@ux-sting/react` — components, provider, styles |
| `packages/tokens` | `@ux-sting/tokens` — design tokens |
| `packages/themes` | `@ux-sting/themes` — theme engine + presets |
| `packages/primitives` | `@ux-sting/primitives` — headless building blocks |
| `packages/hooks` | `@ux-sting/hooks` |
| `packages/utils` | `@ux-sting/utils` |
| `packages/icons` | `@ux-sting/icons` |
| `packages/core` | `@ux-sting/core` — framework-agnostic entry |
| `packages/cli` | `ux-sting` CLI |
| `apps/docs` | Documentation site (Next.js) with live, themeable examples |
| `apps/playground` | Component laboratory (Vite) |
| `apps/storybook` | Storybook + visual regression |
| `examples/*` | Travel booking site, SaaS dashboard, marketplace, local directory, editorial site, CLI starter |
| `docs/` | Guides (also rendered by the docs site) |
| `registry/` | Component metadata and extracted API |

## Documentation

Guides live in [`docs/`](docs/introduction.md) and in the docs app (`pnpm --filter @ux-sting/docs dev`):
[Installation](docs/installation.md) · [Next.js](docs/nextjs.md) · [Theming](docs/theming.md) · [Tokens](docs/tokens.md) · [Accessibility](docs/accessibility.md) · [UX quality rules](docs/ux-quality.md) · [RTL & i18n](docs/internationalization.md) · [CLI](docs/cli.md) · [API conventions](docs/api-consistency.md) · [Patterns](docs/patterns.md) · [Migration](docs/migration.md)

Each component folder also has a generated `README.md` (when to use, accessibility, keyboard, API).

## Development

```bash
pnpm install
pnpm check        # build + typecheck + lint + test
pnpm ux-audit
```

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. Third-party licenses and attributions: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
