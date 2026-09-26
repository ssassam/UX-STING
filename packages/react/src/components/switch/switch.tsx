"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@unified-ui/utils";
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useFieldControlProps } from "../../lib/field.js";

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Label position relative to the switch. */
  labelPosition?: "start" | "end";
}

const sizes = {
  sm: { root: "h-4 w-7", thumb: "size-3 data-[state=checked]:translate-x-3 rtl:data-[state=checked]:-translate-x-3" },
  md: { root: "h-5 w-9", thumb: "size-4 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4" },
  lg: { root: "h-6 w-11", thumb: "size-5 data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5" },
};

/**
 * On/off setting that takes effect immediately (use a Checkbox inside forms
 * that require submit). Exposes `role="switch"` with `aria-checked`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, size = "md", labelPosition = "end", className, id: idProp, ...props },
  ref,
) {
  const autoId = useId();
  const fieldProps = useFieldControlProps({ ...props, id: idProp });
  const id = fieldProps.id ?? `switch${autoId.replace(/:/g, "")}`;
  const descId = description ? `${id}-desc` : undefined;
  const control = (
    <SwitchPrimitive.Root
      ref={ref}
      {...fieldProps}
      id={id}
      aria-describedby={cn(fieldProps["aria-describedby"], descId) || undefined}
      className={cn(
        "peer ui-hit-area inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border-strong transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size].root,
        !label && className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform duration-(--ui-duration-fast)",
          sizes[size].thumb,
        )}
      />
    </SwitchPrimitive.Root>
  );
  if (!label) return control;
  return (
    <div className={cn("flex items-start gap-3", labelPosition === "start" && "flex-row-reverse justify-between", className)}>
      <span className="flex h-5 items-center">{control}</span>
      <div className="grid gap-0.5 leading-snug">
        <label htmlFor={id} className="text-sm font-medium peer-disabled:opacity-60">
          {label}
        </label>
        {description ? (
          <p id={descId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
});
