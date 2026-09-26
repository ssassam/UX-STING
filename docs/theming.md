# Theming

Themes are sets of CSS variables. Components never change — only tokens do.

## Presets

```tsx
<UIProvider theme="modern">…</UIProvider>
```

| Preset | Character |
| --- | --- |
| `default` | Blue primary, cool neutrals, medium radius |
| `neutral` | Monochrome primary for content-first products |
| `modern` | Violet primary, slate neutrals, larger radius |
| `compact` | Small radius and compact density for data-heavy apps |
| `soft` | Teal primary, larger radius, softer borders and tinted surfaces |
| `high-contrast` | AAA-level text contrast, strong borders and focus rings |

## Custom themes

Pass a config object; the provider generates scoped CSS (light, dark and high-contrast variants):

```tsx
<UIProvider
  theme={{
    name: "brand",
    primary: "pink",          // palette name or your own 11-step scale
    neutral: "slate",
    radius: "large",          // none | small | medium | large | any CSS length
    density: "comfortable",
    fontFamily: { sans: "Inter, system-ui, sans-serif" },
    colors: { light: { ring: "oklch(0.6 0.2 350)" } },
  }}
>
```

Prefer static CSS in production? Generate it once:

```ts
import { createTheme, themeToCss } from "@unified-ui/themes";

const css = themeToCss(createTheme({ name: "brand", primary: "teal" }));
```

and apply with `data-ui-theme="brand"` on any element.

## Overriding tokens directly

Any variable can be overridden in plain CSS:

```css
[data-ui-theme="default"] {
  --ui-primary: oklch(0.55 0.2 150);
  --ui-radius: 0.5rem;
}
```

When you override `--ui-radius` on an element that is not a theme scope, add `data-ui-scope` so the derived radius scale (`--ui-radius-sm` … `--ui-radius-2xl`) is recomputed there:

```html
<section data-ui-scope style="--ui-radius: 1rem">…</section>
```

## Scoping

Providers nest. A section can use a different theme, color mode or density than the rest of the page — overlays opened inside it portal into the nearest provider so they inherit the same variables.

## Contrast guarantees

Every preset is tested in light and dark mode: all text pairs must reach 4.5:1 and focus rings/inputs 3:1 (`packages/themes/src/themes.test.ts`). Run the same check for custom themes with `contrastRatio()` from `@unified-ui/tokens`.
