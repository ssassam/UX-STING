"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@ux-sting/utils";
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useField, useFieldControlProps } from "../../lib/field.js";

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  invalid?: boolean;
}

/**
 * One choice from a small set (≤ 6); use Select for longer lists. Arrow keys
 * move and select (RTL-aware); the group is a single tab stop.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, invalid, orientation = "vertical", ...props },
  ref,
) {
  const field = useField();
  const fieldProps = useFieldControlProps({ ...props, "aria-invalid": invalid || undefined });
  const { id: _id, ...rest } = fieldProps;
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      orientation={orientation}
      aria-labelledby={field ? undefined : props["aria-labelledby"]}
      className={cn(
        orientation === "horizontal" ? "flex flex-wrap gap-x-6 gap-y-3" : "grid gap-3",
        className,
      )}
      {...rest}
    />
  );
});

export interface RadioProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { label, description, className, id: idProp, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `radio${autoId.replace(/:/g, "")}`;
  const descId = description ? `${id}-desc` : undefined;
  const item = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={id}
      aria-describedby={descId}
      className={cn(
        "peer ui-hit-area inline-flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border border-input bg-background shadow-xs transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        !label && className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  );
  if (!label) return item;
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="flex h-5 items-center">{item}</span>
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

/** Alias for Radio for readability in docs: `<RadioGroupItem />`. */
export const RadioGroupItem = Radio;

/** Large, card-style radio option — for plans, shipping methods, etc. */
export const RadioCard = forwardRef<HTMLButtonElement, RadioProps>(function RadioCard(
  { label, description, className, children, ...props },
  ref,
) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4 text-start transition-colors",
        "outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary-subtle/50 data-[state=checked]:ring-1 data-[state=checked]:ring-primary disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border border-input bg-background">
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
      </span>
      <span className="grid gap-0.5">
        {label ? <span className="text-sm font-medium">{label}</span> : null}
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
        {children}
      </span>
    </RadioGroupPrimitive.Item>
  );
});
