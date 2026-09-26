# Installation

There are two ways to use unified-ui. Pick one per project — or mix them: install the package and copy only the components you want to customise.

## Option A — package (fastest)

```bash
pnpm add @unified-ui/react
```

### With Tailwind CSS v4 (recommended)

```css
/* app/globals.css */
@import "tailwindcss";
@import "@unified-ui/react/tailwind.css";
```

`tailwind.css` brings the tokens, the Tailwind theme mapping (`bg-primary`, `h-control-md`, `rounded-lg`…), theme presets, component animations and an `@source` pointing at the compiled components, so only the utilities you use are generated.

### Without Tailwind

```ts
import "@unified-ui/react/styles.css";
```

A precompiled stylesheet with a CSS reset, tokens, themes and every utility the components use. You can still override anything with your own CSS or `className`.

### Wrap your app

```tsx
import { UIProvider } from "@unified-ui/react/provider";

export default function App({ children }) {
  return <UIProvider theme="default">{children}</UIProvider>;
}
```

`UIProvider` is optional — components work without it — but it enables theme presets, color mode, density, locale/RTL and themed portals.

### Import per component

```tsx
import { Button } from "@unified-ui/react/button";
import { Dialog, DialogContent, DialogTrigger } from "@unified-ui/react/dialog";
```

The root `@unified-ui/react` barrel also works and is tree-shaken by modern bundlers, but per-component entry points keep dev builds fast and make client/server boundaries obvious.

## Option B — copy the source (own it)

```bash
npx unified-ui init
npx unified-ui add button dialog data-table
```

`init` writes `unified-ui.json`, copies the provider and component styles, adds the CSS imports to your global stylesheet and installs the small runtime packages (`@unified-ui/utils`, `hooks`, `primitives`, `icons`, `tokens`, `themes`). `add` copies components plus everything they depend on. See the [CLI guide](./cli.md).

## Requirements

- React 18.2+ or 19
- Tailwind CSS v4 for copied components (the package works without Tailwind)
- TypeScript 5+ recommended (strict mode supported)
