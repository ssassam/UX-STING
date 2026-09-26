import { Slot, Slottable } from "@ux-sting/primitives";
import { cn } from "@ux-sting/utils";
import { forwardRef, type ElementType } from "react";
import { Spinner } from "../spinner/spinner.js";
import type { ButtonProps, IconButtonProps } from "./button.types.js";
import { buttonVariants, iconButtonSizes } from "./button.variants.js";

/**
 * The primary action element. One `default` (primary) button per view keeps
 * hierarchy clear; use `secondary`/`outline`/`ghost` for supporting actions.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild,
    variant,
    size,
    fullWidth,
    loading = false,
    loadingText,
    startIcon,
    endIcon,
    active,
    disabled,
    className,
    children,
    type,
    ...props
  },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      data-active={active ? "" : undefined}
      data-loading={loading ? "" : undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" label={null} /> : startIcon}
      <Slottable>
        {loading && loadingText ? (
          loadingText
        ) : loading && !asChild ? (
          <span className="contents">{children}</span>
        ) : (
          children
        )}
      </Slottable>
      {!loading && endIcon}
    </Comp>
  );
});

/** Square/circle button for a single icon. Requires `aria-label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { size = "md", shape = "square", className, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      size={size}
      className={cn(
        iconButtonSizes[size ?? "md"],
        shape === "circle" && "rounded-full",
        "ui-hit-area",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
