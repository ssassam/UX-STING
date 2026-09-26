# Next.js starter (copied source)

This example was created exactly as a user would, with the CLI:

```bash
npx unified-ui init --dir components/ui --css app/globals.css
npx unified-ui add button card badge dialog field form input password-input checkbox select toast data-table stat tabs
```

- Component source lives in `components/ui/` (you own it).
- `unified-ui.json` stores the CLI config; `unified-ui.lock.json` stores hashes of installed files so later `add` runs skip files you changed.
- Inside this monorepo, `@unified-ui/*` runtime packages resolve to the workspace; in a real project the CLI installs them from npm.

Try `pnpm ui:add calendar` and `node ../../packages/cli/dist/index.js diff`.
