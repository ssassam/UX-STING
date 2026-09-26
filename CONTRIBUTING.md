# Contributing to UX-STING

Thanks for helping! This guide covers setup, conventions and the review checklist.

## Setup

```bash
corepack enable
pnpm install
pnpm build        # builds all packages (tokens → themes → utils/hooks/primitives/icons → react → cli)
pnpm test         # vitest: unit, interaction, keyboard, axe, CLI
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `pnpm typecheck` | Strict TypeScript across packages and tests |
| `pnpm lint` | ESLint (TypeScript, react-hooks, jsx-a11y) |
| `pnpm ux-audit` | Static UX rules (tokens only, no 100vh, focus replacements, logical properties…) |
| `pnpm readmes` | Regenerates component READMEs and `registry/api.json` from source |
| `pnpm registry` | Rebuilds the CLI registry |
| `pnpm size` | Bundle size per component entry point |
| `pnpm --filter @ux-sting/docs dev` | Documentation site |
| `pnpm --filter @ux-sting/playground dev` | Component lab |
| `pnpm --filter @ux-sting/storybook dev` | Storybook |

## Project layout

```
packages/tokens      design tokens (TS → CSS variables, Tailwind theme)
packages/themes      theme engine + presets
packages/utils       cn, createVariants, keyboard/focus/responsive/format
packages/hooks       React hooks
packages/primitives  Slot, Portal, VisuallyHidden, roving focus, calendar math
packages/icons       generated icons
packages/react       components, provider, styles
packages/cli         the `ux-sting` CLI and registry
registry/            component metadata (docs, READMEs, CLI) + extracted API
apps/docs            Next.js documentation site with live demos
apps/playground      Vite component laboratory
apps/storybook       Storybook + visual regression
examples/            travel, car-rental, shop, watch, crypto, dashboard, marketplace, directory, editorial, nextjs (CLI)
```

## Component checklist

- [ ] Follows [API conventions](docs/api-consistency.md): `variant`, `size`, `disabled`, `loading`, `asChild`, `className`, controlled/uncontrolled via `useControllableState`
- [ ] Uses semantic tokens only; logical properties for RTL; `"use client"` only when needed
- [ ] Keyboard support per WAI-ARIA APG; visible focus; labelled; no color-only meaning
- [ ] Localizable strings come from `useMessages()` or props
- [ ] Tests: rendering, interaction, keyboard, controlled/uncontrolled, `expectNoA11yViolations`
- [ ] Story (default + states), demo in `apps/docs/demos`, metadata in `registry/components.ts`
- [ ] `pnpm check && pnpm ux-audit` pass

## Dependency policy

Before adding a dependency, answer in the PR: Is it necessary? Could it be implemented simply? Bundle impact? Maintained? License compatible (MIT/ISC/Apache-2.0/BSD)? RSC/Next.js compatible? Does it duplicate an existing dependency? Update `THIRD_PARTY_NOTICES.md` when adding or redistributing third-party code.

## Commits & releases

Conventional commits (`feat:`, `fix:`, `docs:`…). Packages are versioned together.
