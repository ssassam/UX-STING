# @ux-sting/catalog

Design intelligence for [UX-STING](https://github.com/ssassam/UX-STING). Describe a product and get
an industry-aware design system, plus a UX-STING theme you can use straight away, with WCAG AA
contrast already enforced.

```sh
npm i -D ux-sting @ux-sting/catalog

npx ux-sting brief "beauty spa booking" --out src/theme
# Page pattern, style, palette, font pairing, effects, anti-patterns and UX rules,
# then writes beauty-spa-wellness-service.theme.ts / .theme.json / .css and design-system.md

npx ux-sting brief "crypto exchange dashboard" --stack nextjs --style "dark mode"
npx ux-sting search styles "glass dark premium"
npx ux-sting search typography "playful kids"
npx ux-sting search charts "funnel conversion"
npx ux-sting search stacks "image loading" --stack nextjs
```

## What's inside

| Domain | Records | |
| --- | --- | --- |
| `products` / `reasoning` / `colors` | 192 each | Product types with page pattern, style priority, color/type mood, effects, decision rules, anti-patterns and a full semantic palette |
| `styles` | 88 | Glassmorphism, Neubrutalism, Bento, AI-Native, Liquid Glass… with effects, accessibility and performance notes |
| `typography` | 74 | Font pairings with Google Fonts URLs |
| `landing` | 34 | Landing-page patterns with section order and CTA placement |
| `ux` / `app` / `performance` | 119 / 32 / 44 | UX, app-interface and React performance rules |
| `charts` / `motion` / `icons` | 25 / 17 / 105 | Chart choice, motion recipes, icon guidance |
| `stacks` | 1,271 | Guidelines for 22 stacks (React, Next.js, Vue, Svelte, Astro, Flutter, SwiftUI, …) |

## API

```ts
import { brief, search, renderBrief } from "@ux-sting/catalog";
import { createTheme } from "@ux-sting/themes";

const b = brief("law firm", { name: "counsel" });
const theme = createTheme(b.theme!.config); // <UIProvider theme={theme}>
search("styles", "soft pastel", { limit: 3 });
```

## Data

The knowledge base is converted from the MIT-licensed
[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) project
(© 2024 Next Level Builder); see [NOTICE.md](./NOTICE.md).
