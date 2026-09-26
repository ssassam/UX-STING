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

## Company-style presets

Seven presets reproduce the look of widely used enterprise design systems, so a product can match an existing ecosystem without restyling any component:

```tsx
<UIProvider theme="fluent">…</UIProvider>
```

| Preset | Style of | Character | Reference |
| --- | --- | --- | --- |
| `material` | Material Design 3 (Google) | Tonal purple, tinted surfaces, rounded shapes, Roboto | [m3.material.io](https://m3.material.io) |
| `fluent` | Fluent 2 (Microsoft) | Communication blue, 4px corners, Segoe UI | [fluent2.microsoft.design](https://fluent2.microsoft.design) |
| `carbon` | Carbon (IBM) | Square corners, flat surfaces, IBM Plex Sans/Mono | [carbondesignsystem.com](https://carbondesignsystem.com) |
| `polaris` | Polaris (Shopify) | Ink-black primary, green success, compact admin density | [polaris.shopify.com](https://polaris.shopify.com) |
| `apple` | Human Interface Guidelines (Apple) | System blue, generous rounding, spacious density, SF system font | [developer.apple.com/design](https://developer.apple.com/design/human-interface-guidelines) |
| `baseweb` | Base Web (Uber) | Black primary, tight corners, flat utilitarian surfaces | [baseweb.design](https://baseweb.design) |
| `stripe` | Stripe | Blurple primary, navy-slate text, soft layered shadows | [stripe.com](https://stripe.com) |

These presets are unofficial approximations built only from UX-STING tokens. They are not affiliated with or endorsed by Google, Microsoft, IBM, Shopify, Apple, Uber or Stripe, and they copy no code or assets. Fonts are referenced by name with system fallbacks: load Roboto, IBM Plex or Inter yourself (all under the SIL Open Font License) if you want them exactly. SF Pro and Segoe UI are only used when already installed on the device, as their licenses do not allow bundling. Every preset passes the same WCAG AA contrast tests as the built-in ones, in light and dark mode.

Each preset is a starting point — extend it like any other theme:

```ts
import { createTheme, presetConfigs } from "@ux-sting/themes";

const brand = createTheme({ ...presetConfigs.carbon, name: "brand", primary: "teal" });
```

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
    vars: { "shadow-md": "none" }, // any other token, without the --ui- prefix
  }}
>
```

Prefer static CSS in production? Generate it once:

```ts
import { createTheme, themeToCss } from "@ux-sting/themes";

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

Every preset is tested in light and dark mode: all text pairs must reach 4.5:1 and focus rings/inputs 3:1 (`packages/themes/src/themes.test.ts`). Run the same check for custom themes with `contrastRatio()` from `@ux-sting/tokens`.
