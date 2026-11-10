import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@ux-sting/utils";

export interface DashboardPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}
/** Flat analytics surface with a labelled heading and responsive actions. */
export function DashboardPanel({
  title,
  description,
  actions,
  footer,
  children,
  className,
  ...props
}: DashboardPanelProps) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "min-w-0 rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-5">
        <div className="grid min-w-0 gap-1">
          <h2 id={id} className="text-base font-bold">
            {title}
          </h2>
          {description && (
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      <div className="min-w-0 px-5 pb-5">{children}</div>
      {footer && (
        <footer className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {footer}
        </footer>
      )}
    </section>
  );
}
export interface DashboardToolbarProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  summary?: ReactNode;
  actions?: ReactNode;
}
/** One filter surface; regular controls keep native Tab order and wrap on narrow screens. */
export function DashboardToolbar({
  label,
  summary,
  actions,
  children,
  className,
  ...props
}: DashboardToolbarProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("min-w-0 rounded-xl border border-border bg-card p-3", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {children}
        {actions && <div className="ms-auto flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {summary && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {summary}
        </div>
      )}
    </div>
  );
}
export interface DashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  layout?: "balanced" | "wide-main" | "metrics";
}
/** Source-order-preserving SaaS content grid, single column on phones. */
export function DashboardGrid({ layout = "balanced", className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-4",
        layout === "metrics"
          ? "sm:grid-cols-2 xl:grid-cols-4"
          : layout === "wide-main"
            ? "xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]"
            : "lg:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}
export interface MetricSummaryProps extends HTMLAttributes<HTMLElement> {
  label: string;
  value: ReactNode;
  change?: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  chart?: ReactNode;
  trend?: "up" | "down" | "neutral";
}
export function MetricSummary({
  label,
  value,
  change,
  detail,
  icon,
  chart,
  trend = "neutral",
  className,
  ...props
}: MetricSummaryProps) {
  return (
    <article
      className={cn("grid min-w-0 gap-3 rounded-xl border border-border bg-card p-4", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium text-muted-foreground">{label}</h3>
        {icon && (
          <span aria-hidden className="rounded-lg bg-muted p-2 text-foreground">
            {icon}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <strong className="text-2xl font-bold tabular-nums">{value}</strong>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend === "up"
                ? "text-success-subtle-foreground"
                : trend === "down"
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {change}
          </span>
        )}
      </div>
      {chart}
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </article>
  );
}
