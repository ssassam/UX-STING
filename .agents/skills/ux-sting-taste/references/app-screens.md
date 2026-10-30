# Dashboards and app screens — the quiet route

People open an app screen to read, compare and act, many times a day. Taste here is restraint: the data is the design. No art direction deck, no hero, no concept sentence — instead, these rules.

## Panels

- Quiet surfaces: `bg-background` page, `bg-card` panels with a hairline `border-border`; shadows only on things that float (menus, dialogs).
- One panel level. No cards inside cards; group with spacing and `Separator`.
- Panel headers: title (text-sm font-medium), optional one-line description, actions at the end. No icons in colored circles.
- Density from the user's job: `density="compact"` for operators scanning tables, `comfortable` for occasional users.

## Numbers

- Numeric columns and their headers are **end-aligned** (`text-end`) and use **tabular figures** (`tabular-nums`) so digits line up. `ux-sting qa` flags `data:numbers-misaligned`.
- Format with `Intl` (UX-STING's formatters): thousands separators, fixed decimals per column, units in the header not in every cell.
- KPI tiles: the number large, the label small above it, the comparison (delta + period) below. One tile row, 3–5 tiles; never "10x" or decorative sparklines without axes.
- Negative values: sign and color (`text-destructive`), never color alone.

## Color is spent on data

- Chrome stays neutral; the accent marks the current selection and the primary action only.
- Charts use the categorical/sequential tokens, not the brand accent repeated. Status colors (success/warning/destructive/info) only for status.
- No gradients, glows or glass on panels.

## Layout

- Navigation: sidebar or top bar, not both competing. Page title + primary action at the top; filters directly above the content they filter.
- Tables over card grids for anything with more than ~6 items or more than 3 attributes (`DataTable`: sorting, sticky header, row actions at the end).
- Empty, loading and error states for every panel (`Skeleton` → content, `EmptyState` with the next action).
- Responsive: tables scroll horizontally inside their panel, never the page; KPI rows wrap to 2 columns on phones.

## Motion

Almost none. Allowed, all from `@ux-sting/motion` (CSS, no dependencies): skeleton → content (`css/skeleton.css`), number change (`popNumber` or `AnimatedNumber`), tab indicator (`trackIndicator`), list reorder after sort/filter (`reorder`), toast and notification stack, accordion and card resize. No scroll reveals, no entrance animations on load, no loops, no GSAP.

## Check

Run `npx ux-sting qa` (the `ux-sting-qa` loop). Then look at the 1440 screenshot and ask: can you find the most important number in one second, and is anything colored that isn't data or the primary action?
