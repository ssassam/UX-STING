"use client";
import { useControllableState } from "@ux-sting/hooks";
import { TrendingDownIcon, TrendingUpIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { slotColor, type ChartSlot } from "./chart-utils.js";

export interface ChartMetric {
  key: string;
  label: ReactNode;
  /** The headline figure for the period, already formatted. */
  value: ReactNode;
  /** Change vs the previous period, e.g. "+12.4%". */
  delta?: ReactNode;
  /** Direction of the change. */
  trend?: "up" | "down" | "neutral";
  /** Whether "up" is good (clicks) or bad (average position). */
  trendMeaning?: "positive-up" | "positive-down";
  /** Color of the plotted line when this metric is selected. */
  colorSlot?: ChartSlot;
}

export interface ChartMetricsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  metrics: ChartMetric[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Accessible name for the picker, e.g. "Metric". */
  label: string;
}

/**
 * Row of metric tiles that picks what the chart below plots (the Search
 * Console pattern). Exactly one metric is plotted at a time, so the chart
 * keeps one y axis. A radio group: arrow keys move and select; the selected
 * tile carries the series color as a top rule, and its figure and delta stay
 * in text colors.
 */
export const ChartMetrics = forwardRef<HTMLDivElement, ChartMetricsProps>(function ChartMetrics(
  { metrics, value: valueProp, defaultValue, onValueChange, label, className, ...props },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? metrics[0]?.key ?? "",
    onChange: onValueChange,
  });
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const n = metrics.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    setValue(metrics[next]!.key);
    buttons.current[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]",
        className,
      )}
      {...props}
    >
      {metrics.map((m, i) => {
        const on = m.key === value;
        const good =
          !m.trend || m.trend === "neutral"
            ? null
            : (m.trend === "up") === ((m.trendMeaning ?? "positive-up") === "positive-up");
        return (
          <button
            key={m.key}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => setValue(m.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative grid gap-1 overflow-hidden rounded-md border px-3 pb-2.5 pt-3 text-start outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring",
              on
                ? "border-border-strong bg-card shadow-xs"
                : "border-border bg-transparent hover:bg-muted/60",
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] transition-opacity"
              style={{ background: slotColor(m.colorSlot, i), opacity: on ? 1 : 0 }}
            />
            <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
            <span className="text-xl font-semibold tracking-tight text-foreground">{m.value}</span>
            {m.delta ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium tabular-nums [&_svg]:size-3.5",
                  good === null
                    ? "text-muted-foreground"
                    : good
                      ? "text-success-subtle-foreground"
                      : "text-destructive-subtle-foreground",
                )}
              >
                {m.trend === "up" ? (
                  <TrendingUpIcon aria-hidden />
                ) : m.trend === "down" ? (
                  <TrendingDownIcon aria-hidden />
                ) : null}
                {m.delta}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
});
