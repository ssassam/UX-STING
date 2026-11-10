"use client";
import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@ux-sting/utils";
import { ChartTable, useChartFormat } from "./chart-core.js";
import { slotColor, type ChartSlot } from "./chart-utils.js";
export interface RadialDatum {
  key?: string;
  name: string;
  value: number;
  colorSlot?: ChartSlot;
  color?: string;
}
export interface PieChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: RadialDatum[];
  label: string;
  size?: number;
  innerRadius?: number;
  semicircle?: boolean;
  valueFormatter?: (value: number) => string;
  center?: ReactNode;
  empty?: ReactNode;
}
const finite = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
const point = (r: number, a: number) => `${100 + r * Math.sin(a)},${100 - r * Math.cos(a)}`;
function sector(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return r0
    ? `M${point(r1, a0)}A${r1},${r1} 0 ${large} 1 ${point(r1, a1)}L${point(r0, a1)}A${r0},${r0} 0 ${large} 0 ${point(r0, a0)}Z`
    : `M100,100L${point(r1, a0)}A${r1},${r1} 0 ${large} 1 ${point(r1, a1)}Z`;
}
/** Pie, doughnut and semicircle with keyboard-accessible category values. */
export function PieChart({
  data,
  label,
  size = 180,
  innerRadius = 0,
  semicircle = false,
  valueFormatter,
  center,
  empty = "No data",
  className,
  ...props
}: PieChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + finite(d.value), 0);
  let angle = semicircle ? -Math.PI / 2 : 0;
  const slices = data.map((d, index) => {
    const start = angle;
    angle += total ? (finite(d.value) / total) * (semicircle ? Math.PI : 2 * Math.PI) : 0;
    return { d, index, start, end: angle, color: d.color || slotColor(d.colorSlot, index) };
  });
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-5", className)} {...props}>
      <div className="relative max-w-full shrink-0" style={{ width: size }}>
        <svg
          viewBox={semicircle ? "0 0 200 112" : "0 0 200 200"}
          role="img"
          aria-label={label}
          className="block w-full"
        >
          {total === 0 ? (
            <text x="100" y="100" textAnchor="middle" className="fill-muted-foreground text-xs">
              {empty}
            </text>
          ) : (
            slices.map(
              (s) =>
                finite(s.d.value) > 0 && (
                  <path
                    key={s.d.key || s.d.name}
                    d={sector(
                      Math.max(0, Math.min(0.9, innerRadius)) * 92,
                      92,
                      s.start,
                      Math.min(s.end, s.start + 2 * Math.PI - 0.0001),
                    )}
                    fill={s.color}
                    stroke="var(--ui-card)"
                    strokeWidth="2"
                    opacity={active === null || active === s.index ? 1 : 0.4}
                  />
                ),
            )
          )}
        </svg>
        {center && innerRadius > 0 && (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-8 grid place-items-center text-center text-xl font-bold",
              semicircle ? "bottom-1" : "inset-y-8",
            )}
          >
            {center}
          </div>
        )}
      </div>
      <ul className="grid min-w-0 flex-1 gap-1">
        {slices.map((s) => (
          <li key={s.d.key || s.d.name}>
            <button
              type="button"
              onFocus={() => setActive(s.index)}
              onBlur={() => setActive(null)}
              onPointerEnter={() => setActive(s.index)}
              onPointerLeave={() => setActive(null)}
              onClick={() => setActive(active === s.index ? null : s.index)}
              className="flex min-h-11 w-full items-center gap-2 rounded-md px-2 text-start text-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="min-w-0 flex-1">{s.d.name}</span>
              <strong className="tabular-nums">{fmt.value(s.d.value)}</strong>
              <span className="text-muted-foreground">
                {total ? `${((finite(s.d.value) / total) * 100).toFixed(1)}%` : "—"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ChartTable
        caption={label}
        head={["Category", "Value"]}
        rows={data.map((d) => [d.name, fmt.value(d.value)])}
      />
    </div>
  );
}
export interface GaugeChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  value: number | null;
  min?: number;
  max?: number;
  colorSlot?: ChartSlot;
  color?: string;
  valueFormatter?: (value: number) => string;
  detail?: ReactNode;
}
/** A bounded half-ring; unavailable values are never represented as zero. */
export function GaugeChart({
  label,
  value,
  min = 0,
  max = 100,
  colorSlot = 1,
  color,
  valueFormatter,
  detail,
  className,
  ...props
}: GaugeChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const valid = value !== null && Number.isFinite(value) && max > min;
  const fraction = valid ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  return (
    <div className={cn("grid min-w-0 gap-2 text-center", className)} {...props}>
      <svg
        viewBox="0 0 220 136"
        role="img"
        aria-label={`${label}: ${valid ? fmt.value(value) : "—"}`}
        className="mx-auto w-full max-w-64"
      >
        <path
          d="M20,110A90,90 0 0 1 200,110"
          pathLength="100"
          fill="none"
          stroke="var(--ui-muted)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {valid && fraction > 0 && (
          <path
            d="M20,110A90,90 0 0 1 200,110"
            pathLength="100"
            fill="none"
            stroke={color || slotColor(colorSlot, 0)}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${fraction * 100} 100`}
          />
        )}
        <text x="110" y="100" textAnchor="middle" className="fill-foreground text-3xl font-bold">
          {valid ? fmt.value(value) : "—"}
        </text>
        <text x="20" y="134" className="fill-muted-foreground text-xs">
          {fmt.value(min)}
        </text>
        <text x="200" y="134" textAnchor="end" className="fill-muted-foreground text-xs">
          {fmt.value(max)}
        </text>
      </svg>
      <p className="text-sm font-medium">{label}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      <ChartTable
        caption={label}
        head={["Metric", "Value", "Minimum", "Maximum"]}
        rows={[[label, valid ? fmt.value(value) : "—", fmt.value(min), fmt.value(max)]]}
      />
    </div>
  );
}
export interface RingChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  data: (RadialDatum & { max: number })[];
  size?: number;
  valueFormatter?: (value: number) => string;
}
/** Independent concentric progress rings, each with its own explicit maximum. */
export function RingChart({
  label,
  data,
  size = 180,
  valueFormatter,
  className,
  ...props
}: RingChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const width = Math.min(14, 70 / Math.max(1, data.length));
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-5", className)} {...props}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={label}
        style={{ width: size, maxWidth: "100%" }}
        width={size}
        height={size}
      >
        {data.map((d, i) => {
          const r = 90 - i * (width + 3);
          const ratio = d.max > 0 ? Math.min(1, finite(d.value) / d.max) : 0;
          return r > 0 ? (
            <g key={d.key || d.name}>
              <circle
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="var(--ui-muted)"
                strokeWidth={width}
              />
              <circle
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={d.color || slotColor(d.colorSlot, i)}
                strokeWidth={width}
                pathLength="100"
                strokeDasharray={`${ratio * 100} 100`}
                transform="rotate(-90 100 100)"
              />
            </g>
          ) : null;
        })}
      </svg>
      <ul className="grid gap-3 text-xs">
        {data.map((d, i) => (
          <li key={d.key || d.name} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: d.color || slotColor(d.colorSlot, i) }}
            />
            <span>{d.name}</span>
            <strong>
              {fmt.value(d.value)} / {fmt.value(d.max)}
            </strong>
          </li>
        ))}
      </ul>
      <ChartTable
        caption={label}
        head={["Metric", "Value", "Maximum"]}
        rows={data.map((d) => [d.name, fmt.value(d.value), fmt.value(d.max)])}
      />
    </div>
  );
}
export interface SegmentChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  data: RadialDatum[];
  valueFormatter?: (value: number) => string;
}
/** A compact composition/qualification bar with all values available in text. */
export function SegmentChart({
  label,
  data,
  valueFormatter,
  className,
  ...props
}: SegmentChartProps) {
  const fmt = useChartFormat(valueFormatter);
  const total = data.reduce((sum, d) => sum + finite(d.value), 0);
  return (
    <div className={cn("grid min-w-0 gap-3", className)} {...props}>
      <div
        role="img"
        aria-label={label}
        className="flex h-5 gap-1 overflow-hidden rounded-md bg-muted"
      >
        {data.map(
          (d, i) =>
            finite(d.value) > 0 && (
              <span
                key={d.key || d.name}
                style={{ flex: finite(d.value), background: d.color || slotColor(d.colorSlot, i) }}
              />
            ),
        )}
      </div>
      <ul className="flex flex-wrap gap-4 text-xs">
        {data.map((d, i) => (
          <li key={d.key || d.name} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: d.color || slotColor(d.colorSlot, i) }}
            />
            {d.name}
            <strong>{fmt.value(d.value)}</strong>
            <span className="text-muted-foreground">
              {total ? `${((finite(d.value) / total) * 100).toFixed(1)}%` : "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
