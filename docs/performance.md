# Performance

- **Per-component entry points.** `@unified-ui/react/button` loads only the button and its tiny dependencies. Each component is its own ESM module (no bundled chunk), so bundlers tree-shake perfectly. All packages declare `sideEffects` (CSS only).
- **Minimal client JavaScript.** Static components are server components; interactive ones are marked `"use client"` at file level.
- **No runtime CSS-in-JS.** Styling is static CSS (Tailwind utilities + CSS variables). Theme switching changes attributes, not styles in JS.
- **Small dependency surface.** React, Radix primitives (only those used by the component you import), `tailwind-merge`. No date library — calendar math is ~150 lines in `@unified-ui/primitives`.
- **Icons are separate and tree-shakeable.** Import `SearchIcon` directly; `<Icon name>` is available via `@unified-ui/icons/dynamic` when you need data-driven icons.
- **Layout stability.** `Image`/`AspectRatio`/`Skeleton` reserve space; `OpenStatus` renders a same-size placeholder until hydration.

Run `pnpm size` to print the minified + gzipped cost of each component entry point (React and peer dependencies excluded).
