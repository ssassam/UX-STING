"use client";
import { useControllableState } from "@unified-ui/hooks";
import { Columns3Icon } from "./columns-icon.js";
import { cn } from "@unified-ui/utils";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import { Button } from "../button/button.js";
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

/**
 * Feature-complete data table: search, sort, filter, pagination, row
 * selection with bulk actions, column visibility, loading and empty states,
 * responsive stacking. Works client-side or in `manual` (server) mode.
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
}: DataTableProps<T>) {
  const messages = useMessages();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useControllableState<SortState | null>({ value: sortProp, defaultValue: defaultSort, onChange: onSortChange });
  const [selected, setSelected] = useControllableState<string[]>({ value: selectedProp, defaultValue: [], onChange: onSelectedIdsChange });
  const [page, setPage] = useControllableState({ value: pageProp, defaultValue: 1, onChange: onPageChange });
  const [pageSize, setPageSize] = useState(pageSizeProp || 0);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.hidden).map((c) => c.id)));
  const tableRef = useRef<HTMLTableElement>(null);

  const visibleColumns = columns.filter((c) => !hidden.has(c.id));

  const processed = useMemo(() => {
    if (manual) return data;
    let rows = filter ? data.filter(filter) : data;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((row) =>
        columns.some((c) => {
          if (c.searchable === false) return false;
          const v = getValue(row, c);
          return (typeof v === "string" || typeof v === "number") && String(v).toLowerCase().includes(q);
        }),
      );
    }
    if (sort) {
      const column = columns.find((c) => c.id === sort.id);
      if (column) {
        const dir = sort.direction === "asc" ? 1 : -1;
        rows = [...rows].sort((a, b) => dir * (column.sortFn ? column.sortFn(a, b) : compare(getValue(a, column), getValue(b, column))));
      }
    }
    return rows;
  }, [data, columns, filter, search, sort, manual]);

  const total = manual ? (totalRows ?? data.length) : processed.length;
  const totalPages = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const rows = manual || !pageSize ? processed : processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rowIds = rows.map((r, i) => getRowId(r, i));
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.includes(id));
  const someSelected = rowIds.some((id) => selected.includes(id));

  const toggleSort = (id: string) => {
    setPage(1);
    setSort(!sort || sort.id !== id ? { id, direction: "asc" } : sort.direction === "asc" ? { id, direction: "desc" } : null);
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (!grid) return;
    const cell = (e.target as HTMLElement).closest("td,th") as HTMLTableCellElement | null;
    if (!cell) return;
    const row = cell.parentElement as HTMLTableRowElement;
    const table = tableRef.current;
    if (!table) return;
    const allRows = Array.from(table.rows);
    let r = allRows.indexOf(row);
    let c = cell.cellIndex;
    const rtl = getComputedStyle(table).direction === "rtl";
    if (e.key === "ArrowDown") r++;
    else if (e.key === "ArrowUp") r--;
    else if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) c++;
    else if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) c--;
    else if (e.key === "Home") c = 0;
    else if (e.key === "End") c = row.cells.length - 1;
    else return;
    const target = allRows[r]?.cells[Math.max(0, c)];
    if (!target) return;
    e.preventDefault();
    const focusable = target.querySelector<HTMLElement>("button, a, input, [tabindex]");
    (focusable ?? target).focus();
  };

  const selectionCount = selected.length;
  const colSpan = visibleColumns.length + (selectable ? 1 : 0);

  let body: ReactNode;
  if (loading) {
    body = Array.from({ length: Math.min(pageSize || 5, 8) }, (_, i) => (
      <TableRow key={`s${i}`}>
        {selectable ? <TableCell className="w-10"><Skeleton className="size-4" /></TableCell> : null}
        {visibleColumns.map((c) => (
          <TableCell key={c.id}>
            <Skeleton shape="text" className="max-w-40" />
          </TableCell>
        ))}
      </TableRow>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td colSpan={colSpan}>
          {empty ?? <EmptyState size="sm" title={messages.noResults} />}
        </td>
      </tr>
    );
  } else {
    body = rows.map((row, i) => {
      const id = rowIds[i]!;
      const isSelected = selected.includes(id);
      return (
        <TableRow
          key={id}
          selected={selectable ? isSelected : undefined}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          className={cn(onRowClick && "cursor-pointer")}
        >
          {selectable ? (
            <TableCell className="w-10" role={grid ? "gridcell" : undefined} onClick={(e) => e.stopPropagation()}>
              <Checkbox
                aria-label={messages.selectRow}
                checked={isSelected}
                onCheckedChange={(v) => setSelected(v === true ? [...selected, id] : selected.filter((s) => s !== id))}
              />
            </TableCell>
          ) : null}
          {visibleColumns.map((c) => {
            const value = getValue(row, c);
            return (
              <TableCell
                key={c.id}
                align={c.align}
                tabIndex={grid ? -1 : undefined}
                role={grid ? "gridcell" : undefined}
                data-label={c.mobileLabel ?? (typeof c.header === "string" ? c.header : undefined)}
                className={c.className}
              >
                {c.cell ? c.cell(row, value) : value == null ? "—" : String(value)}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  }

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-3", className)}>
      {searchable || toolbar || columnToggle || (bulkActions && selectionCount > 0) ? (
        <div className="flex flex-wrap items-center gap-2">
          {selectionCount > 0 && bulkActions ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-primary-subtle px-3 py-1.5 text-sm text-primary-subtle-foreground" role="status">
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
          aria-rowcount={manual ? total : undefined}
          responsive={responsive}
          stickyHeader={stickyHeader}
          striped={striped}
          onKeyDown={onGridKeyDown}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {selectable ? (
                <TableHead className="w-10">
                  <Checkbox
                    aria-label={messages.selectAll}
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(v) =>
                      setSelected(v === true ? Array.from(new Set([...selected, ...rowIds])) : selected.filter((s) => !rowIds.includes(s)))
                    }
                  />
                </TableHead>
              ) : null}
              {visibleColumns.map((c) => (
                <TableHead
                  key={c.id}
                  align={c.align}
                  tabIndex={grid ? -1 : undefined}
                  sortDirection={sort?.id === c.id ? sort.direction : false}
                  onSort={c.sortable ? () => toggleSort(c.id) : undefined}
                >
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{body}</TableBody>
        </Table>
      </div>

      {pageSize && total > 0 ? (
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
              {pageSizeOptions.map((n) => (
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
