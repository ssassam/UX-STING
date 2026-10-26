"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import {
  ChartLegend,
  ChartTable,
  ChartTooltip,
  useActiveIndex,
  useChartFormat,
  useElementWidth,
} from "./chart-core.js";
import { niceTicks, slotColor, textWidth, tickIndices, type ChartSeries } from "./chart-utils.js";

export interface BarChartProps<T extends object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  data: T[];
  /** Field holding each column's category / date. */
  index: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  /** Accessible name: what the chart shows. */
  label: string;
  /** Stack series in one column (parts of a whole) instead of side by side. */
  stacked?: boolean;
  height?: number;
  valueFormatter?: (value: number) => string;
  indexFormatter?: (value: T[Extract<keyof T, string>]) => string;
  /** Print each column's value on its cap (single, unstacked series only). */
  showValues?: boolean;
  showLegend?: boolean;
  empty?: ReactNode;
}

const M = { top: 16, end: 8, bottom: 26 };
const MAX_BAR = 24;
const GAP = 2;
const RADIUS = 4;

/** Column path: square at the baseline, 4px rounded data end. */
function column(x: number, w: number, top: number, bottom: number, round: boolean) {
  const h = bottom - top;
  if (h <= 0) return "";
  const r = round ? Math.min(RADIUS, w / 2, h) : 0;
  return `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bottom}Z`;
}

function BarChartInner<T extends object>(
  {
    data,
    index,
    series,
    label,
    stacked = false,
    height = 240,
    valueFormatter,
    indexFormatter,
    showValues = false,
    showLegend,
    empty,
    className,
    ...props
  }: BarChartProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useActiveIndex(data.length);
  const fmt = useChartFormat(valueFormatter);
  const xLabel = (d: T) => (indexFormatter ? indexFormatter(d[index]) : String(d[index]));
  const value = (d: T, key: string) => {
    const v = (d as Record<string, unknown>)[key];
    return typeof v === "number" && Number.isFinite(v) ? Math.max(0, v) : 0;
  };
  const colors = series.map((s, i) => slotColor(s.colorSlot, i));
  const legend = showLegend ?? series.length > 1;
  const fmtFor = (s: ChartSeries<T>) => s.format ?? fmt.value;

  const maxV = Math.max(
    0,
    ...data.map((d) =>
      stacked
        ? series.reduce((sum, s) => sum + value(d, s.key), 0)
        : Math.max(0, ...series.map((s) => value(d, s.key))),
    ),
  );
  const ticks = niceTicks(0, maxV || 1);
  const yMax = ticks[ticks.length - 1] ?? 1;
  const tickFmt = series.length === 1 && series[0]?.format ? series[0].format : fmt.tick;
  const start = Math.max(...ticks.map((t) => textWidth(tickFmt(t)))) + 10;
  const plotW = Math.max(0, width - start - M.end);
  const plotH = height - M.top - M.bottom;
  const band = data.length ? plotW / data.length : 0;
  const y = (v: number) => M.top + (1 - v / yMax) * plotH;
  const base = M.top + plotH;
  const groupW = Math.min(
    band * 0.7,
    stacked ? MAX_BAR : MAX_BAR * series.length + GAP * (series.length - 1),
  );
  const barW = stacked ? groupW : Math.max(1, (groupW - GAP * (series.length - 1)) / series.length);
  const xTicks = tickIndices(data.length, plotW, 64);
  const labels = showValues && !stacked && series.length === 1 && band >= 28;

  const activeRow = active !== null ? data[active] : undefined;
  const tipX = active !== null ? start + band * (active + 0.5) : 0;
  const flip = tipX > width / 2;

  return (
    <div ref={ref} className={cn("grid gap-3", className)} {...props}>
      {legend && (
        <ChartLegend
          mark="square"
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
              {data.map((d, i) => {
                const left = start + band * i + (band - groupW) / 2;
                let acc = 0;
                const total = series.reduce((sum, s) => sum + value(d, s.key), 0);
                return (
                  <g
                    key={i}
                    onPointerEnter={() => setActive(i)}
                    onPointerDown={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                  >
                    {/* Hit target: the whole band, not just the painted bar. */}
                    <rect
                      x={start + band * i}
                      y={M.top}
                      width={band}
                      height={plotH}
                      fill={active === i ? "var(--ui-muted)" : "transparent"}
                      opacity={0.6}
                    />
                    {series.map((s, si) => {
                      const v = value(d, s.key);
                      if (stacked) {
                        const bottom = y(acc) - (acc > 0 ? GAP / 2 : 0);
                        acc += v;
                        const top = y(acc) + (acc < total ? GAP / 2 : 0);
                        return (
                          <path
                            key={s.key}
                            d={column(left, barW, top, bottom, acc >= total)}
                            fill={colors[si]}
                          />
                        );
                      }
                      const bx = left + si * (barW + GAP);
                      return (
                        <path
                          key={s.key}
                          d={column(bx, barW, y(v), base, true)}
                          fill={colors[si]}
                        />
                      );
                    })}
                    {labels && (
                      <text
                        x={left + groupW / 2}
                        y={y(value(d, series[0]!.key)) - 5}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px] tabular-nums"
                      >
                        {tickFmt(value(d, series[0]!.key))}
                      </text>
                    )}
                  </g>
                );
              })}
              <line
                x1={start}
                x2={start + plotW}
                y1={base}
                y2={base}
                stroke="var(--ui-border-strong)"
                strokeWidth={1}
              />
              {xTicks.map((i) => (
                <text
                  key={i}
                  x={start + band * (i + 0.5)}
                  y={height - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {xLabel(data[i]!)}
                </text>
              ))}
            </svg>
          )}
          {activeRow && (
            <ChartTooltip
              mark="square"
              title={xLabel(activeRow)}
              rows={series.map((s, i) => ({
                label: s.label,
                value: fmtFor(s)(value(activeRow, s.key)),
                color: colors[i]!,
              }))}
              style={{
                top: M.top,
                ...(flip
                  ? { right: width - tipX + groupW / 2 + 8 }
                  : { left: tipX + groupW / 2 + 8 }),
              }}
            />
          )}
          <div aria-live="polite" className="sr-only">
            {activeRow
              ? `${xLabel(activeRow)}: ${series.map((s) => `${s.label} ${fmtFor(s)(value(activeRow, s.key))}`).join(", ")}`
              : ""}
          </div>
        </div>
      )}
      <ChartTable
        caption={label}
        head={[index, ...series.map((s) => s.label)]}
        rows={data.map((d) => [xLabel(d), ...series.map((s) => fmtFor(s)(value(d, s.key)))])}
      />
    </div>
  );
}

/**
 * Column chart for magnitude by category or period: ≤24px columns grown from
 * one baseline with a 4px rounded data end, side-by-side or `stacked` series
 * separated by a 2px surface gap, a per-column hover/focus tooltip and a
 * visually hidden data table.
 */
export const BarChart = forwardRef(BarChartInner) as unknown as <T extends object>(
  props: BarChartProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof BarChartInner>;
