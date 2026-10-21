"use client";
import { cn } from "@ux-sting/utils";
import type { ReactNode } from "react";
import { useLocale, useMessages } from "../../provider/context.js";
import { FilterChips, FilterPanel, type FilterChip } from "../filter-panel/filter-panel.js";

export interface ProductListingProps {
  /** Page heading, e.g. the category name. Rendered as the page's `h1`. */
  title: ReactNode;
  /** Short intro under the title. */
  description?: ReactNode;
  /** Breadcrumb above the title. */
  breadcrumb?: ReactNode;
  /** Total number of products for the current filters. Announced politely when it changes. */
  resultCount: number;
  /** FilterSection elements (categories, price, size, color…). */
  filters: ReactNode;
  /** Applied filters, shown as removable chips above the grid. */
  activeFilters?: FilterChip[];
  onRemoveFilter?: (id: string) => void;
  onClearFilters?: () => void;
  /** Sort control (e.g. a labelled NativeSelect), shown at the end of the toolbar. */
  sort?: ReactNode;
  /** The product grid. */
  children: ReactNode;
  /** Pagination under the grid. */
  pagination?: ReactNode;
  filtersTitle?: string;
  className?: string;
}

/**
 * Category page layout: heading and live result count, a filter sidebar
 * (a sheet on mobile, from the same filters), applied-filter chips, a sort
 * control, the product grid and pagination. Composes FilterPanel. Layout
 * adapted from the Storefront UI category page block (MIT).
 */
export function ProductListing({
  title,
  description,
  breadcrumb,
  resultCount,
  filters,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  sort,
  children,
  pagination,
  filtersTitle,
  className,
}: ProductListingProps) {
  const messages = useMessages();
  const { locale } = useLocale();
  const countText = messages
    .results(resultCount)
    .replace(String(resultCount), new Intl.NumberFormat(locale).format(resultCount));
  return (
    <div className={cn("grid gap-6", className)}>
      <header className="grid gap-2">
        {breadcrumb}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-prose text-md text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
        <FilterPanel
          title={filtersTitle}
          activeCount={activeFilters.length}
          onClear={onClearFilters}
        >
          {filters}
        </FilterPanel>
        <div className="grid min-w-0 content-start gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
              {countText}
            </p>
            {sort}
          </div>
          {onRemoveFilter ? (
            <FilterChips
              filters={activeFilters}
              onRemove={onRemoveFilter}
              onClearAll={onClearFilters}
            />
          ) : null}
          {children}
          {pagination ? <div className="pt-4">{pagination}</div> : null}
        </div>
      </div>
    </div>
  );
}
