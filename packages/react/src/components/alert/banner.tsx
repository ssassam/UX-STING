"use client";
import { XIcon } from "@unified-ui/icons";
import { useControllableState } from "@unified-ui/hooks";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";

export const bannerVariants = createVariants({
  base: "relative flex w-full items-center gap-3 px-4 py-2.5 text-sm sm:px-6 [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      neutral: "border-b border-border bg-surface text-foreground",
      info: "bg-info-subtle text-info-subtle-foreground",
      success: "bg-success-subtle text-success-subtle-foreground",
      warning: "bg-warning-subtle text-warning-subtle-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Page-level announcement, typically above the navbar. */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    variant,
    icon,
    action,
    dismissible,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    className,
    children,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  if (!open) return null;
  return (
    <div
      ref={ref}
      role="region"
      aria-label={props["aria-label"] ?? "Announcement"}
      className={bannerVariants({ variant, className })}
      {...props}
    >
      {icon}
      <div className="min-w-0 flex-1">{children}</div>
      {action}
      {dismissible ? (
        <button
          type="button"
          aria-label={messages.close}
          onClick={() => setOpen(false)}
          className={cn(
            "ui-hit-area inline-flex size-6 items-center justify-center rounded-sm opacity-80 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current",
          )}
        >
          <XIcon size="sm" />
        </button>
      ) : null}
    </div>
  );
});
