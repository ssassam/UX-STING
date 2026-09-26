import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes } from "react";

/**
 * Wraps an input with leading/trailing addons (icons, units, buttons). The
 * group draws the border; the inner input is borderless.
 */
export const InputGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }>(
  function InputGroup({ size = "md", className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "flex w-full items-center rounded-md border border-input bg-background shadow-xs transition-[border-color,box-shadow]",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
          "has-[[aria-invalid=true]]:border-destructive has-[:disabled]:opacity-60",
          size === "sm" ? "h-control-sm" : size === "lg" ? "h-control-lg" : "h-control-md",
          "[&>[data-slot=input]]:h-full [&>[data-slot=input]]:border-0 [&>[data-slot=input]]:bg-transparent [&>[data-slot=input]]:shadow-none [&>[data-slot=input]]:ring-0 [&>[data-slot=input]]:focus-visible:ring-0",
          className,
        )}
        {...props}
      />
    );
  },
);

/** Non-interactive addon (icon, unit, prefix text). */
export const InputGroupAddon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function InputGroupAddon(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full shrink-0 items-center gap-1 px-3 text-sm text-muted-foreground first:pe-0 last:ps-0 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
});

/** Interactive addon container (buttons inside the field). */
export const InputGroupAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function InputGroupAction(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("flex h-full shrink-0 items-center gap-1 px-1", className)} {...props} />;
});
