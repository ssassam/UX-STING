import { AlertTriangleIcon, CheckCircle2Icon, InboxIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Spinner } from "../spinner/spinner.js";

export interface StateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary recovery or next-step action(s). */
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Heading level for the title (keep the document outline logical; use 1 for full-page states). */
  headingLevel?: 1 | 2 | 3 | 4;
}

const iconTone = {
  empty: "bg-muted text-muted-foreground",
  error: "bg-destructive-subtle text-destructive-subtle-foreground",
  success: "bg-success-subtle text-success-subtle-foreground",
  loading: "bg-primary-subtle text-primary-subtle-foreground",
};

const StateBase = forwardRef<HTMLDivElement, StateProps & { tone: keyof typeof iconTone }>(
  function StateBase(
    {
      tone,
      icon,
      title,
      description,
      actions,
      size = "md",
      headingLevel = 3,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const Heading = `h${headingLevel}` as const;
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          size === "sm"
            ? "gap-2 px-4 py-6"
            : size === "lg"
              ? "gap-4 px-6 py-16"
              : "gap-3 px-6 py-10",
          className,
        )}
        {...props}
      >
        {icon !== null ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-full [&_svg]:size-6",
              size === "sm" ? "size-10" : "size-12",
              iconTone[tone],
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="grid max-w-md gap-1">
          <Heading
            className={cn("font-semibold text-foreground", size === "lg" ? "text-xl" : "text-md")}
          >
            {title}
          </Heading>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
        {actions ? (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{actions}</div>
        ) : null}
      </div>
    );
  },
);

/** No data yet / no results. Always offer a next step. */
export const EmptyState = forwardRef<HTMLDivElement, StateProps>(function EmptyState(
  { icon, ...props },
  ref,
) {
  return <StateBase ref={ref} tone="empty" icon={icon ?? <InboxIcon />} {...props} />;
});

/** Failure with a recovery path (retry, edit, contact support). */
export const ErrorState = forwardRef<HTMLDivElement, StateProps>(function ErrorState(
  { icon, ...props },
  ref,
) {
  return (
    <StateBase
      ref={ref}
      role="alert"
      tone="error"
      icon={icon ?? <AlertTriangleIcon />}
      {...props}
    />
  );
});

export const SuccessState = forwardRef<HTMLDivElement, StateProps>(function SuccessState(
  { icon, ...props },
  ref,
) {
  return (
    <StateBase
      ref={ref}
      role="status"
      tone="success"
      icon={icon ?? <CheckCircle2Icon />}
      {...props}
    />
  );
});

/** Blocking load (> 1s). Prefer skeletons for content-shaped loading. */
export const LoadingState = forwardRef<
  HTMLDivElement,
  Omit<StateProps, "title"> & { title?: ReactNode }
>(function LoadingState({ icon, title = "Loading", ...props }, ref) {
  return (
    <StateBase
      ref={ref}
      role="status"
      aria-live="polite"
      tone="loading"
      icon={icon ?? <Spinner size="lg" label={null} />}
      title={title}
      {...props}
    />
  );
});
