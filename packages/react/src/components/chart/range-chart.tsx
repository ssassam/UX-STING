"use client";
import { useState, type HTMLAttributes } from "react";
import { cn } from "@ux-sting/utils";
import { ChartTable, useChartFormat } from "./chart-core.js";
import { niceTicks, tickIndices } from "./chart-utils.js";
export interface RangeDatum {
  name: string;
  low: number;
  high: number;
  open: number;
  close: number;
}
export interface RangeChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  data: RangeDatum[];
  height?: number;
  valueFormatter?: (value: number) => string;
}
/** Candlestick/range chart: the wick encodes low/high; the body encodes open/close. */
export function RangeChart({
  label,
  data,
  height = 240,
  valueFormatter,
  className,
  ...props
}: RangeChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const [active, setActive] = useState<number | null>(null);
  const valid = data.filter(
    (row) =>
      [row.low, row.high, row.open, row.close].every(Number.isFinite) &&
      row.high >= Math.max(row.low, row.open, row.close) &&
      row.low <= Math.min(row.open, row.close),
  );
  const ticks = niceTicks(
      Math.min(0, ...valid.map((row) => row.low)),
      Math.max(1, ...valid.map((row) => row.high)),
    ),
    lo = ticks[0] ?? 0,
    hi = ticks.at(-1) ?? 1;
  const x = (i: number) => 60 + ((i + 0.5) * 500) / Math.max(1, valid.length),
    y = (v: number) => 200 - ((v - lo) / (hi - lo)) * 180,
    bar = Math.min(20, 350 / Math.max(1, valid.length));
  const shown = active === null ? undefined : valid[active];
  return (
    <div className={cn("grid gap-3", className)} {...props}>
      <div
        role="group"
        aria-label={label}
        aria-roledescription="chart"
        // Keyboard access inspects each observation; the data table exposes all four measures.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (!valid.length) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(e.key)) {
            e.preventDefault();
            setActive((i) =>
              e.key === "Escape"
                ? null
                : e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? valid.length - 1
                    : Math.max(
                        0,
                        Math.min(valid.length - 1, (i ?? 0) + (e.key === "ArrowRight" ? 1 : -1)),
                      ),
            );
          }
        }}
      >
        <svg viewBox="0 0 600 240" style={{ height }} className="w-full" aria-hidden>
          {ticks.map((v) => (
            <g key={v}>
              <line x1="60" x2="560" y1={y(v)} y2={y(v)} stroke="var(--ui-border)" />
              <text
                x="53"
                y={y(v) + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {fmt.tick(v)}
              </text>
            </g>
          ))}
          {valid.map((row, i) => (
            <g
              key={i}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onPointerDown={() => setActive(i)}
            >
              <rect x={x(i) - bar} y="10" width={bar * 2} height="200" fill="transparent" />
              <line
                x1={x(i)}
                x2={x(i)}
                y1={y(row.low)}
                y2={y(row.high)}
                stroke="var(--ui-chart-1)"
                strokeWidth="2"
              />
              <rect
                x={x(i) - bar / 2}
                y={Math.min(y(row.open), y(row.close))}
                width={bar}
                height={Math.max(1, Math.abs(y(row.close) - y(row.open)))}
                fill={row.close >= row.open ? "var(--ui-chart-1)" : "var(--ui-card)"}
                stroke="var(--ui-chart-1)"
                strokeWidth="2"
              />
            </g>
          ))}
          {tickIndices(valid.length, 500).map((i) => (
            <text
              key={i}
              x={x(i)}
              y="230"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {valid[i]!.name}
            </text>
          ))}
        </svg>
      </div>
      <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
        {shown
          ? `${shown.name}: ${["low", "high", "open", "close"].map((key) => `${key} ${fmt.value(shown[key as "low"])}`).join(" · ")}`
          : ""}
      </p>
      <ChartTable
        caption={label}
        head={["Name", "Low", "High", "Open", "Close"]}
        rows={valid.map((row) => [
          row.name,
          ...[row.low, row.high, row.open, row.close].map(fmt.value),
        ])}
      />
    </div>
  );
}
