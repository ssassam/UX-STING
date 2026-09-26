# Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for setup, workflow and review guidelines.

## Quick start

```bash
pnpm install
pnpm build          # packages
pnpm test           # unit, interaction, a11y, CLI tests
pnpm typecheck
pnpm lint
pnpm ux-audit
pnpm --filter @unified-ui/docs dev
```

## Adding a component

1. Create `packages/react/src/components/<name>/` with `<name>.tsx`, optional `<name>.types.ts`, `index.ts`.
2. Use only semantic tokens and existing primitives/hooks; follow [API conventions](./api-consistency.md).
3. Add metadata to `registry/components.ts` (when/why, accessibility, keyboard).
4. Add tests (interaction, keyboard, axe) and a story.
5. Add demos in `apps/docs/demos/<name>.tsx`.
6. Run `pnpm readmes && pnpm registry`.
