# Chart

> Data display · `@ux-sting/react/chart`

Dependency-free SVG charts on the --ui-chart-1…8 categorical palette: LineChart/AreaChart (crosshair tooltip over every series), BarChart (side-by-side or stacked columns), BarList (ranked horizontal bars), DonutChart, Sparkline and ChartMetrics (Search Console-style metric picker).

## When to use

Use LineChart/AreaChart for change over time, BarChart for magnitude by period or category, BarList for top-N rankings, DonutChart for a few parts of a whole and Sparkline inside stat tiles. Put ChartMetrics above a chart to switch the plotted metric.

**Consider alternatives:** Never plot two measures on two y axes: switch metrics with ChartMetrics or use two charts. Do not cycle colors past eight series; fold the rest into "Other" (colorSlot: "muted").

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { ChartLegend, ChartTooltip, ChartTable } from "@ux-sting/react/chart";
```

Or copy the source into your project and own it:

```bash
npx ux-sting add chart
```

## Accessibility

- Every chart renders a visually hidden data table; values are also in the legend, labels or tooltip, never color alone.
- Line and bar charts are focusable: arrow keys, Home and End walk the points and the current values are announced in a live region.
- ChartMetrics is a radio group with roving focus.

## API

### ChartLegend

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` * | `{ label: string; color: string }[]` | — |  |
| `mark` * | `"line" \| "square"` | — |  |
| `className` | `string` | — |  |

### ChartTooltip

Tooltip card. Values lead (strong, foreground) and series names follow (muted), each row keyed by a short stroke of the series color.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` * | `{ label: string; value: string; color: string }[]` | — |  |
| `title` * | `ReactNode` | — |  |
| `mark` | `"line" \| "square"` | `"line"` |  |
| `style` | `React.CSSProperties` | — |  |

### ChartTable

Visually hidden data table: the non-visual (and copyable) view of a chart.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` * | `string` | — |  |
| `head` * | `string[]` | — |  |
| `rows` * | `string[][]` | — |  |

### LineChart

Line chart for change over time: 2px lines on one y axis, hairline grid, a crosshair that snaps to the nearest x with one tooltip for every series, arrow-key navigation, and a visually hidden data table. Up to eight series in the categorical chart colors; never two y scales. Set `area` for a wash under the lines (an area chart).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `T[]` | — |  |
| `index` * | `Extract<keyof T, string>` | — | Field holding each datum's x value (a date string, a label…). |
| `label` * | `string` | — | Accessible name: what the chart shows, e.g. "Clicks per day". |
| `series` * | `ChartSeries<T>[]` | — |  |
| `area` | `boolean` | — | Adds a ~10% wash under each line. |
| `empty` | `ReactNode` | — | Shown instead of the plot when `data` is empty. |
| `height` | `number` | — | Plot height in px (legend excluded). |
| `indexFormatter` | `(value: T[Extract<keyof T, string>]) => string` | — | Formats x values for ticks, tooltip titles and the table. |
| `ref` | `Ref<HTMLDivElement>` | — |  |
| `reversed` | `boolean` | — | Draw the y axis upside down (rank / position charts: 1 at the top). |
| `showLegend` | `boolean` | — | Legend above the plot; defaults to on for two or more series. |
| `valueFormatter` | `(value: number) => string` | — |  |
| `zeroBaseline` | `boolean` | — | Start the y axis at zero (default) or fit it to the data. |

_Also accepts 277 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### AreaChart

`LineChart` with `area` on.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `T[]` | — |  |
| `index` * | `Extract<keyof T, string>` | — | Field holding each datum's x value (a date string, a label…). |
| `label` * | `string` | — | Accessible name: what the chart shows, e.g. "Clicks per day". |
| `series` * | `ChartSeries<T>[]` | — |  |
| `area` | `boolean` | — | Adds a ~10% wash under each line. |
| `empty` | `ReactNode` | — | Shown instead of the plot when `data` is empty. |
| `height` | `number` | — | Plot height in px (legend excluded). |
| `indexFormatter` | `(value: T[Extract<keyof T, string>]) => string` | — | Formats x values for ticks, tooltip titles and the table. |
| `ref` | `Ref<HTMLDivElement>` | — |  |
| `reversed` | `boolean` | — | Draw the y axis upside down (rank / position charts: 1 at the top). |
| `showLegend` | `boolean` | — | Legend above the plot; defaults to on for two or more series. |
| `valueFormatter` | `(value: number) => string` | — |  |
| `zeroBaseline` | `boolean` | — | Start the y axis at zero (default) or fit it to the data. |

