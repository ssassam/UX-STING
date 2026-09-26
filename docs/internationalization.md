# RTL & internationalization

## Direction

```tsx
<UIProvider locale="ar">…</UIProvider>   // dir="rtl" inferred
<UIProvider locale="fr" dir="ltr">…</UIProvider>
```

- Layout uses **logical properties** (`ms-*`, `pe-*`, `start-*`, `border-s`, `text-start`) — never left/right — so components mirror automatically.
- Sheets use `side="start" | "end"`, which flip in RTL.
- Directional icons (chevrons, arrows) rotate with `rtl:rotate-180`.
- Keyboard navigation mirrors horizontal arrows in RTL: Calendar, Tabs (via Radix `DirectionProvider`), Slider, Resizable, Tree, Carousel, DataGrid.
- Code, OTP digits and numbers that must stay LTR use `dir="ltr"` locally.

## Localized strings

Reusable components never hard-code English when avoidable. Labels such as "Close", "Next", "Page 2 of 5", "Remove Vegan" and "4.5 out of 5 stars" come from message catalogs:

| Locale | Catalog |
| --- | --- |
| `en` | built-in |
| `fr` | built-in |
| `ar` | built-in |

Override or add strings:

```tsx
<UIProvider locale="es" messages={{ close: "Cerrar", next: "Siguiente", pageOf: (p, t) => `Página ${p} de ${t}` }}>
```

Server components that cannot read context (e.g. `Breadcrumb`, `Stepper`, `Spinner`) accept label props (`label`, `completedLabel`).

## Formatting

All formatting uses `Intl`: `Price`, `PriceRange`, `Currency`, `NumberInput` (parses "1 234,5" and Arabic-Indic digits), `Calendar` (month/day names, first day of week from `Intl.Locale#weekInfo`), `TimePicker` (12/24h), `EventCard`, `OpeningHours`, `formatRelativeTime`, `formatFileSize`.

## Testing

The test suite covers French formatting, Arabic messages, RTL detection and mirrored keyboard navigation. Preview any docs example in RTL with the LTR/RTL toggle, or switch the whole docs site to Arabic from the header.
