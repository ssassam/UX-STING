"use client";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { createContext, forwardRef, useContext, useId, type ComponentPropsWithoutRef, type FieldsetHTMLAttributes, type ReactNode } from "react";
import { useFieldControlProps } from "../../lib/field";
import { useControllableState } from "@unified-ui/hooks";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Inline label rendered next to the box (clickable). */
  label?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
}

const boxSize = { sm: "size-4", md: "size-[1.125rem]", lg: "size-5" };

/**
 * Binary or indeterminate choice. Supports `checked="indeterminate"` for
 * parent "select all" boxes. Works in forms (hidden native input).
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, size = "md", invalid, className, id: idProp, ...props },
  ref,
) {
  const group = useContext(CheckboxGroupContext);
  const autoId = useId();
  const fieldProps = useFieldControlProps({ ...props, id: idProp, "aria-invalid": invalid || undefined });
  const id = label ? (fieldProps.id ?? `cb${autoId.replace(/:/g, "")}`) : fieldProps.id;
  const descId = description ? `${id}-desc` : undefined;
  const groupProps =
    group && props.value !== undefined
      ? {
          name: props.name ?? group.name,
          checked: group.value.includes(String(props.value)),
          onCheckedChange: (checked: boolean | "indeterminate") => group.toggle(String(props.value), checked === true),
          disabled: props.disabled ?? group.disabled,
        }
      : {};

  const box = (
    <CheckboxPrimitive.Root
      ref={ref}
      {...fieldProps}
      {...groupProps}
      id={id}
      aria-describedby={cn(fieldProps["aria-describedby"], descId) || undefined}
      className={cn(
        "peer ui-hit-area inline-flex shrink-0 items-center justify-center rounded-sm border border-input bg-background shadow-xs transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        boxSize[size],
        !label && className,
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center [&_svg]:size-3.5 [&_svg]:[stroke-width:3]">
        {props.checked === "indeterminate" ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="flex h-5 items-center">{box}</span>
      <div className="grid gap-0.5 leading-snug">
        <label htmlFor={id} className="text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
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

interface CheckboxGroupContextValue {
  name?: string;
  value: string[];
  disabled?: boolean;
  toggle: (value: string, checked: boolean) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "defaultValue" | "onChange"> {
  legend?: ReactNode;
  description?: ReactNode;
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: "vertical" | "horizontal";
  error?: ReactNode;
}

/** Multiple related checkboxes sharing a legend and value array. */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { legend, description, name, value: valueProp, defaultValue = [], onValueChange, orientation = "vertical", error, disabled, className, children, ...props },
  ref,
) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const errorId = useId();
  return (
    <CheckboxGroupContext.Provider
      value={{
        name,
        value,
        disabled,
        toggle: (v, checked) => setValue((prev) => (checked ? [...prev.filter((x) => x !== v), v] : prev.filter((x) => x !== v))),
      }}
    >
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn("grid gap-3", className)}
        {...props}
      >
        {legend ? <legend className="mb-1 text-sm font-medium">{legend}</legend> : null}
        {description ? <p className="-mt-2 text-sm text-muted-foreground">{description}</p> : null}
        <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-x-6")}>{children}</div>
        {error ? (
          <p id={errorId} className="text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
});
