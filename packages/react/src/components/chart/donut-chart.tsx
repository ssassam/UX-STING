"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChartTable, useChartFormat } from "./chart-core.js";
import { slotColor, type ChartSlot } from "./chart-utils.js";

export interface DonutChartItem {
  key?: string;
  name: string;
  value: number;
  colorSlot?: ChartSlot;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  data: DonutChartItem[];
  /** Accessible name, e.g. "Sessions by device". */
  label: string;
  valueFormatter?: (value: number) => string;
  /** Text in the hole; defaults to the formatted total. */
  center?: ReactNode;
  /** Small caption under the center value. */
  centerLabel?: ReactNode;
  /** Diameter in px. */
  size?: number;
}

const TAU = Math.PI * 2;

function arc(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (r: number, a: number) => `${(cx + r * Math.sin(a)).toFixed(2)},${(cy - r * Math.cos(a)).toFixed(2)}`;
  return `M${p(r1, a0)}A${r1},${r1} 0 ${large} 1 ${p(r1, a1)}L${p(r0, a1)}A${r0},${r0} 0 ${large} 0 ${p(r0, a0)}Z`;
}

/**
 * Parts of a whole, for a handful of categories (≤ 5 reads best; fold the
 * rest into "Other"). Slices are split by a 2px surface gap, and a legend
 * with values and shares sits beside the ring, so identity never relies on
 * color alone.
 */
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  { data, label, valueFormatter, center, centerLabel, size = 128, className, ...props },
  ref,
) {
  const fmt = useChartFormat(valueFormatter);
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const r1 = size / 2;
  const r0 = r1 * 0.66;
  let a = 0;
  const slices = data.map((d, i) => {
    const sweep = total > 0 ? (Math.max(0, d.value) / total) * TAU : 0;
    const s = { d, i, a0: a, a1: a + sweep, color: slotColor(d.colorSlot, i) };
    a += sweep;
    return s;
  });
  const shown = active !== null ? data[active] : undefined;

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center gap-6", className)} {...props}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={label} className="block">
          {total === 0 ? (
            <circle cx={r1} cy={r1} r={(r0 + r1) / 2} fill="none" stroke="var(--ui-muted)" strokeWidth={r1 - r0} />
          ) : (
            slices.map((s) =>
              s.a1 - s.a0 >= TAU - 1e-6 ? (
                <circle key={s.i} cx={r1} cy={r1} r={(r0 + r1) / 2} fill="none" stroke={s.color} strokeWidth={r1 - r0} />
              ) : s.a1 > s.a0 ? (
                <path
                  key={s.i}
                  d={arc(r1, r1, r0, r1, s.a0, s.a1)}
                  fill={s.color}
                  stroke="var(--ui-card)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  opacity={active === null || active === s.i ? 1 : 0.45}
                  onPointerEnter={() => setActive(s.i)}
                  onPointerLeave={() => setActive(null)}
                />
              ) : null,
            )
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-semibold tabular-nums text-foreground">
            {shown ? fmt.value(shown.value) : (center ?? fmt.value(total))}
          </span>
          <span className="max-w-[70%] truncate text-[11px] text-muted-foreground">{shown ? shown.name : centerLabel}</span>
        </div>
      </div>
      <ul className="grid min-w-40 flex-1 gap-1.5 text-sm">
        {slices.map((s) => (
          <li
            key={s.d.key ?? s.d.name}
            className="flex items-center gap-2"
            onPointerEnter={() => setActive(s.i)}
            onPointerLeave={() => setActive(null)}
          >
            <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
            <span className="min-w-0 flex-1 truncate text-foreground">{s.d.name}</span>
            <span className="font-medium tabular-nums text-foreground">{fmt.value(s.d.value)}</span>
            <span className="w-12 text-end text-xs tabular-nums text-muted-foreground">
              {total > 0 ? `${((s.d.value / total) * 100).toFixed(1)}%` : "—"}
            </span>
          </li>
        ))}
      </ul>
      <ChartTable
        caption={label}
        head={["Category", "Value", "Share"]}
        rows={data.map((d) => [d.name, fmt.value(d.value), total > 0 ? `${((d.value / total) * 100).toFixed(1)}%` : "—"])}
      />
    </div>
  );
});
