"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useChartFormat } from "./chart-core.js";
import { slotColor, type ChartSlot } from "./chart-utils.js";

export interface BarListItem {
  /** Stable key; defaults to `name` when it is a string. */
  key?: string;
  name: ReactNode;
  value: number;
  /** Makes the name a link. */
  href?: string;
  /** Overrides the list's slot for this row (e.g. highlight the home market). */
  colorSlot?: ChartSlot;
  /** Secondary text under the name. */
  description?: ReactNode;
}

export interface BarListProps extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
  data: BarListItem[];
  /** Accessible name for the list. */
  label: string;
  valueFormatter?: (value: number) => string;
  /** Categorical slot for every bar (default 1). */
  colorSlot?: ChartSlot;
  /** Value that fills the track; defaults to the largest value. */
  max?: number;
  /** `"desc"` sorts by value (default); `"none"` keeps the given order. */
  sortOrder?: "desc" | "none";
  /** Show only the first N rows. */
  limit?: number;
  /** Adds each row's share of the total next to its value. */
  showShare?: boolean;
}

/**
 * Ranked horizontal bars (top pages, countries, sources): name, a thin bar
 * square at the start with a 4px rounded data end, and the value at the end.
 * Values are always printed, so no hover is needed and nothing is
 * color-only.
 */
export const BarList = forwardRef<HTMLUListElement, BarListProps>(function BarList(
  {
    data,
    label,
    valueFormatter,
    colorSlot = 1,
    max,
    sortOrder = "desc",
    limit,
    showShare = false,
    className,
    ...props
  },
  ref,
) {
  const fmt = useChartFormat(valueFormatter);
  const rows = (sortOrder === "desc" ? [...data].sort((a, b) => b.value - a.value) : data).slice(
    0,
    limit,
  );
  const top = max ?? Math.max(0, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ul ref={ref} aria-label={label} className={cn("grid gap-2.5", className)} {...props}>
      {rows.map((row, i) => {
        const pct = top > 0 ? Math.max(0, Math.min(1, row.value / top)) : 0;
        return (
          <li key={row.key ?? (typeof row.name === "string" ? row.name : i)} className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-foreground">
                {row.href ? (
                  <a href={row.href} className="hover:underline">
                    {row.name}
                  </a>
                ) : (
                  row.name
                )}
                {row.description ? (
                  <span className="ms-2 text-xs text-muted-foreground">{row.description}</span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                <span className="font-medium text-foreground">{fmt.value(row.value)}</span>
                {showShare && total > 0 ? (
                  <span className="ms-1.5 text-xs">{((row.value / total) * 100).toFixed(1)}%</span>
                ) : null}
              </span>
            </div>
            <div aria-hidden className="h-1.5">
              <div
                className="h-full rounded-e-[4px]"
                style={{
                  width: `${Math.max(pct * 100, row.value > 0 ? 0.75 : 0)}%`,
                  background: slotColor(row.colorSlot ?? colorSlot, 0),
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
});
