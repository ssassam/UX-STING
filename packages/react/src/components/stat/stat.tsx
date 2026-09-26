import { TrendingDownIcon, TrendingUpIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Card } from "../card/card.js";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Change indicator, e.g. `"+12%"`. */
  delta?: ReactNode;
  /** Direction of change; `positive`/`negative` describe meaning, not direction. */
  trend?: "up" | "down" | "neutral";
  /** Whether "up" is good (revenue) or bad (churn). */
  trendMeaning?: "positive-up" | "positive-down";
  helpText?: ReactNode;
  icon?: ReactNode;
}

/** Key figure with optional trend. Uses tabular numbers and icon+text for trend (not color alone). */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  {
    label,
    value,
    delta,
    trend = "neutral",
    trendMeaning = "positive-up",
    helpText,
    icon,
    className,
    ...props
  },
  ref,
) {
  const good = trend === "neutral" ? null : (trend === "up") === (trendMeaning === "positive-up");
  return (
    <div ref={ref} className={cn("grid gap-1", className)} {...props}>
      <dt className="flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground">
        {label}
        {icon ? (
          <span aria-hidden className="[&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </dt>
      <dd className="text-2xl font-semibold tracking-tight tabular-nums">
        <bdi>{value}</bdi>
      </dd>
      {delta || helpText ? (
        <dd className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {delta ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-medium tabular-nums [&_svg]:size-3.5",
                good === null
                  ? "bg-muted text-muted-foreground"
                  : good
                    ? "bg-success-subtle text-success-subtle-foreground"
                    : "bg-destructive-subtle text-destructive-subtle-foreground",
              )}
            >
              {trend === "up" ? <TrendingUpIcon /> : trend === "down" ? <TrendingDownIcon /> : null}
              <bdi>{delta}</bdi>
            </span>
          ) : null}
          {helpText}
        </dd>
      ) : null}
    </div>
  );
});

/** Stat wrapped in a card; use in dashboard KPI rows. */
export const StatCard = forwardRef<HTMLDivElement, StatProps>(function StatCard(
  { className, ...props },
  ref,
) {
  return (
    <Card ref={ref} className={cn("p-card-p", className)}>
      <dl>
        <Stat {...props} />
      </dl>
    </Card>
  );
});

/** Compact inline metric: label + value pair. */
export function Metric({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-md font-semibold tabular-nums">
        <bdi>{value}</bdi>
      </span>
    </div>
  );
}

/** Semantic wrapper for a group of `Stat`s (renders a `<dl>`). */
export const StatGroup = forwardRef<HTMLDListElement, HTMLAttributes<HTMLDListElement>>(
  function StatGroup({ className, ...props }, ref) {
    return (
      <dl
        ref={ref}
        className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}
        {...props}
      />
    );
  },
);
