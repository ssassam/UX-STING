# DataTable

> Data display · `@ux-sting/react/data-table`

Sorting (Shift+click multi-sort), search, filtering, pagination or 10k+ row virtualization, row selection with Shift+click ranges and bulk actions, expandable rows, resizable and hideable columns, loading and empty states. DataGrid adds a single Tab stop with arrow/Home/End/PageUp/PageDown cell navigation.

## When to use

Use for admin lists and dashboards; `manual` mode for server-side data.

**Consider alternatives:** For very large datasets (10k+ rows) add virtualization or server paging.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { DataTable, DataGrid } from "@ux-sting/react/data-table";
```

Or copy the source into your project and own it:

```bash
npx ux-sting add data-table
```

## Accessibility

- Selection checkboxes are labelled; bulk-action bar is a status region; DataGrid supports arrow-key cell navigation.

### Keyboard

| Keys | Action |
| --- | --- |
| ← → ↑ ↓ (DataGrid) | Move between cells |

## API

### DataTable

Feature-complete data table: search, single or multi-column sort, filter, pagination or row virtualization, row selection (Shift+click for ranges) with bulk actions, expandable rows, resizable and hideable columns, loading and empty states, responsive stacking. Works client-side or in `manual` (server) mode. With `grid`, it is one Tab stop with arrow-key cell navigation.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` * | `DataTableColumn<T>[]` | — |  |
| `data` * | `T[]` | — |  |
| `getRowId` * | `(row: T, index: number) => string` | — | Stable row id. |
| `label` * | `string` | — | Accessible table caption/label. |
| `bulkActions` | `(selectedIds: string[], clear: () => void) => ReactNode` | — | Rendered in the toolbar while rows are selected. |
| `className` | `string` | — |  |
| `columnToggle` | `boolean` | — | Show the column visibility menu. |
| `defaultExpandedIds` | `string[]` | `[]` |  |
| `defaultSort` | `SortState \| null` | `null` |  |
| `defaultSortBy` | `SortState[]` | — |  |
| `empty` | `ReactNode` | — |  |
| `expandedIds` | `string[]` | — |  |
| `filter` | `(row: T) => boolean` | — | Additional predicate filter (e.g. from a FilterPanel). |
| `grid` | `boolean` | — | Enables grid keyboard navigation (arrow keys between cells). |
| `loading` | `boolean` | — |  |
| `manual` | `boolean` | — | Server-side mode: data is already filtered/sorted/paged. |
| `multiSort` | `boolean` | — | Shift+click a header to add secondary sorts. |
| `onColumnWidthsChange` | `(widths: Record<string, number>) => void` | — |  |
| `onExpandedIdsChange` | `(ids: string[]) => void` | — |  |
| `onPageChange` | `(page: number) => void` | — |  |
| `onRowClick` | `(row: T) => void` | — |  |
| `onSelectedIdsChange` | `(ids: string[]) => void` | — |  |
| `onSortByChange` | `(sortBy: SortState[]) => void` | — |  |
| `onSortChange` | `(sort: SortState \| null) => void` | — |  |
| `page` | `number` | — |  |
| `pageSize` | `number \| false` | `10` | Rows per page; `false` disables pagination. |
| `pageSizeOptions` | `number[]` | `[10, 25, 50]` |  |
| `renderRowDetail` | `(row: T) => ReactNode` | — | Expandable detail panel under each row. |
| `resizableColumns` | `boolean` | — | Drag or arrow-key resizable column widths. |
| `responsive` | `"scroll" \| "stack"` | `"scroll"` |  |
| `searchable` | `boolean` | — | Show a global search box. |
| `searchPlaceholder` | `string` | — |  |
| `selectable` | `boolean` | — | Enables row checkboxes. |
| `selectedIds` | `string[]` | — |  |
| `sort` | `SortState \| null` | — |  |
| `sortBy` | `SortState[]` | — | Controlled multi-column sort (first entry is the primary sort). |
| `stickyHeader` | `boolean` | — |  |
| `striped` | `boolean` | — |  |
| `toolbar` | `ReactNode` | — | Toolbar content (filters, export button). |
| `totalRows` | `number` | — | Total rows for server-side pagination. |
| `virtual` | `{ rowHeight: number; height: number \| string; overscan?: number }` | — | Render only the rows in view. Rows must have a fixed height. Disables pagination; ignored with `renderRowDetail` and `responsive="stack"`. |

### DataGrid

DataTable with grid semantics and arrow-key cell navigation (spreadsheet-like).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` * | `DataTableColumn<T>[]` | — |  |
| `data` * | `T[]` | — |  |
| `getRowId` * | `(row: T, index: number) => string` | — | Stable row id. |
| `label` * | `string` | — | Accessible table caption/label. |
| `bulkActions` | `(selectedIds: string[], clear: () => void) => ReactNode` | — | Rendered in the toolbar while rows are selected. |
| `className` | `string` | — |  |
| `columnToggle` | `boolean` | — | Show the column visibility menu. |
| `defaultExpandedIds` | `string[]` | — |  |
| `defaultSort` | `SortState \| null` | — |  |
| `defaultSortBy` | `SortState[]` | — |  |
| `empty` | `ReactNode` | — |  |
| `expandedIds` | `string[]` | — |  |
| `filter` | `(row: T) => boolean` | — | Additional predicate filter (e.g. from a FilterPanel). |
| `loading` | `boolean` | — |  |
| `manual` | `boolean` | — | Server-side mode: data is already filtered/sorted/paged. |
| `multiSort` | `boolean` | — | Shift+click a header to add secondary sorts. |
| `onColumnWidthsChange` | `(widths: Record<string, number>) => void` | — |  |
| `onExpandedIdsChange` | `(ids: string[]) => void` | — |  |
| `onPageChange` | `(page: number) => void` | — |  |
| `onRowClick` | `(row: T) => void` | — |  |
| `onSelectedIdsChange` | `(ids: string[]) => void` | — |  |
| `onSortByChange` | `(sortBy: SortState[]) => void` | — |  |
| `onSortChange` | `(sort: SortState \| null) => void` | — |  |
| `page` | `number` | — |  |
| `pageSize` | `number \| false` | — | Rows per page; `false` disables pagination. |
| `pageSizeOptions` | `number[]` | — |  |
| `renderRowDetail` | `(row: T) => ReactNode` | — | Expandable detail panel under each row. |
| `resizableColumns` | `boolean` | — | Drag or arrow-key resizable column widths. |
| `responsive` | `"scroll" \| "stack"` | — |  |
| `searchable` | `boolean` | — | Show a global search box. |
| `searchPlaceholder` | `string` | — |  |
| `selectable` | `boolean` | — | Enables row checkboxes. |
| `selectedIds` | `string[]` | — |  |
| `sort` | `SortState \| null` | — |  |
| `sortBy` | `SortState[]` | — | Controlled multi-column sort (first entry is the primary sort). |
| `stickyHeader` | `boolean` | — |  |
| `striped` | `boolean` | — |  |
| `toolbar` | `ReactNode` | — | Toolbar content (filters, export button). |
| `totalRows` | `number` | — | Total rows for server-side pagination. |
| `virtual` | `{ rowHeight: number; height: number \| string; overscan?: number }` | — | Render only the rows in view. Rows must have a fixed height. Disables pagination; ignored with `renderRowDetail` and `responsive="stack"`. |

---

Full documentation with live examples: `apps/docs` → `/components/data-table`. This file is generated by `pnpm readmes`.
