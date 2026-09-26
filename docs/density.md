# Density

```tsx
<UIProvider density="compact">…</UIProvider>
```

| Density | Control height (md) | Use for |
| --- | --- | --- |
| `compact` | 32px | Data tables, admin tools, dashboards |
| `comfortable` | 40px | Default — most products |
| `spacious` | 44px | Touch-first, marketing, accessibility-focused |

Density changes `--ui-height-*`, control padding, table cell padding, card padding, navigation item height, list item padding and stack gaps. Buttons, inputs, tables, cards, navigation and lists all respond.

Density can be scoped: wrap just a table in `<UIProvider density="compact">`.

Touch targets never drop below 24×24px (WCAG 2.5.8) and expand to 44px on coarse pointers regardless of density.
