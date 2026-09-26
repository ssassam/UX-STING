import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Accessible name for the scroll region (required when it can scroll). */
  label?: string;
  /** Zebra rows. */
  striped?: boolean;
  /** Stick the header while scrolling the container. */
  stickyHeader?: boolean;
  /**
   * `stack`: below `md`, rows become cards with inline labels (uses each
   * cell's `data-label`). `scroll` (default): horizontal scrolling.
   */
  responsive?: "scroll" | "stack";
  containerClassName?: string;
}

/** Semantic data table. Density-aware paddings; server component. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { label, striped, stickyHeader, responsive = "scroll", className, containerClassName, ...props },
  ref,
) {
  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      // A labelled scroll container must be keyboard-focusable so it can be scrolled (WCAG 2.1.1).
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={label ? 0 : undefined}
      data-responsive={responsive}
      className={cn(
        "relative w-full overflow-auto rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        stickyHeader && "max-h-[inherit]",
        containerClassName,
      )}
    >
      <table
        ref={ref}
        data-striped={striped ? "" : undefined}
        className={cn(
          "w-full caption-bottom border-collapse text-sm",
          striped && "[&_tbody_tr:nth-child(even)]:bg-surface",
          stickyHeader && "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-background",
          responsive === "stack" &&
            "max-md:block max-md:[&_tbody]:w-full max-md:[&_thead]:sr-only max-md:[&_tbody_tr]:grid max-md:[&_tbody_tr]:gap-1 max-md:[&_tbody_tr]:rounded-lg max-md:[&_tbody_tr]:border max-md:[&_tbody_tr]:border-border max-md:[&_tbody_tr]:p-3 max-md:[&_tbody]:grid max-md:[&_tbody]:gap-3 max-md:[&_td]:flex max-md:[&_td]:justify-between max-md:[&_td]:gap-4 max-md:[&_td]:border-0 max-md:[&_td]:p-0 max-md:[&_td[data-label]]:before:content-[attr(data-label)] max-md:[&_td]:before:font-medium max-md:[&_td]:before:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody(
  { className, ...props },
  ref,
) {
  return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
});

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableFooter(
  { className, ...props },
  ref,
) {
  return <tfoot ref={ref} className={cn("border-t border-border bg-surface font-medium", className)} {...props} />;
});

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }>(function TableRow(
  { selected, className, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      data-selected={selected ? "" : undefined}
      aria-selected={selected}
      className={cn("border-b border-border transition-colors hover:bg-surface data-selected:bg-primary-subtle/60", className)}
      {...props}
    />
  );
});

export type SortDirection = "asc" | "desc" | false;

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** Current sort; renders `aria-sort` and a sort button when `onSort` is set. */
  sortDirection?: SortDirection;
  onSort?: () => void;
  align?: "start" | "center" | "end";
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { sortDirection, onSort, align = "start", className, children, scope = "col", ...props },
  ref,
) {
  const alignClass = align === "end" ? "text-end" : align === "center" ? "text-center" : "text-start";
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={onSort ? (sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none") : undefined}
      className={cn("h-10 whitespace-nowrap px-(--ui-cell-px) align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground", alignClass, className)}
      {...props}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "-mx-1 inline-flex items-center gap-1 rounded-sm px-1 uppercase outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5",
            align === "end" && "flex-row-reverse",
          )}
        >
          {children}
          {sortDirection === "asc" ? <ArrowUpIcon /> : sortDirection === "desc" ? <ArrowDownIcon /> : <ArrowUpDownIcon className="opacity-50" />}
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export const TableCell = forwardRef<HTMLTableCellElement, Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> & { align?: "start" | "center" | "end" }>(
  function TableCell({ align = "start", className, ...props }, ref) {
    return (
      <td
        ref={ref}
        className={cn(
          "px-(--ui-cell-px) py-(--ui-cell-py) align-middle",
          align === "end" ? "text-end tabular-nums" : align === "center" ? "text-center" : "text-start",
          className,
        )}
        {...props}
      />
    );
  },
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption(
  { className, ...props },
  ref,
) {
  return <caption ref={ref} className={cn("mt-3 text-sm text-muted-foreground", className)} {...props} />;
});
