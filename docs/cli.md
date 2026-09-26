# CLI

The `ux-sting` CLI copies component source into your project — you own it and can change anything.

```bash
npx ux-sting init
npx ux-sting add button
npx ux-sting add dialog data-table form
npx ux-sting list
npx ux-sting diff
```

## init

- Writes `ux-sting.json`:

```json
{
  "dir": "src/components/ui",
  "css": "src/app/globals.css",
  "importExtensions": false
}
```

- Copies the `provider` (UIProvider, messages) and `styles/ux-sting.css` (animations, layout variables, hit areas).
- Adds the token, Tailwind theme and theme-preset imports to your global CSS right after `@import "tailwindcss"`.
- Installs `@ux-sting/tokens`, `themes`, `utils`, `hooks`, `primitives`, `icons` with your package manager (pnpm, yarn, bun or npm — detected from the lockfile).

Options: `--dir <path>`, `--css <file>`, `--force`, `--no-install`, `--cwd <path>`.

## add

Copies components **and their registry dependencies** (other components, shared `lib/*` helpers, the provider), then installs any missing npm dependencies (e.g. `@radix-ui/react-dialog`).

- Folder layout is preserved (`components/<name>/`, `lib/`, `provider/`), so relative imports keep working.
- `.js` extensions in relative imports are stripped for bundler-based apps (keep them with `"importExtensions": true`).

### Your changes are protected

`ux-sting.lock.json` stores a hash of each file as installed. On the next `add`:

| Situation | Result |
| --- | --- |
| File unchanged locally, registry unchanged | "up to date" |
| File unchanged locally, registry updated | updated |
| File edited locally | **skipped with a warning** |
| `--overwrite` | replaced |

Use `--dry-run` to preview.

## diff

Lists installed files that are `locally modified`, have an `update available`, or are `missing`. Exits with code 1 when updates are available (useful in CI).

## list

Prints every component grouped by category.

## Registries

`--registry <file|url>` (or `"registry"` in `ux-sting.json`) points the CLI at a custom registry JSON — handy for company forks. Build the registry with `pnpm registry`.
