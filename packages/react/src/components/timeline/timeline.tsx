import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export const Timeline = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(function Timeline(
  { className, ...props },
  ref,
) {
  return <ol ref={ref} className={cn("relative grid gap-6", className)} {...props} />;
});

const dotColor = {
  default: "bg-border-strong",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  /** Machine-readable or display time. Use `dateTime` for the <time> attribute. */
  time?: ReactNode;
  dateTime?: string;
  description?: ReactNode;
  icon?: ReactNode;
  variant?: keyof typeof dotColor;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { title, time, dateTime, description, icon, variant = "default", className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cn("relative grid grid-cols-[1.5rem_1fr] gap-x-3 last:[&>span.line]:hidden", className)} {...props}>
      <span aria-hidden className="line absolute start-[0.6875rem] top-6 -bottom-6 w-px bg-border" />
      <span aria-hidden className="relative z-10 mt-0.5 flex size-6 items-center justify-center rounded-full bg-background [&_svg]:size-3.5">
        {icon ? (
          <span className={cn("flex size-6 items-center justify-center rounded-full text-primary-foreground", dotColor[variant])}>{icon}</span>
        ) : (
          <span className={cn("size-2.5 rounded-full ring-4 ring-background", dotColor[variant])} />
        )}
      </span>
      <div className="grid gap-1 pb-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {time ? <time dateTime={dateTime} className="text-xs tabular-nums text-muted-foreground">{time}</time> : null}
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {children}
      </div>
    </li>
  );
});
