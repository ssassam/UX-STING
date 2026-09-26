"use client";
import { AlertCircleIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useEffect, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import {
  FieldContext,
  useField,
  useFieldState,
  useFormContext,
  useRegisterDescription,
  type UseFieldStateOptions,
} from "../../lib/field";
import { Label, type LabelProps } from "../typography/typography";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "id">, UseFieldStateOptions {
  /** Convenience: renders a FieldLabel. */
  label?: ReactNode;
  /** Convenience: renders a FieldDescription (helper text). */
  description?: ReactNode;
  /** Label placement. `horizontal` puts label and control side by side on ≥sm. */
  orientation?: "vertical" | "horizontal";
}

/**
 * Connects a label, control, helper text and error message: ids,
 * `aria-describedby`, `aria-invalid`, `required` and `disabled` are wired
 * automatically. Errors come from `error` or the parent `Form` by `name`.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { id, name, error, invalid, required, disabled, readOnly, label, description, orientation = "vertical", className, children, ...props },
  ref,
) {
  const field = useFieldState({ id, name, error, invalid, required, disabled, readOnly });
  const form = useFormContext();
  const labelText = typeof label === "string" ? label : undefined;

  useEffect(() => {
    if (!form || !name) return;
    return form.registerField(name, { id: field.id, label: labelText });
  }, [form, name, field.id, labelText]);

  return (
    <FieldContext.Provider value={field}>
      <div
        ref={ref}
        data-invalid={field.invalid ? "" : undefined}
        data-disabled={field.disabled ? "" : undefined}
        className={cn(
          "grid gap-1.5",
          orientation === "horizontal" && "sm:grid-cols-[minmax(8rem,1fr)_2fr] sm:items-start sm:gap-x-4 [&>label]:sm:pt-2",
          className,
        )}
        {...props}
      >
        {label ? <FieldLabel>{label}</FieldLabel> : null}
        {children}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        <FieldError />
      </div>
    </FieldContext.Provider>
  );
});

export const FieldLabel = forwardRef<HTMLLabelElement, LabelProps>(function FieldLabel(props, ref) {
  const field = useField();
  return <Label ref={ref} htmlFor={field?.id} required={field?.required} disabled={field?.disabled} {...props} />;
});

export const FieldDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FieldDescription({ className, ...props }, ref) {
    const field = useField();
    useRegisterDescription(field);
    return <p ref={ref} id={field?.descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);

/**
 * Error message placed below the control and referenced by it. Renders the
 * field's error automatically; pass children to override.
 */
export const FieldError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FieldError({ className, children, ...props }, ref) {
    const field = useField();
    const message = children ?? field?.error;
    if (!message) return null;
    return (
      <p
        ref={ref}
        id={field?.errorId}
        className={cn("flex items-start gap-1.5 text-sm font-medium text-destructive [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0", className)}
        {...props}
      >
        <AlertCircleIcon />
        <span>{message}</span>
      </p>
    );
  },
);

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: ReactNode;
  description?: ReactNode;
  /** Visually hide the legend while keeping it for screen readers. */
  hideLegend?: boolean;
}

/** Groups related fields (address, preferences) with a legend. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, hideLegend, className, children, ...props },
  ref,
) {
  return (
    <fieldset ref={ref} className={cn("grid min-w-0 gap-4", className)} {...props}>
      <legend className={cn("mb-1 text-md font-semibold", hideLegend && "sr-only")}>{legend}</legend>
      {description ? <p className="-mt-3 text-sm text-muted-foreground">{description}</p> : null}
      {children}
    </fieldset>
  );
});
