# @ux-sting/utils

**UX-STING by [Veltein](https://veltein.com)**

Framework-agnostic TypeScript utilities for building interfaces: merge classes, define component variants, handle keyboard navigation, format localized values, and work with themes and motion.

Part of [UX-STING](https://github.com/ssassam/UX-STING), with no React dependency. Use it in your own interface or alongside the UX-STING design system.

[npm](https://www.npmjs.com/package/@ux-sting/utils) · [Source](https://github.com/ssassam/UX-STING/tree/main/packages/utils) · [Report an issue](https://github.com/ssassam/UX-STING/issues) · [Veltein](https://veltein.com)

## Install

```bash
npm install @ux-sting/utils
```

Also available with `pnpm add @ux-sting/utils` or `yarn add @ux-sting/utils`.

The package ships ES modules and TypeScript declarations. Import named exports from `@ux-sting/utils`; CommonJS `require()` is not an exported entry point. It is marked as side-effect-free for bundlers that support tree shaking.

## Quick start

```ts
import { cn, formatCurrency, getInitials } from "@ux-sting/utils";

cn("px-4 py-2", "px-6", { "font-semibold": true });
// "py-2 px-6 font-semibold"

formatCurrency(49, "EUR", "en-US");
// "€49.00"

getInitials("Veltein Studio");
// "VS"
```

No provider or stylesheet is required to call these utilities. Class helpers return strings; your project's CSS supplies the styles. `cn` uses `tailwind-merge` 3 for Tailwind CSS 4 class conflicts. Use `mergeClasses` when you only need to join classes without resolving conflicts.

## Define component variants

```ts
import { createVariants, type VariantProps } from "@ux-sting/utils";

const button = createVariants({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    tone: {
      primary: "bg-black text-white",
      subtle: "bg-gray-100 text-black",
    },
  },
  defaultVariants: { size: "md", tone: "primary" },
});

type ButtonVariants = VariantProps<typeof button>;

const selection: ButtonVariants = { size: "sm", tone: "subtle" };
button(selection);
button({ className: "px-6" }); // Consumer classes override conflicting defaults.
```

`createVariants` also accepts `compoundVariants` for classes that depend on multiple selected variants.

## Keyboard navigation

```ts
import { getNextIndex, Keys, formatShortcut } from "@ux-sting/utils";

getNextIndex(Keys.ArrowDown, 0, 3); // 1
getNextIndex(Keys.ArrowDown, 2, 3); // 0 (loops by default)
getNextIndex(Keys.ArrowLeft, 0, 3, { orientation: "horizontal", dir: "rtl" });
// 1

formatShortcut("mod+k", true); // "⌘K" on Apple platforms
formatShortcut("mod+k", false); // "Ctrl+K" elsewhere
```

`getNextIndex` calculates an index; your component handles the keyboard event and moves focus. It returns `null` for keys that do not navigate in the selected orientation.

## Available utilities

| Area | Exports |
| --- | --- |
| Classes | `cn`, `mergeClasses` |
| Variants | `createVariants`, `VariantProps`, `VariantSelection` |
| Keyboard | `Keys`, `getNextIndex`, `isActivationKey`, `parseShortcut`, `matchesShortcut`, `formatShortcut`, `isApplePlatform` |
| Focus | `focusRing`, `focusRingInset`, `getFocusableElements`, `focusFirst` |
| Responsive values | `BREAKPOINTS`, `isResponsiveObject`, `responsiveVars`, `resolveResponsive` |
| Formatting | `formatNumber`, `formatCurrency`, `formatCompact`, `formatPercent`, `formatDate`, `formatRelativeTime`, `formatFileSize`, `getDirection` |
| Search | `fuzzyScore` |
| Themes | `applyThemeAttributes`, `resolveColorMode`, `getThemeScript` |
| Refs | `setRef`, `mergeRefs` |
| Motion math | `interpolate`, `linear`, `cubicBezier`, `easings`, `spring`, `springs`, `springDuration`, `springToCss` |
| General | `clamp`, `snapToStep`, `range`, `uniqueId`, `callAll`, `getInitials`, `getPaginationRange` |

See the [TypeScript source](https://github.com/ssassam/UX-STING/tree/main/packages/utils/src) for signatures, options, and exported types.

## Runtime and styling notes

- Formatting helpers use the runtime's `Intl` APIs. Pass an explicit locale for predictable output; available locale data and time zones can affect formatting.
- Class, variant, formatting, responsive-value, search, and motion-math helpers can run without a DOM. Focus helpers operate on DOM elements; use them in browser code.
- `responsiveVars` produces CSS custom properties. Your stylesheet defines the breakpoint rules that consume them.
- Theme helpers set attributes or generate an initialization script; theme styles are supplied separately. Focus-ring classes reference UX-STING theme tokens such as `ring` and `background`.

## About Veltein

UX-STING is a project by **Veltein**, the work of **Issam El Bani** across websites, applications, and automation.

Explore the work and get in touch at **[veltein.com](https://veltein.com)**. Follow development on [GitHub](https://github.com/ssassam/UX-STING) or browse the [UX-STING demos](https://ssassam.github.io/UX-STING/).

## Hi, VELTEIN

If UX-STING helps you build, you can support the work of Veltein on [Buy Me a Coffee](https://buymeacoffee.com/veltein).

## Contributing

Report bugs and suggest improvements through [GitHub issues](https://github.com/ssassam/UX-STING/issues). For local development and contribution guidelines, see [CONTRIBUTING.md](https://github.com/ssassam/UX-STING/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/ssassam/UX-STING/blob/main/packages/utils/LICENSE).
