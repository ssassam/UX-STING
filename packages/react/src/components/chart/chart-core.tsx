"use client";
import { useIsomorphicLayoutEffect } from "@ux-sting/hooks";
import { cn, formatCompact, formatNumber } from "@ux-sting/utils";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { useLocale } from "../../provider/context.js";
import type { ChartSeries } from "./chart-utils.js";

export type { ChartSeries };

/*
 * Client pieces shared by the chart family: number formats from the
 * provider locale, width measurement, the legend, the tooltip card, the
 * screen-reader table and keyboard focus. Pure helpers live in chart-utils.
 */

export function useChartFormat(valueFormatter?: (value: number) => string) {
  const { locale } = useLocale();
  return {
    value: valueFormatter ?? ((v: number) => formatNumber(v, locale, { maximumFractionDigits: 2 })),
    tick: valueFormatter ?? ((v: number) => formatCompact(v, locale)),
  };
}

/** Width of the element, measured after layout and on every resize. */
export function useElementWidth<E extends HTMLElement>() {
  const ref = useRef<E>(null);
  const [width, setWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function ChartLegend({
  items,
  mark,
  className,
}: {
  items: { label: string; color: string }[];
  mark: "line" | "square";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={mark === "line" ? "h-0.5 w-3 rounded-full" : "size-2.5 rounded-[3px]"}
            style={{ background: it.color }}
          />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Tooltip card. Values lead (strong, foreground) and series names follow
 * (muted), each row keyed by a short stroke of the series color.
 */
export function ChartTooltip({
  title,
  rows,
  style,
  mark = "line",
}: {
  title: ReactNode;
  rows: { label: string; value: string; color: string }[];
  style?: React.CSSProperties;
  mark?: "line" | "square";
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 min-w-36 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
      style={style}
    >
      <div className="mb-1 text-muted-foreground">{title}</div>
      <ul className="grid gap-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={mark === "line" ? "h-0.5 w-2.5 shrink-0 rounded-full" : "size-2 shrink-0 rounded-[2px]"}
              style={{ background: r.color }}
            />
            <span className="font-semibold tabular-nums text-foreground">{r.value}</span>
            <span className="truncate text-muted-foreground">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Visually hidden data table: the non-visual (and copyable) view of a chart. */
export function ChartTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) =>
              j === 0 ? (
                <th key={j} scope="row">
                  {c}
                </th>
              ) : (
                <td key={j}>{c}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Keyboard + pointer focus over an indexed chart: arrows move, Home/End jump,
 * Escape clears. Returns the active index and handlers for the plot element.
 */
export function useActiveIndex(length: number) {
  const [active, setActive] = useState<number | null>(null);
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (length === 0) return;
      const keys: Record<string, (i: number) => number | null> = {
        ArrowRight: (i) => Math.min(length - 1, i + 1),
        ArrowLeft: (i) => Math.max(0, i - 1),
        Home: () => 0,
        End: () => length - 1,
        Escape: () => null,
      };
      const move = keys[e.key];
      if (!move) return;
      e.preventDefault();
      setActive((i) => move(i ?? (e.key === "ArrowLeft" ? length : -1)));
    },
    [length],
  );
  return { active, setActive, onKeyDown };
}
