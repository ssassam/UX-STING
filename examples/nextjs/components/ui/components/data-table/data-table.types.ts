import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Property key or function returning the raw value (used for sort/filter). */
  accessor?: keyof T | ((row: T) => unknown);
  /** Custom cell renderer. */
  cell?: (row: T, value: unknown) => ReactNode;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  align?: "start" | "center" | "end";
  /** Can be hidden from the columns menu. Defaults to true. */
  hideable?: boolean;
  hidden?: boolean;
  /** Included in the global search. Defaults to true for string/number values. */
  searchable?: boolean;
  className?: string;
  /** Label for stacked (mobile) layout; defaults to `header` when it is a string. */
  mobileLabel?: string;
}

export interface SortState {
  id: string;
  direction: "asc" | "desc";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable row id. */
  getRowId: (row: T, index: number) => string;
  /** Accessible table caption/label. */
  label: string;
  /** Enables row checkboxes. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** Rendered in the toolbar while rows are selected. */
  bulkActions?: (selectedIds: string[], clear: () => void) => ReactNode;
  /** Show a global search box. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Additional predicate filter (e.g. from a FilterPanel). */
  filter?: (row: T) => boolean;
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Rows per page; `false` disables pagination. */
  pageSize?: number | false;
  pageSizeOptions?: number[];
  /** Server-side mode: data is already filtered/sorted/paged. */
  manual?: boolean;
  /** Total rows for server-side pagination. */
  totalRows?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  /** Toolbar content (filters, export button). */
  toolbar?: ReactNode;
  /** Show the column visibility menu. */
  columnToggle?: boolean;
  onRowClick?: (row: T) => void;
  responsive?: "scroll" | "stack";
  stickyHeader?: boolean;
  striped?: boolean;
  className?: string;
  /** Enables grid keyboard navigation (arrow keys between cells). */
  grid?: boolean;
}
