import { cn } from "@ux-sting/utils";
import { forwardRef, type SVGAttributes } from "react";
import { slotColor, type ChartSlot } from "./chart-utils.js";

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  data: number[];
  /** Accessible name, e.g. "Clicks, last 28 days". */
  label: string;
  /** Categorical slot, or `"muted"` for the de-emphasis ink (default 1). */
  colorSlot?: ChartSlot;
  /** Adds a ~10% wash under the line. */
  area?: boolean;
  /** Marks the latest value with a dot. */
  showEnd?: boolean;
}

/**
 * Word-sized trend line for stat tiles and table cells. No axes and no
 * hover: pair it with the figure it summarizes. Scales to its box (set the
 * size with `className`, default 100% × 32px).
 */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { data, label, colorSlot = 1, area = true, showEnd = true, className, ...props },
  ref,
) {
  const w = 100;
  const h = 32;
  const color = slotColor(colorSlot, 0);
  if (data.length < 2) {
    return (
      <svg
        ref={ref}
        role="img"
        aria-label={label}
        className={cn("h-8 w-full", className)}
        {...props}
      />
    );
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map(
    (v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)] as const,
  );
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("");
  const last = pts[pts.length - 1]!;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={cn("h-8 w-full overflow-visible", className)}
      {...props}
    >
      {area && <path d={`${line}L${w},${h}L0,${h}Z`} fill={color} opacity={0.1} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {showEnd && (
        <line
          x1={last[0]}
          y1={last[1]}
          x2={last[0]}
          y2={last[1]}
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
});
