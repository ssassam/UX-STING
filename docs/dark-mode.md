# Dark mode

Light mode is the default. Dark mode is purely a token swap: no component contains dark-specific colors.

```tsx
<UIProvider defaultColorMode="light" storageKey="ui-color-mode">
  <ColorModeToggle />
</UIProvider>
```

Modes: `light`, `dark`, `high-contrast`, `system` (follows `prefers-color-scheme` and `prefers-contrast`).

The attribute `data-theme="dark"` (or the `.dark` class, for Tailwind conventions) can be set on any element to switch a subtree. Tailwind's `dark:` variant is mapped to the same attribute.

Dark colors are designed, not inverted: surfaces use lighter tonal steps, saturated colors are softened, and every pair is re-checked for contrast.

To avoid a flash of the wrong theme in SSR apps, render `<ThemeScript />` in `<head>` (see [Next.js](./nextjs.md)).
