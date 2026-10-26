"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from "react";
import {
  ChartLegend,
  ChartTable,
  ChartTooltip,
  useActiveIndex,
  useChartFormat,
  useElementWidth,
} from "./chart-core.js";
import { niceTicks, slotColor, textWidth, tickIndices, type ChartSeries } from "./chart-utils.js";

export interface LineChartProps<T extends object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  data: T[];
  /** Field holding each datum's x value (a date string, a label…). */
  index: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  /** Accessible name: what the chart shows, e.g. "Clicks per day". */
  label: string;
  /** Adds a ~10% wash under each line. */
  area?: boolean;
  /** Plot height in px (legend excluded). */
  height?: number;
  valueFormatter?: (value: number) => string;
  /** Formats x values for ticks, tooltip titles and the table. */
  indexFormatter?: (value: T[Extract<keyof T, string>]) => string;
  /** Draw the y axis upside down (rank / position charts: 1 at the top). */
  reversed?: boolean;
  /** Start the y axis at zero (default) or fit it to the data. */
  zeroBaseline?: boolean;
  /** Legend above the plot; defaults to on for two or more series. */
  showLegend?: boolean;
  /** Shown instead of the plot when `data` is empty. */
  empty?: ReactNode;
}

const M = { top: 10, end: 12, bottom: 26 };

