"use client";
import { ChevronDownIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { controlVariants, type ControlSize } from "../../lib/control.js";
import { useFieldControlProps } from "../../lib/field.js";

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: ControlSize;
  invalid?: boolean;
}

/**
 * Styled native `<select>`: best on mobile (OS pickers), zero JS, works in
 * server components' forms and without hydration.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { size, invalid, className, children, ...props },
  ref,
) {
  const fieldProps = useFieldControlProps({ ...props, "aria-invalid": invalid || undefined });
  return (
    <div className={cn("relative w-full", className)}>
      <select
        ref={ref}
        className={cn(controlVariants({ size }), "appearance-none pe-9")}
        {...fieldProps}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
});
