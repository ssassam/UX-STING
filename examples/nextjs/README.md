# Next.js starter (copied source)

This example was created exactly as a user would, with the CLI:

```bash
npx ux-sting init --dir components/ui --css app/globals.css
npx ux-sting add button card badge dialog field form input password-input checkbox select toast data-table stat tabs
```

- Component source lives in `components/ui/` (you own it).
- `ux-sting.json` stores the CLI config; `ux-sting.lock.json` stores hashes of installed files so later `add` runs skip files you changed.
- Inside this monorepo, `@ux-sting/*` runtime packages resolve to the workspace; in a real project the CLI installs them from npm.

Try `pnpm ui:add calendar` and `node ../../packages/cli/dist/index.js diff`.
