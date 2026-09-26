import { cn, createVariants, type VariantProps } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes } from "react";

export const spinnerVariants = createVariants({
  base: "inline-block shrink-0 rounded-full border-2 border-current border-e-transparent ui-spin",
  variants: {
    size: { xs: "size-3", sm: "size-3.5", md: "size-4", lg: "size-6", xl: "size-8" },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible label. Pass `null` when a parent already announces loading. */
  label?: string | null;
}

/** Indeterminate activity indicator. Server-safe; pass a localized `label`. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label = "Loading", className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
});
