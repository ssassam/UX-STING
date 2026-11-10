"use client";
import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@ux-sting/utils";
import { ChartLegend, ChartTable, useChartFormat } from "./chart-core.js";
import { slotColor, type ChartSeries, type ChartSlot } from "./chart-utils.js";
export interface HorizontalBarChartProps<T extends object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label: string;
  data: T[];
  index: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  stacked?: boolean;
  normalized?: boolean;
  /** Optional persistent entity color for single-series ranked rows. */
  rowColor?: (row: T) => string;
  valueFormatter?: (value: number) => string;
  empty?: ReactNode;
}
/** Grouped, stacked or percentage horizontal comparisons with full text values. */
export function HorizontalBarChart<T extends object>({
  label,
  data,
  index,
  series,
  stacked = false,
  normalized = false,
  rowColor,
  valueFormatter,
  empty = "No data",
  className,
  ...props
}: HorizontalBarChartProps<T>) {
  const fmt = useChartFormat(valueFormatter);
  const value = (d: T, key: string) => {
    const v = (d as Record<string, unknown>)[key];
    return typeof v === "number" && Number.isFinite(v) ? Math.max(0, v) : 0;
  };
  const display = (d: T, s: ChartSeries<T>) => {
    const raw = (d as Record<string, unknown>)[s.key];
    return typeof raw === "number" && Number.isFinite(raw) ? (s.format || fmt.value)(raw) : "—";
  };
  const max = Math.max(
    1,
    ...data.map((d) =>
      stacked
        ? series.reduce((sum, s) => sum + value(d, s.key), 0)
        : Math.max(0, ...series.map((s) => value(d, s.key))),
    ),
  );
  return (
    <div role="group" aria-label={label} className={cn("grid min-w-0 gap-4", className)} {...props}>
      <ChartLegend
        mark="square"
        items={series.map((s, i) => ({
          label: s.label,
          color: s.color || slotColor(s.colorSlot, i),
        }))}
      />
      {data.length ? (
        data.map((d, i) => {
          const total = series.reduce((sum, s) => sum + value(d, s.key), 0);
          return (
            <div key={i} className="grid gap-2">
              <strong className="text-xs">{String(d[index])}</strong>
              <div
                className={
                  stacked ? "flex h-5 gap-0.5 overflow-hidden rounded bg-muted" : "grid gap-1"
                }
              >
                {series.map((s, si) => (
                  <div
                    key={s.key}
                    className={stacked ? "min-w-0" : "flex items-center gap-2"}
                    style={
                      stacked
                        ? {
                            width: `${(value(d, s.key) / (normalized ? total || 1 : max)) * 100}%`,
                            background:
                              (series.length === 1 ? rowColor?.(d) : undefined) ||
                              s.color ||
                              slotColor(s.colorSlot, si),
                          }
                        : undefined
                    }
                    title={`${s.label}: ${display(d, s)}`}
                  >
                    {!stacked && (
                      <>
                        <span
                          aria-hidden
                          className="h-3 rounded"
                          style={{
                            width: `${(value(d, s.key) / max) * 75}%`,
                            background:
                              (series.length === 1 ? rowColor?.(d) : undefined) ||
                              s.color ||
                              slotColor(s.colorSlot, si),
                          }}
                        />
                        <span className="text-xs tabular-nums">
                          {s.label}: {display(d, s)}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {stacked && (
                <p className="text-xs text-muted-foreground">
                  {series.map((s) => `${s.label}: ${display(d, s)}`).join(" · ")}
                </p>
              )}
            </div>
          );
        })
      ) : (
        <p className="py-6 text-sm text-muted-foreground">{empty}</p>
      )}
      <ChartTable
        caption={label}
        head={[String(index), ...series.map((s) => s.label)]}
        rows={data.map((d) => [String(d[index]), ...series.map((s) => display(d, s))])}
      />
    </div>
  );
}
export interface ScatterDatum {
  id: string;
  name: string;
  x: number;
  y: number;
  size?: number;
  colorSlot?: ChartSlot;
  color?: string;
}
export interface ScatterChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  data: ScatterDatum[];
  xLabel: string;
  yLabel: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  empty?: ReactNode;
}
/** Scatter or bubble distribution; arrow keys walk observations, not pixels. */
export function ScatterChart({
  label,
  data,
  xLabel,
  yLabel,
  height = 260,
  valueFormatter,
  empty = "No data",
  className,
  ...props
}: ScatterChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const [active, setActive] = useState<number | null>(null);
  const points = data.filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y));
  const minX = Math.min(0, ...points.map((d) => d.x)),
    maxX = Math.max(1, ...points.map((d) => d.x));
  const minY = Math.min(0, ...points.map((d) => d.y)),
    maxY = Math.max(1, ...points.map((d) => d.y));
  const x = (v: number) => 50 + ((v - minX) / (maxX - minX)) * 410;
  const y = (v: number) => 210 - ((v - minY) / (maxY - minY)) * 180;
  const shown = active === null ? null : points[active];
  return (
    <div className={cn("grid min-w-0 gap-3", className)} {...props}>
      {/* Arrow-key access is paired with a complete accessible data table. */}
      <div
        role="group"
        aria-roledescription="chart"
        aria-label={label}
        // Chart keyboard navigation is paired with an accessible data table.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (!points.length) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(e.key)) {
            e.preventDefault();
            setActive((i) =>
              e.key === "Escape"
                ? null
                : e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? points.length - 1
                    : Math.max(
                        0,
                        Math.min(points.length - 1, (i ?? 0) + (e.key === "ArrowRight" ? 1 : -1)),
                      ),
            );
          }
        }}
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 500 260" aria-hidden className="w-full" style={{ height }}>
          <path d="M50,30V210H460" fill="none" stroke="var(--ui-border-strong)" />
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line
                x1="50"
                x2="460"
                y1={210 - 180 * t}
                y2={210 - 180 * t}
                stroke="var(--ui-border)"
              />
              <text
                x="45"
                y={214 - 180 * t}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {fmt.tick(minY + t * (maxY - minY))}
              </text>
              <text
                x={50 + 410 * t}
                y="230"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {fmt.tick(minX + t * (maxX - minX))}
              </text>
            </g>
          ))}
          {points.map((d, i) => (
            <circle
              key={d.id}
              cx={x(d.x)}
              cy={y(d.y)}
              r={Math.min(28, Math.max(4, Math.sqrt(Math.max(0, d.size ?? 36))))}
              fill={d.color || slotColor(d.colorSlot, i)}
              opacity={active === null || active === i ? 0.85 : 0.35}
              stroke="var(--ui-card)"
              strokeWidth="2"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onPointerDown={() => setActive(i)}
            />
          ))}
          <text x="250" y="254" textAnchor="middle" className="fill-foreground text-xs">
            {xLabel}
          </text>
          <text x="5" y="15" className="fill-foreground text-xs">
            {yLabel}
          </text>
          {!points.length && (
            <text x="250" y="120" textAnchor="middle" className="fill-muted-foreground text-xs">
              {empty}
            </text>
          )}
        </svg>
      </div>
      <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
        {shown
          ? `${shown.name} · ${xLabel}: ${fmt.value(shown.x)} · ${yLabel}: ${fmt.value(shown.y)}${shown.size !== undefined ? ` · Size: ${fmt.value(shown.size)}` : ""}`
          : ""}
      </p>
      <ChartTable
        caption={label}
        head={["Name", xLabel, yLabel, "Size"]}
        rows={points.map((d) => [
          d.name,
          fmt.value(d.x),
          fmt.value(d.y),
          d.size === undefined ? "—" : fmt.value(d.size),
        ])}
      />
    </div>
  );
}