function LineChartInner<T extends object>(
  {
    data,
    index,
    series,
    label,
    area = false,
    height = 240,
    valueFormatter,
    indexFormatter,
    reversed = false,
    zeroBaseline = true,
    showLegend,
    empty,
    className,
    ...props
  }: LineChartProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useActiveIndex(data.length);
  const fmt = useChartFormat(valueFormatter);
  const gradientId = useId();
  const xLabel = (d: T) => (indexFormatter ? indexFormatter(d[index]) : String(d[index]));
  const value = (d: T, key: string) => {
    const v = (d as Record<string, unknown>)[key];
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };
  const colors = series.map((s, i) => slotColor(s.colorSlot, i));
  const legend = showLegend ?? series.length > 1;

  const all = data.flatMap((d) =>
    series.map((s) => value(d, s.key)).filter((v): v is number => v !== null),
  );
  const lo = all.length ? Math.min(...all) : 0;
  const hi = all.length ? Math.max(...all) : 1;
  const ticks = niceTicks(zeroBaseline ? Math.min(0, lo) : lo, zeroBaseline ? Math.max(0, hi) : hi);
  const yMin = ticks[0] ?? 0;
  const yMax = ticks[ticks.length - 1] ?? 1;
  const tickFmt = series.length === 1 && series[0]?.format ? series[0].format : fmt.tick;
  const start = Math.max(...ticks.map((t) => textWidth(tickFmt(t)))) + 10;
  const plotW = Math.max(0, width - start - M.end);
  const plotH = height - M.top - M.bottom;
  const x = (i: number) => start + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => {
    const t = (v - yMin) / (yMax - yMin || 1);
    return M.top + (reversed ? t : 1 - t) * plotH;
  };
  const baseY = reversed ? M.top : M.top + plotH;

  const pathFor = (key: string) => {
    let d = "";
    let pen = false;
    data.forEach((row, i) => {
      const v = value(row, key);
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const xTicks = tickIndices(data.length, plotW, 80);
  const onPointer = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = data.length <= 1 ? 0 : Math.round((px / rect.width) * (data.length - 1));
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  };

  const activeRow = active !== null ? data[active] : undefined;
  const tipLeft = active !== null ? x(active) : 0;
  const flip = tipLeft > width / 2;
  const fmtFor = (s: ChartSeries<T>) => s.format ?? fmt.value;

  return (
    <div ref={ref} className={cn("grid gap-3", className)} {...props}>
      {legend && (
        <ChartLegend
          mark="line"
          items={series.map((s, i) => ({ label: s.label, color: colors[i]! }))}
        />
      )}
      {data.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground"
          style={{ height }}
        >
          {empty ?? "No data"}
        </div>
      ) : (
        <div
          ref={boxRef}
          dir="ltr"
          // Focusable so keyboard users can walk the points (arrows/Home/End,
          // announced via the live region); screen readers also get the table.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          role="group"
          aria-roledescription="chart"
          aria-label={label}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ height }}
        >
          {width > 0 && (
            <svg width={width} height={height} aria-hidden className="block overflow-visible">
              {area && (
                <defs>
                  {series.map((s, i) => (
                    <linearGradient
                      key={s.key}
                      id={`${gradientId}-${i}`}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={colors[i]} stopOpacity={0.14} />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
              )}
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={start}
                    x2={start + plotW}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="var(--ui-border)"
                    strokeWidth={1}
                  />
                  <text
                    x={start - 8}
                    y={y(t)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[11px] tabular-nums"
                  >
                    {tickFmt(t)}
                  </text>
                </g>
              ))}
              {xTicks.map((i) => (
                <text
                  key={i}
                  x={x(i)}
                  y={height - 6}
                  textAnchor={
                    i === 0 && data.length > 1
                      ? "start"
                      : i === data.length - 1 && data.length > 1
                        ? "end"
                        : "middle"
                  }
                  className="fill-muted-foreground text-[11px]"
                >
                  {xLabel(data[i]!)}
                </text>
              ))}
              {area &&
                series.map((s, i) => {
                  const d = pathFor(s.key);
                  if (!d) return null;
                  const first = data.findIndex((row) => value(row, s.key) !== null);
                  const last =
                    data.length -
                    1 -
                    [...data].reverse().findIndex((row) => value(row, s.key) !== null);
                  return (
                    <path
                      key={s.key}
                      d={`${d}L${x(last).toFixed(1)},${baseY}L${x(first).toFixed(1)},${baseY}Z`}
                      fill={`url(#${gradientId}-${i})`}
                    />
                  );
                })}
              {series.map((s, i) => (
                <path
                  key={s.key}
                  d={pathFor(s.key)}
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              {active !== null && (
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={M.top}
                  y2={M.top + plotH}
                  stroke="var(--ui-border-strong)"
                  strokeWidth={1}
                />
              )}
              {series.map((s, i) => {
                // End dot on the latest value; the active point when hovering.
                const at = active ?? data.length - 1;
                const v = value(data[at]!, s.key);
                if (v === null || (active === null && data.length < 2)) return null;
                return (
                  <circle
                    key={s.key}
                    cx={x(at)}
                    cy={y(v)}
                    r={4}
                    fill={colors[i]}
                    stroke="var(--ui-card)"
                    strokeWidth={2}
                  />
                );
              })}
              <rect
                x={start}
                y={0}
                width={plotW}
                height={height}
                fill="transparent"
                onPointerMove={onPointer}
                onPointerDown={onPointer}
                onPointerLeave={() => setActive(null)}
              />
            </svg>
          )}
          {activeRow && (
            <ChartTooltip
              title={xLabel(activeRow)}
              rows={series.flatMap((s, i) => {
                const v = value(activeRow, s.key);
                return v === null
                  ? []
                  : [{ label: s.label, value: fmtFor(s)(v), color: colors[i]! }];
              })}
              style={{
                top: M.top,
                ...(flip ? { right: width - tipLeft + 12 } : { left: tipLeft + 12 }),
              }}
            />
          )}
          <div aria-live="polite" className="sr-only">
            {activeRow
              ? `${xLabel(activeRow)}: ${series
                  .map((s) => {
                    const v = value(activeRow, s.key);
                    return `${s.label} ${v === null ? "—" : fmtFor(s)(v)}`;
                  })
                  .join(", ")}`
              : ""}
          </div>
        </div>
      )}
      <ChartTable
        caption={label}
        head={[index, ...series.map((s) => s.label)]}
        rows={data.map((d) => [
          xLabel(d),
          ...series.map((s) => {
            const v = value(d, s.key);
            return v === null ? "—" : fmtFor(s)(v);
          }),
        ])}
      />
    </div>
  );
}

/**
 * Line chart for change over time: 2px lines on one y axis, hairline grid,
 * a crosshair that snaps to the nearest x with one tooltip for every series,
 * arrow-key navigation, and a visually hidden data table. Up to eight series
 * in the categorical chart colors; never two y scales. Set `area` for a wash
 * under the lines (an area chart).
 */
export const LineChart = forwardRef(LineChartInner) as unknown as <T extends object>(
  props: LineChartProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof LineChartInner>;

/** `LineChart` with `area` on. */
export const AreaChart = forwardRef(function AreaChart<T extends object>(
  props: LineChartProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  return <LineChart ref={ref} area {...props} />;
}) as unknown as <T extends object>(
  props: LineChartProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof LineChartInner>;
