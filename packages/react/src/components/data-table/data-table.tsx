"use client";
import { useControllableState } from "@ux-sting/hooks";
import { ChevronRightIcon } from "@ux-sting/icons";
import { Columns3Icon } from "./columns-icon.js";
import { cn } from "@ux-sting/utils";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLocale, useMessages } from "../../provider/context.js";
import { Button, IconButton } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu.js";
import { Pagination } from "../pagination/pagination.js";
import { SearchInput } from "../search-input/search-input.js";
import { NativeSelect } from "../native-select/native-select.js";
import { Skeleton } from "../skeleton/skeleton.js";
import { EmptyState } from "../state/state.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/table.js";
import type { DataTableColumn, DataTableProps, SortState } from "./data-table.types.js";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function getValue<T>(row: T, column: DataTableColumn<T>): unknown {
  const { accessor } = column;
  if (typeof accessor === "function") return accessor(row);
  if (accessor !== undefined) return row[accessor];
  return (row as Record<string, unknown>)[column.id];
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compare(a: unknown, b: unknown): number {
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return collator.compare(String(a), String(b));
}

const DEFAULT_WIDTH = 160;
const LEADING_WIDTH = 40;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Focusable widget inside a cell (the grid moves focus to it instead of the cell). */
const INNER_FOCUSABLE =
  'button, a[href], input, select, textarea, [tabindex]:not([role="separator"])';

function isTextEntry(el: HTMLElement) {
  if (el.isContentEditable) return true;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  return el instanceof HTMLInputElement && !["checkbox", "radio", "button"].includes(el.type);
}

interface ColumnResizerProps {
  label: string;
  width: number;
  min: number;
  max: number;
  rtl: boolean;
  onResize: (width: number) => void;
}

/** Focusable vertical separator: drag, or ArrowLeft/Right (Shift = ×5), Home/End. */
function ColumnResizer({ label, width, min, max, rtl, onResize }: ColumnResizerProps) {
  const drag = useRef<{ x: number; w: number } | null>(null);
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      data-column-resizer=""
      onKeyDown={(e) => {
        const step = e.shiftKey ? 50 : 10;
        const grow = rtl ? "ArrowLeft" : "ArrowRight";
        const shrink = rtl ? "ArrowRight" : "ArrowLeft";
        let next: number;
        if (e.key === grow) next = width + step;
        else if (e.key === shrink) next = width - step;
        else if (e.key === "Home") next = min;
        else if (e.key === "End") next = max;
        else return;
        e.preventDefault();
        e.stopPropagation();
        onResize(clamp(next, min, max));
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        drag.current = { x: e.clientX, w: width };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = (e.clientX - drag.current.x) * (rtl ? -1 : 1);
        onResize(clamp(drag.current.w + dx, min, max));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-y-2 end-0 w-1.5 cursor-col-resize touch-none rounded-full outline-none hover:bg-border-strong focus-visible:bg-ring"
    />
  );
}

/**
 * Feature-complete data table: search, single or multi-column sort, filter,
 * pagination or row virtualization, row selection (Shift+click for ranges)
 * with bulk actions, expandable rows, resizable and hideable columns, loading
 * and empty states, responsive stacking. Works client-side or in `manual`
 * (server) mode. With `grid`, it is one Tab stop with arrow-key cell navigation.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  label,
  selectable,
  selectedIds: selectedProp,
  onSelectedIdsChange,
  bulkActions,
  searchable,
  searchPlaceholder,
  filter,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  multiSort,
  sortBy: sortByProp,
  defaultSortBy,
  onSortByChange,
  pageSize: pageSizeProp = 10,
  pageSizeOptions = [10, 25, 50],
  manual,
  totalRows,
  page: pageProp,
  onPageChange,
  loading,
  empty,
  toolbar,
  columnToggle,
  onRowClick,
  responsive = "scroll",
  stickyHeader,
  striped,
  className,
  grid,
  resizableColumns,
  onColumnWidthsChange,
  virtual: virtualProp,
  renderRowDetail,
  expandedIds: expandedProp,
  defaultExpandedIds = [],
  onExpandedIdsChange,
}: DataTableProps<T>) {
  const messages = useMessages();
  const { dir } = useLocale();
  const rtl = dir === "rtl";
  const uid = useId().replace(/:/g, "");
  const virtual = renderRowDetail || responsive === "stack" ? undefined : virtualProp;

  const [search, setSearch] = useState("");
  // Multi-sort is the source of truth; `sort` / `onSortChange` stay as the single-sort API.
  const [sorts, setSorts] = useControllableState<SortState[]>({
    value: sortByProp ?? (sortProp !== undefined ? (sortProp ? [sortProp] : []) : undefined),
    defaultValue: defaultSortBy ?? (defaultSort ? [defaultSort] : []),
    onChange: (next) => {
      onSortByChange?.(next);
      onSortChange?.(next[0] ?? null);
    },
  });
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: [],
    onChange: onSelectedIdsChange,
  });
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedIdsChange,
  });
  const [page, setPage] = useControllableState({
    value: pageProp,
    defaultValue: 1,
    onChange: onPageChange,
  });
  const [pageSize, setPageSize] = useState(pageSizeProp || 0);
  const effectivePageSize = virtual ? 0 : pageSize;
  // The initial page size is always selectable, even when it is not a default option.
  const sizeOptions = [...new Set([...pageSizeOptions, pageSizeProp || 0])]
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.hidden).map((c) => c.id)),
  );
  const [widths, setWidths] = useState<Record<string, number>>({});
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorIndex = useRef<number | null>(null);
  const shiftClick = useRef(false);

  const visibleColumns = columns.filter((c) => !hidden.has(c.id));
  const widthOf = (c: DataTableColumn<T>) => widths[c.id] ?? c.width ?? DEFAULT_WIDTH;

  // Ids come from the row's index in `data`, so they are stable across pages, sorts and filters.
  const entries = useMemo(
    () => data.map((row, i) => ({ row, id: getRowId(row, i) })),
    [data, getRowId],
  );

  const processed = useMemo(() => {
    if (manual) return entries;
    let list = filter ? entries.filter((e) => filter(e.row)) : entries;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(({ row }) =>
        columns.some((c) => {
          if (c.searchable === false) return false;
          const v = getValue(row, c);
          return (
            (typeof v === "string" || typeof v === "number") && String(v).toLowerCase().includes(q)
          );
        }),
      );
    }
    const active = sorts
      .map((s) => ({ s, column: columns.find((c) => c.id === s.id) }))
      .filter((x): x is { s: SortState; column: DataTableColumn<T> } => Boolean(x.column));
    if (active.length) {
      list = [...list].sort((a, b) => {
        for (const { s, column } of active) {
          const d = column.sortFn
            ? column.sortFn(a.row, b.row)
            : compare(getValue(a.row, column), getValue(b.row, column));
          if (d !== 0) return s.direction === "asc" ? d : -d;
        }
        return 0;
      });
    }
    return list;
  }, [entries, columns, filter, search, sorts, manual]);

  const total = manual ? (totalRows ?? data.length) : processed.length;
  const totalPages = effectivePageSize ? Math.max(1, Math.ceil(total / effectivePageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const pageOffset = manual || !effectivePageSize ? 0 : (currentPage - 1) * effectivePageSize;
  const pageRows =
    manual || !effectivePageSize
      ? processed
      : processed.slice(pageOffset, pageOffset + effectivePageSize);
  const pageIds = pageRows.map((e) => e.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someSelected = pageIds.some((id) => selected.includes(id));

  // ---- virtualization -------------------------------------------------------
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(() =>
    typeof virtualProp?.height === "number" ? virtualProp.height : 400,
  );
  useIsoLayoutEffect(() => {
    const el = scrollRef.current;
    if (!virtual || !el) return;
    const measure = () => el.clientHeight > 0 && setViewport(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [Boolean(virtual)]);
  const overscan = virtual?.overscan ?? 6;
  const windowStart = virtual
    ? Math.max(0, Math.floor(scrollTop / virtual.rowHeight) - overscan)
    : 0;
  const windowEnd = virtual
    ? Math.min(pageRows.length, Math.ceil((scrollTop + viewport) / virtual.rowHeight) + overscan)
    : pageRows.length;
  const rendered = pageRows.slice(windowStart, windowEnd);

  // ---- grid focus (roving tabindex) ------------------------------------------
  const leading = (renderRowDetail ? 1 : 0) + (selectable ? 1 : 0);
  const colCount = leading + visibleColumns.length;
  const [active, setActive] = useState({ r: 1, c: 0 });
  const pendingFocus = useRef<{ r: number; c: number } | null>(null);
  const activeR = Math.min(active.r, pageRows.length);
  const activeC = Math.min(active.c, Math.max(0, colCount - 1));
  const activeRendered = activeR === 0 || (activeR - 1 >= windowStart && activeR - 1 < windowEnd);
  const cellTabIndex = (r: number, c: number) => {
    if (!grid) return undefined;
    if (r === activeR && c === activeC) return 0;
    // When the active row is scrolled out of the DOM, keep the grid reachable via its header.
    if (!activeRendered && r === 0 && c === activeC) return 0;
    return -1;
  };
  const gridCellProps = (r: number, c: number) =>
    grid ? { "data-r": r, "data-c": c, tabIndex: cellTabIndex(r, c) } : {};

  const focusCell = useCallback((r: number, c: number) => {
    const cell = tableRef.current?.querySelector<HTMLElement>(`[data-r="${r}"][data-c="${c}"]`);
    if (!cell) return false;
    (cell.querySelector<HTMLElement>(INNER_FOCUSABLE) ?? cell).focus();
    return true;
  }, []);

  useIsoLayoutEffect(() => {
    const target = pendingFocus.current;
    if (target && focusCell(target.r, target.c)) pendingFocus.current = null;
  });

  const moveTo = (r: number, c: number) => {
    const nr = clamp(r, 0, pageRows.length);
    const nc = clamp(c, 0, colCount - 1);
    const el = scrollRef.current;
    if (virtual && el && nr >= 1) {
      const top = (nr - 1) * virtual.rowHeight;
      const bottom = top + virtual.rowHeight;
      // The sticky header covers roughly one row at the top of the viewport.
      const head = tableRef.current?.tHead?.offsetHeight || virtual.rowHeight;
      let next = el.scrollTop;
      if (top < el.scrollTop) next = top;
      else if (bottom + head > el.scrollTop + viewport) next = bottom + head - viewport;
      if (next !== el.scrollTop) {
        el.scrollTop = next;
        setScrollTop(next);
      }
    }
    setActive({ r: nr, c: nc });
    pendingFocus.current = { r: nr, c: nc };
    if (!focusCell(nr, nc)) return; // focused after the window re-renders
    pendingFocus.current = null;
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (!grid) return;
    const target = e.target as HTMLElement;
    if (isTextEntry(target) || target.dataset.columnResizer !== undefined) return;
    const cell = target.closest<HTMLElement>("[data-r]");
    if (!cell) return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    const pageStep = virtual ? Math.max(1, Math.floor(viewport / virtual.rowHeight) - 1) : 10;
    const ctrl = e.ctrlKey || e.metaKey;
    let next: [number, number];
    if (e.key === "ArrowDown") next = [r + 1, c];
    else if (e.key === "ArrowUp") next = [r - 1, c];
    else if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = [r, c + 1];
    else if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = [r, c - 1];
    else if (e.key === "Home") next = ctrl ? [0, 0] : [r, 0];
    else if (e.key === "End") next = ctrl ? [pageRows.length, colCount - 1] : [r, colCount - 1];
    else if (e.key === "PageDown") next = [r + pageStep, c];
    else if (e.key === "PageUp") next = [Math.max(r === 0 ? 0 : 1, r - pageStep), c];
    else return;
    e.preventDefault();
    moveTo(next[0], next[1]);
  };

  const onGridFocus = (e: FocusEvent<HTMLTableElement>) => {
    if (!grid) return;
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-r]");
    if (!cell) return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    if (r !== active.r || c !== active.c) setActive({ r, c });
  };

  // ---- actions ---------------------------------------------------------------
  const toggleSort = (id: string, additive: boolean) => {
    setPage(1);
    const current = sorts.find((s) => s.id === id);
    const cycled: SortState | null = !current
      ? { id, direction: "asc" }
      : current.direction === "asc"
        ? { id, direction: "desc" }
        : null;
    if (multiSort && additive) {
      setSorts(
        current
          ? sorts.flatMap((s) => (s.id === id ? (cycled ? [cycled] : []) : [s]))
          : [...sorts, cycled!],
      );
    } else {
      setSorts(cycled ? [cycled] : []);
    }
  };

  const toggleRow = (id: string, index: number, checked: boolean) => {
    if (shiftClick.current && anchorIndex.current !== null) {
      const [from, to] = [anchorIndex.current, index].sort((a, b) => a - b) as [number, number];
      const range = pageIds.slice(from, to + 1);
      setSelected(
        checked
          ? Array.from(new Set([...selected, ...range]))
          : selected.filter((s) => !range.includes(s)),
      );
    } else {
      setSelected(checked ? [...selected, id] : selected.filter((s) => s !== id));
    }
    anchorIndex.current = index;
    shiftClick.current = false;
  };

  const resize = (id: string, width: number) => {
    setWidths((prev) => {
      const next = { ...prev, [id]: width };
      onColumnWidthsChange?.(next);
      return next;
    });
  };

  const selectionCount = selected.length;
  const ariaRowCount = pageRows.length < total || virtual ? total + 1 : undefined;

  // ---- body --------------------------------------------------------------------
  let body: ReactNode;
  if (loading) {
    body = Array.from({ length: Math.min(effectivePageSize || 5, 8) }, (_, i) => (
      <TableRow key={`s${i}`}>
        {Array.from({ length: leading }, (_, j) => (
          <TableCell key={`l${j}`} className="w-10">
            <Skeleton className="size-4" />
          </TableCell>
        ))}
        {visibleColumns.map((c) => (
          <TableCell key={c.id}>
            <Skeleton shape="text" className="max-w-40" />
          </TableCell>
        ))}
      </TableRow>
    ));
  } else if (pageRows.length === 0) {
    body = (
      <tr>
        <td colSpan={colCount}>{empty ?? <EmptyState size="sm" title={messages.noResults} />}</td>
      </tr>
    );
  } else {
    const spacer = (height: number, key: string) =>
      height > 0 ? (
        <tr key={key} aria-hidden="true" role="presentation">
          <td colSpan={colCount} style={{ height, padding: 0, border: 0 }} />
        </tr>
      ) : null;
    body = (
      <>
        {virtual ? spacer(windowStart * virtual.rowHeight, "top") : null}
        {rendered.map(({ row, id }, k) => {
          const index = windowStart + k; // index within the page
          const r = index + 1;
          const isSelected = selected.includes(id);
          const isExpanded = Boolean(renderRowDetail) && expanded.includes(id);
          const detailId = `${uid}-detail-${index}`;
          let c = 0;
          return (
            <Fragment key={id}>
              <TableRow
                selected={selectable ? isSelected : undefined}
                aria-rowindex={ariaRowCount ? pageOffset + index + 2 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
                style={virtual ? { height: virtual.rowHeight } : undefined}
              >
                {renderRowDetail ? (
                  <TableCell
                    className="w-10"
                    role={grid ? "gridcell" : undefined}
                    {...gridCellProps(r, c++)}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <IconButton
                      variant="ghost"
                      size="xs"
                      aria-label={isExpanded ? messages.collapse : messages.expand}
                      aria-expanded={isExpanded}
                      aria-controls={isExpanded ? detailId : undefined}
                      onClick={() =>
                        setExpanded(
                          isExpanded ? expanded.filter((x) => x !== id) : [...expanded, id],
                        )
                      }
                    >
                      <ChevronRightIcon
                        className={cn(
                          "transition-transform rtl:-scale-x-100",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </IconButton>
                  </TableCell>
                ) : null}
                {selectable ? (
                  <TableCell
                    className="w-10"
                    role={grid ? "gridcell" : undefined}
                    {...gridCellProps(r, c++)}
                    onClickCapture={(e: MouseEvent) => {
                      shiftClick.current = e.shiftKey;
                    }}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <Checkbox
                      aria-label={messages.selectRow}
                      checked={isSelected}
                      onCheckedChange={(v) => toggleRow(id, index, v === true)}
                    />
                  </TableCell>
                ) : null}
                {visibleColumns.map((col) => {
                  const value = getValue(row, col);
                  return (
                    <TableCell
                      key={col.id}
                      align={col.align}
                      role={grid ? "gridcell" : undefined}
                      {...gridCellProps(r, c++)}
                      data-label={
                        col.mobileLabel ?? (typeof col.header === "string" ? col.header : undefined)
                      }
                      className={cn(virtual && "truncate", col.className)}
                    >
                      {col.cell ? col.cell(row, value) : value == null ? "—" : String(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
              {isExpanded ? (
                <tr id={detailId} className="border-b border-border bg-surface/60">
                  <td
                    colSpan={colCount}
                    role={grid ? "gridcell" : undefined}
                    className="p-(--ui-cell-px)"
                  >
                    {renderRowDetail!(row)}
                  </td>
                </tr>
              ) : null}
            </Fragment>
          );
        })}
        {virtual ? spacer((pageRows.length - windowEnd) * virtual.rowHeight, "bottom") : null}
      </>
    );
  }

  const sized = Boolean(resizableColumns);
  const tableWidth = sized
    ? leading * LEADING_WIDTH + visibleColumns.reduce((sum, c) => sum + widthOf(c), 0)
    : undefined;

  let hc = 0;
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-3", className)}>
      {searchable || toolbar || columnToggle || (bulkActions && selectionCount > 0) ? (
        <div className="flex flex-wrap items-center gap-2">
          {selectionCount > 0 && bulkActions ? (
            <div
              className="flex flex-wrap items-center gap-2 rounded-md bg-primary-subtle px-3 py-1.5 text-sm text-primary-subtle-foreground"
              role="status"
            >
              <span className="font-medium">{messages.selected(selectionCount)}</span>
              {bulkActions(selected, () => setSelected([]))}
            </div>
          ) : searchable ? (
            <SearchInput
              className="w-full sm:max-w-xs"
              size="sm"
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
            />
          ) : null}
          <div className="ms-auto flex flex-wrap items-center gap-2">
            {toolbar}
            {columnToggle ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" startIcon={<Columns3Icon />}>
                    {messages.columns}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{messages.columns}</DropdownMenuLabel>
                  {columns
                    .filter((c) => c.hideable !== false)
                    .map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        checked={!hidden.has(c.id)}
                        onSelect={(e: Event) => e.preventDefault()}
                        onCheckedChange={(v: boolean) =>
                          setHidden((prev) => {
                            const next = new Set(prev);
                            if (v) next.delete(c.id);
                            else next.add(c.id);
                            return next;
                          })
                        }
                      >
                        {c.header}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-border">
        <Table
          ref={tableRef}
          label={label}
          role={grid ? "grid" : undefined}
          aria-busy={loading || undefined}
          aria-rowcount={ariaRowCount}
          aria-colcount={grid ? colCount : undefined}
          responsive={responsive}
          stickyHeader={stickyHeader || Boolean(virtual)}
          striped={striped}
          onKeyDown={onGridKeyDown}
          onFocus={onGridFocus}
          className={cn(sized && "table-fixed")}
          style={sized ? { width: tableWidth, minWidth: "100%" } : undefined}
          containerRef={scrollRef}
          containerProps={
            virtual
              ? {
                  style: { height: virtual.height },
                  onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
                }
              : undefined
          }
        >
          {sized ? (
            <colgroup>
              {Array.from({ length: leading }, (_, i) => (
                <col key={`l${i}`} style={{ width: LEADING_WIDTH }} />
              ))}
              {visibleColumns.map((c) => (
                <col key={c.id} style={{ width: widthOf(c) }} />
              ))}
            </colgroup>
          ) : null}
          <TableHeader>
            <TableRow className="hover:bg-transparent" aria-rowindex={ariaRowCount ? 1 : undefined}>
              {renderRowDetail ? (
                <TableHead className="w-10" {...gridCellProps(0, hc++)}>
                  <span className="sr-only">{messages.expand}</span>
                </TableHead>
              ) : null}
              {selectable ? (
                <TableHead className="w-10" {...gridCellProps(0, hc++)}>
                  <Checkbox
                    aria-label={messages.selectAll}
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(v) =>
                      setSelected(
                        v === true
                          ? Array.from(new Set([...selected, ...pageIds]))
                          : selected.filter((s) => !pageIds.includes(s)),
                      )
                    }
                  />
                </TableHead>
              ) : null}
              {visibleColumns.map((c) => {
                const priority = sorts.findIndex((s) => s.id === c.id);
                const sortState = priority >= 0 ? sorts[priority]! : null;
                const headerText = typeof c.header === "string" ? c.header : c.id;
                return (
                  <TableHead
                    key={c.id}
                    align={c.align}
                    {...gridCellProps(0, hc++)}
                    sortDirection={sortState ? sortState.direction : false}
                    // aria-sort belongs on the primary sort column only.
                    {...(priority > 0 ? { "aria-sort": undefined } : {})}
                    onSort={c.sortable ? (e) => toggleSort(c.id, e.shiftKey) : undefined}
                    adornment={
                      sized && c.resizable !== false ? (
                        <ColumnResizer
                          label={messages.resizeColumn(headerText)}
                          width={widthOf(c)}
                          min={c.minWidth ?? 60}
                          max={c.maxWidth ?? 800}
                          rtl={rtl}
                          onResize={(w) => resize(c.id, w)}
                        />
                      ) : undefined
                    }
                  >
                    {c.header}
                    {sorts.length > 1 && priority >= 0 ? (
                      <>
                        <span aria-hidden className="text-[0.625rem] tabular-nums">
                          {priority + 1}
                        </span>
                        <span className="sr-only">, {messages.sortPriority(priority + 1)}</span>
                      </>
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>{body}</TableBody>
        </Table>
      </div>

      {effectivePageSize && total > 0 ? (
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            {messages.rowsPerPage}
            <NativeSelect
              size="sm"
              className="w-20"
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {sizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </NativeSelect>
          </label>
          <Pagination totalPages={totalPages} page={currentPage} onPageChange={setPage} size="sm" />
        </div>
      ) : null}
    </div>
  );
}

/** DataTable with grid semantics and arrow-key cell navigation (spreadsheet-like). */
export function DataGrid<T>(props: Omit<DataTableProps<T>, "grid">) {
  return <DataTable {...props} grid />;
}
