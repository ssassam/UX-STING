# UX-STING

**Accessible components. Your code. Your design.**

The UX-STING CLI copies accessible, themeable React components into your project
so you can own and customize the source. It also connects optional tools for
browser QA, design-token extraction, theme import, and openly licensed images.

Created by **Issam El Bani** at **[VELTEIN](https://veltein.com)**.

[![npm](https://img.shields.io/npm/v/ux-sting)](https://www.npmjs.com/package/ux-sting)
[![MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/ssassam/UX-STING/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support_VELTEIN-FFDD00?logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/veltein)

## Quick start

Requires **Node.js 20.9+** and an existing React project. React components target
React 18/19 and Tailwind CSS 4.

```sh
npx ux-sting init
npx ux-sting list
npx ux-sting add button dialog data-table
```

Or install the CLI in your project:

```sh
npm install -D ux-sting
npx ux-sting --help
```

## What you get

- Source you can edit, with a lockfile that tracks installed components.
- Component families for forms, navigation, overlays, feedback, data, commerce,
  editorial interfaces, and motion effects.
- Semantic design tokens, theme presets, and light/dark/high-contrast modes.
- Keyboard and focus support, localized labels, and RTL-aware layouts.
- A bundled component registry, plus optional tools loaded only when you use them.

## Commands

| Command | Purpose |
| --- | --- |
| `npx ux-sting init` | Initialize project configuration and styles. |
| `npx ux-sting list` | List available registry components. |
| `npx ux-sting add button dialog` | Copy components and their dependencies. |
| `npx ux-sting add button --dry-run` | Preview the installation. |
| `npx ux-sting diff` | Compare installed components against the registry. |
| `npx ux-sting --help` | Show CLI commands and options. |

Common options include `--cwd <path>`, `--registry <file-or-url>`, `--no-install`,
and `--yes`. Use `add --overwrite` only when you intend to replace local files.

## Prefer package imports?

Install the React library instead of copying source:

```sh
npm install @ux-sting/react
```

```css
@import "tailwindcss";
@import "@ux-sting/react/tailwind.css";
```

```tsx
import { UIProvider } from "@ux-sting/react/provider";
import { Button } from "@ux-sting/react/button";

export function App() {
  return (
    <UIProvider theme="default">
      <Button>Get started</Button>
    </UIProvider>
  );
}
```

## Optional agent tools

Install only the tools you need:

```sh
npm install -D ux-sting @ux-sting/qa @ux-sting/extract @ux-sting/images
npx playwright-core install chromium

npx ux-sting qa http://localhost:3000
npx ux-sting extract https://example.com
npx ux-sting theme import ux-sting-extract/tokens.json
npx ux-sting dna https://example.com
npx ux-sting images "harbour at dawn" --download 1
```

`qa` and `extract` use a browser; install Chromium once before running them.
Image results include source and license information; review the attribution
requirements for each asset you use.

## Documentation and demos

- [Full project documentation](https://github.com/ssassam/UX-STING#readme)
- [Live showcase](https://ssassam.github.io/UX-STING/)
- [Design-system guide](https://github.com/ssassam/UX-STING/blob/main/docs/introduction.md)
- [All npm packages](https://www.npmjs.com/org/ux-sting)
- [Issues and contributions](https://github.com/ssassam/UX-STING/issues)

## Creator and support

UX-STING is created by **Issam El Bani / [VELTEIN](https://veltein.com)**.
If it helps you build, support the work on
**[Buy Me a Coffee](https://buymeacoffee.com/veltein)**.

MIT licensed. See [LICENSE](https://github.com/ssassam/UX-STING/blob/main/LICENSE).
