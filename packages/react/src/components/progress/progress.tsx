import { clamp, cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export const progressVariants = createVariants({
  base: "relative w-full overflow-hidden rounded-full bg-muted",
  variants: {
    size: { xs: "h-1", sm: "h-1.5", md: "h-2", lg: "h-3" },
  },
  defaultVariants: { size: "md" },
});

const indicatorColor = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof progressVariants> {
  /** Current value; omit or pass `null` for an indeterminate bar. */
  value?: number | null;
  max?: number;
  variant?: keyof typeof indicatorColor;
  /** Visible label rendered above the bar (also used as accessible name). */
  label?: ReactNode;
  /** Show the formatted value next to the label. */
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
}

/** Linear progress. Server-safe; uses native `progressbar` semantics. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = null, max = 100, size, variant = "default", label, showValue, formatValue, className, id, ...props },
  ref,
) {
  const indeterminate = value === null;
  const pct = indeterminate ? 0 : clamp((value / max) * 100, 0, 100);
  const text = indeterminate ? undefined : (formatValue?.(value, max) ?? `${Math.round(pct)}%`);
  const labelId = id ? `${id}-label` : undefined;
  const bar = (
    <div
      ref={ref}
      id={id}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuetext={text}
      aria-labelledby={label && labelId ? labelId : undefined}
      data-state={indeterminate ? "indeterminate" : pct >= 100 ? "complete" : "loading"}
      className={progressVariants({ size, className })}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-(--ui-duration-slow) ease-(--ui-ease-standard)",
          indicatorColor[variant],
          indeterminate && "ui-indeterminate w-2/5",
        )}
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
  if (!label && !showValue) return bar;
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        {label ? <span id={labelId} className="font-medium">{label}</span> : <span />}
        {showValue && text ? <span className="tabular-nums text-muted-foreground">{text}</span> : null}
      </div>
      {bar}
    </div>
  );
});

export interface CircularProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value?: number | null;
  max?: number;
  size?: number;
  thickness?: number;
  variant?: keyof typeof indicatorColor;
  showValue?: boolean;
  children?: ReactNode;
}

const strokeColor = {
  default: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  info: "stroke-info",
};

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(function CircularProgress(
  { value = null, max = 100, size = 48, thickness = 4, variant = "default", showValue, className, children, ...props },
  ref,
) {
  const indeterminate = value === null;
  const pct = indeterminate ? 25 : clamp((value / max) * 100, 0, 100);
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("-rotate-90", indeterminate && "ui-spin")} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          className={cn(strokeColor[variant], "transition-[stroke-dashoffset] duration-(--ui-duration-slow)")}
        />
      </svg>
      {children ?? (showValue && !indeterminate ? (
        <span className="absolute text-xs font-semibold tabular-nums">{Math.round(pct)}%</span>
      ) : null)}
    </div>
  );
});
