"use client";
import { cn } from "@unified-ui/utils";
import { forwardRef, type InputHTMLAttributes } from "react";
import { controlVariants, type ControlSize } from "../../lib/control";
import { useFieldControlProps } from "../../lib/field";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: ControlSize;
  variant?: "default" | "filled";
  /** Marks the control invalid (normally derived from `Field`). */
  invalid?: boolean;
}

/**
 * Single-line text input. Use a semantic `type` (email, tel, url) and
 * `autoComplete` so mobile keyboards and autofill work. Always pair with a
 * visible label (via `Field`) — placeholders are not labels.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, variant, invalid, className, type = "text", ...props },
  ref,
) {
  const fieldProps = useFieldControlProps({
    ...props,
    "aria-invalid": invalid || props["aria-invalid"] || undefined,
  });
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        controlVariants({ size, variant }),
        "file:me-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...fieldProps}
    />
  );
});
