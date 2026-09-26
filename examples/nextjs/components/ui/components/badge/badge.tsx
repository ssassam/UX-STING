import { Slot } from "@unified-ui/primitives";
import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export const badgeVariants = createVariants({
  base: "inline-flex max-w-full shrink-0 items-center gap-1 whitespace-nowrap rounded-full border font-medium [&_svg]:size-3 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      outline: "border-border-strong text-foreground",
      destructive: "border-transparent bg-destructive-subtle text-destructive-subtle-foreground",
      success: "border-transparent bg-success-subtle text-success-subtle-foreground",
      warning: "border-transparent bg-warning-subtle text-warning-subtle-foreground",
      info: "border-transparent bg-info-subtle text-info-subtle-foreground",
      primary: "border-transparent bg-primary-subtle text-primary-subtle-foreground",
    },
    size: {
      sm: "h-5 px-2 text-[0.6875rem]",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-sm",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Status dot before the label — pair with text, never color alone. */
  dot?: boolean;
  icon?: ReactNode;
}

/** Short status or metadata label. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { asChild, variant, size, dot, icon, className, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp ref={ref} className={badgeVariants({ variant, size, className })} {...props}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : icon}
      {children}
    </Comp>
  );
});

/** Numeric count bubble, e.g. unread notifications. Caps at `max`. */
export function CountBadge({
  count,
  max = 99,
  label,
  className,
}: {
  count: number;
  max?: number;
  /** Accessible description, e.g. "3 unread messages". */
  label?: string;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[0.6875rem] font-semibold tabular-nums text-destructive-foreground",
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
