import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from "@unified-ui/icons";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export const alertVariants = createVariants({
  base: "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4",
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      info: "border-info/30 bg-info-subtle text-info-subtle-foreground",
      success: "border-success/30 bg-success-subtle text-success-subtle-foreground",
      warning: "border-warning/40 bg-warning-subtle text-warning-subtle-foreground",
      destructive: "border-destructive/30 bg-destructive-subtle text-destructive-subtle-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

const defaultIcons = {
  default: <InfoIcon />,
  info: <InfoIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  destructive: <XCircleIcon />,
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Custom icon, or `false` to hide it. Icons pair color with shape. */
  icon?: ReactNode | false;
  /**
   * `true` announces the alert when it appears (role="alert"). Use for
   * errors that appear after an action; keep static notices non-live.
   */
  live?: boolean;
}

/** Inline, contextual message. Server-safe. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant, icon, live, className, children, ...props },
  ref,
) {
  const resolvedIcon = icon === false ? null : (icon ?? defaultIcons[variant ?? "default"]);
  return (
    <div
      ref={ref}
      role={live ? (variant === "destructive" ? "alert" : "status") : undefined}
      className={alertVariants({ variant, className: cn(!resolvedIcon && "grid-cols-1", className) })}
      {...props}
    >
      {resolvedIcon}
      <div className="col-start-2 grid gap-1 [&:only-child]:col-start-1">{children}</div>
    </div>
  );
});

/**
 * Alert title. Renders a `<p>` by default so alerts never break the page's
 * heading outline; pass `as="h2"`… when the alert is a document section.
 */
export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement> & { as?: "p" | "h2" | "h3" | "h4" }>(
  function AlertTitle({ as: Comp = "p", className, ...props }, ref) {
    return <Comp ref={ref} className={cn("font-semibold leading-snug", className)} {...props} />;
  },
);

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("leading-relaxed opacity-95 [&_p]:leading-relaxed", className)} {...props} />;
});

export const AlertActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("mt-2 flex flex-wrap gap-2", className)} {...props} />;
});
