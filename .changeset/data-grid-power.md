---
"@ux-sting/react": minor
---

DataTable / DataGrid become a full data grid:

- **Multi-column sort**: `multiSort` + Shift+click, controlled via `sortBy` / `defaultSortBy` / `onSortByChange` (the `sort` API still works). Sort priority is shown and announced; `aria-sort` stays on the primary column.
- **Virtualization**: `virtual={{ rowHeight, height }}` renders only visible rows (10k+), with `aria-rowcount` / `aria-rowindex`, and grid navigation scrolls the target into view.
- **Resizable columns**: `resizableColumns` adds focusable separators (drag, Arrow keys, Shift ×5, Home/End, RTL-aware); per-column `width` / `minWidth` / `maxWidth` / `resizable`, plus `onColumnWidthsChange`.
- **Expandable rows**: `renderRowDetail` plus `expandedIds` / `defaultExpandedIds` / `onExpandedIdsChange`.
- **Range selection**: Shift+click a row checkbox to select from the last clicked row.
- **Grid keyboard model**: one Tab stop (roving tabindex), Ctrl+Home/End, PageUp/PageDown, and no arrow-key hijacking while typing in cell inputs.
- Fixes: `getRowId` now receives the index in `data` (it was the index within the page); `aria-rowcount` includes the header row.
- Table: `containerProps` / `containerRef`; TableHead `adornment` slot, and `onSort` receives the click event.
- New messages: `sortPriority`, `resizeColumn` (en/fr/ar).
