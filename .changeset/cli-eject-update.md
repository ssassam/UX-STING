---
"ux-sting": minor
"@ux-sting/react": minor
---

Eject and update:

- `npx ux-sting eject <component…>`: for apps that use the `@ux-sting/react` package. It copies only the component's own folder into the project, points its other imports at the package (`@ux-sting/react/<sibling>`, `/provider`, `/internal`) so React context stays shared, and rewrites the app's imports to the local copy (splitting named root imports). Supports `--dry-run`, `--overwrite` and `--no-codemod`.
- `npx ux-sting update [component…]`: re-applies the registry to copied and ejected components. Unedited files are updated; edited files are kept and the new version is written to `<file>.upstream`. Exits 1 when there are conflicts.
- `@ux-sting/react/internal`: new entry point exporting the shared `lib/*` building blocks (field wiring, overlay and menu parts, control styles) that ejected components import.
