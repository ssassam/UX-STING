"use client";
import { useState, type HTMLAttributes } from "react";
import { cn } from "@ux-sting/utils";
import { ChartLegend, ChartTable, useChartFormat } from "./chart-core.js";
import { niceTicks, slotColor, tickIndices, type ChartSeries } from "./chart-utils.js";
export interface ComboSeries<T> extends ChartSeries<T> {
  type: "bar" | "line" | "lollipop";
}
export interface ComboChartProps<T extends object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label: string;
  data: T[];
  index: Extract<keyof T, string>;
  series: ComboSeries<T>[];
  height?: number;
  valueFormatter?: (value: number) => string;
}
/** Bars, lines and lollipops share one unit and one y axis. Nulls remain gaps. */
export function ComboChart<T extends object>({
  label,
  data,
  index,
  series,
  height = 260,
  valueFormatter,
  className,
  ...props
}: ComboChartProps<T>) {
  const fmt = useChartFormat(valueFormatter);
  const [active, setActive] = useState<number | null>(null);
  const value = (row: T, key: string) => {
    const v = (row as Record<string, unknown>)[key];
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };
  const values = data.flatMap((row) =>
    series.map((s) => value(row, s.key)).filter((v): v is number => v !== null),
  );
  const ticks = niceTicks(Math.min(0, ...values), Math.max(1, ...values));
  const lo = ticks[0] ?? 0,
    hi = ticks.at(-1) ?? 1;
  const x = (i: number) => 60 + ((i + 0.5) * 520) / Math.max(1, data.length);
  const y = (v: number) => 220 - ((v - lo) / (hi - lo)) * 200;
  const bars = series.filter((s) => s.type === "bar");
  const band = 520 / Math.max(1, data.length),
    bar = Math.min(24, (band * 0.7) / Math.max(1, bars.length));
  const shown = active === null ? undefined : data[active];
  return (
    <div className={cn("grid min-w-0 gap-3", className)} {...props}>
      <ChartLegend
        mark="line"
        items={series.map((s, i) => ({
          label: s.label,
          color: s.color || slotColor(s.colorSlot, i),
        }))}
      />
      <div
        role="group"
        aria-roledescription="chart"
        aria-label={label}
        // Chart keyboard navigation is paired with an accessible data table.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (!data.length) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(e.key)) {
            e.preventDefault();
            setActive((i) =>
              e.key === "Escape"
                ? null
                : e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? data.length - 1
                    : Math.max(
                        0,
                        Math.min(data.length - 1, (i ?? 0) + (e.key === "ArrowRight" ? 1 : -1)),
                      ),
            );
          }
        }}
      >
        <svg viewBox="0 0 600 255" aria-hidden className="w-full" style={{ height }}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1="60" x2="580" y1={y(v)} y2={y(v)} stroke="var(--ui-border)" />
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
          {series.map((s, si) => {
            const color = s.color || slotColor(s.colorSlot, si);
            if (s.type === "line") {
              let pen = false;
              const path = data
                .map((row, i) => {
                  const v = value(row, s.key);
                  if (v === null) {
                    pen = false;
                    return "";
                  }
                  const d = `${pen ? "L" : "M"}${x(i)},${y(v)}`;
                  pen = true;
                  return d;
                })
                .join(" ");
              return (
                <path
                  key={s.key}
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={s.dashed ? "5 4" : undefined}
                />
              );
            }
            return (
              <g key={s.key}>
                {data.map((row, i) => {
                  const v = value(row, s.key);
                  if (v === null) return null;
                  return s.type === "lollipop" ? (
                    <g key={i}>
                      <line
                        x1={x(i)}
                        x2={x(i)}
                        y1={y(0)}
                        y2={y(v)}
                        stroke={color}
                        strokeWidth="2"
                      />
                      <circle cx={x(i)} cy={y(v)} r="4" fill={color} />
                    </g>
                  ) : (
                    <rect
                      key={i}
                      x={x(i) - (bar * bars.length) / 2 + bars.indexOf(s) * bar}
                      y={Math.min(y(0), y(v))}
                      width={Math.max(1, bar - 2)}
                      height={Math.abs(y(v) - y(0))}
                      rx="2"
                      fill={color}
                    />
                  );
                })}
              </g>
            );
          })}
          {tickIndices(data.length, 520).map((i) => (
            <text
              key={i}
              x={x(i)}
              y="245"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {String(data[i]![index])}
            </text>
          ))}
          {data.map((_, i) => (
            <rect
              key={i}
              x={60 + i * band}
              y="0"
              width={band}
              height="220"
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onPointerDown={() => setActive(i)}
            />
          ))}
        </svg>
      </div>
      <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
        {shown
          ? `${String(shown[index])} · ${series.map((s) => `${s.label}: ${value(shown, s.key) === null ? "—" : (s.format || fmt.value)(value(shown, s.key)!)}`).join(" · ")}`
          : ""}
      </p>
      <ChartTable
        caption={label}
        head={[String(index), ...series.map((s) => s.label)]}
        rows={data.map((row) => [
          String(row[index]),
          ...series.map((s) =>
            value(row, s.key) === null ? "—" : (s.format || fmt.value)(value(row, s.key)!),
          ),
        ])}
      />
    </div>
  );
}