_Also accepts 277 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### BarChart

Column chart for magnitude by category or period: ≤24px columns grown from one baseline with a 4px rounded data end, side-by-side or `stacked` series separated by a 2px surface gap, a per-column hover/focus tooltip and a visually hidden data table.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `T[]` | — |  |
| `index` * | `Extract<keyof T, string>` | — | Field holding each column's category / date. |
| `label` * | `string` | — | Accessible name: what the chart shows. |
| `series` * | `ChartSeries<T>[]` | — |  |
| `empty` | `ReactNode` | — |  |
| `height` | `number` | — |  |
| `indexFormatter` | `(value: T[Extract<keyof T, string>]) => string` | — |  |
| `ref` | `Ref<HTMLDivElement>` | — |  |
| `showLegend` | `boolean` | — |  |
| `showValues` | `boolean` | — | Print each column's value on its cap (single, unstacked series only). |
| `stacked` | `boolean` | — | Stack series in one column (parts of a whole) instead of side by side. |
| `valueFormatter` | `(value: number) => string` | — |  |

_Also accepts 277 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### BarList

Ranked horizontal bars (top pages, countries, sources): name, a thin bar square at the start with a 4px rounded data end, and the value at the end. Values are always printed, so no hover is needed and nothing is color-only.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `BarListItem[]` | — |  |
| `label` * | `string` | — | Accessible name for the list. |
| `colorSlot` | `ChartSlot` | `1` | Categorical slot for every bar (default 1). |
| `limit` | `number` | — | Show only the first N rows. |
| `max` | `number` | — | Value that fills the track; defaults to the largest value. |
| `showShare` | `boolean` | `false` | Adds each row's share of the total next to its value. |
| `sortOrder` | `"desc" \| "none"` | `"desc"` | `"desc"` sorts by value (default); `"none"` keeps the given order. |
| `valueFormatter` | `(value: number) => string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DonutChart

Parts of a whole, for a handful of categories (≤ 5 reads best; fold the rest into "Other"). Slices are split by a 2px surface gap, and a legend with values and shares sits beside the ring, so identity never relies on color alone.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `DonutChartItem[]` | — |  |
| `label` * | `string` | — | Accessible name, e.g. "Sessions by device". |
| `center` | `ReactNode` | — | Text in the hole; defaults to the formatted total. |
| `centerLabel` | `ReactNode` | — | Small caption under the center value. |
| `size` | `number` | `128` | Diameter in px. |
| `valueFormatter` | `(value: number) => string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### Sparkline

Word-sized trend line for stat tiles and table cells. No axes and no hover: pair it with the figure it summarizes. Scales to its box (set the size with `className`, default 100% × 32px).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` * | `number[]` | — |  |
| `label` * | `string` | — | Accessible name, e.g. "Clicks, last 28 days". |
| `area` | `boolean` | `true` | Adds a ~10% wash under the line. |
| `colorSlot` | `ChartSlot` | `1` | Categorical slot, or `"muted"` for the de-emphasis ink (default 1). |
| `showEnd` | `boolean` | `true` | Marks the latest value with a dot. |

_Also accepts 487 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ChartMetrics

Row of metric tiles that picks what the chart below plots (the Search Console pattern). Exactly one metric is plotted at a time, so the chart keeps one y axis. A radio group: arrow keys move and select; the selected tile carries the series color as a top rule, and its figure and delta stay in text colors.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` * | `string` | — | Accessible name for the picker, e.g. "Metric". |
| `metrics` * | `ChartMetric[]` | — |  |
| `defaultValue` | `string` | — |  |
| `onValueChange` | `(key: string) => void` | — |  |
| `value` | `string` | — |  |

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

---

Full documentation with live examples: `apps/docs` → `/components/chart`. This file is generated by `pnpm readmes`.
