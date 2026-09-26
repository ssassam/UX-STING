"use client";
import { createContext, useContext, useEffect, useId, useMemo, useState, type ReactNode } from "react";

export interface FieldContextValue {
  id: string;
  name?: string;
  descriptionId: string;
  errorId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  error?: ReactNode;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FormContextValue {
  errors: Record<string, ReactNode | undefined>;
  registerField: (name: string, info: { id: string; label?: string }) => () => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue | null {
  return useContext(FormContext);
}

export interface UseFieldStateOptions {
  id?: string;
  name?: string;
  error?: ReactNode;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export function useFieldState({ id: idProp, name, error: errorProp, invalid, required = false, disabled = false, readOnly = false }: UseFieldStateOptions): FieldContextValue {
  const generated = useId();
  const id = idProp ?? `field${generated.replace(/:/g, "")}`;
  const form = useFormContext();
  const error = errorProp ?? (name ? form?.errors[name] : undefined);
  const [hasDescription, setHasDescription] = useState(false);
  return useMemo(
    () => ({
      id,
      name,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      hasDescription,
      setHasDescription,
      error,
      invalid: Boolean(invalid || error),
      required,
      disabled,
      readOnly,
    }),
    [id, name, hasDescription, error, invalid, required, disabled, readOnly],
  );
}

/** Registers a description so controls reference it via aria-describedby. */
export function useRegisterDescription(field: FieldContextValue | null) {
  useEffect(() => {
    if (!field) return;
    field.setHasDescription(true);
    return () => field.setHasDescription(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field?.setHasDescription]);
}

export interface ControlAriaProps {
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

/**
 * Merges field context (ids, validity, required/disabled) into a control's
 * props. Explicit props always win.
 */
export function useFieldControlProps<P extends ControlAriaProps>(props: P): P & ControlAriaProps {
  const field = useField();
  if (!field) return props;
  const describedBy = [
    props["aria-describedby"],
    field.hasDescription ? field.descriptionId : undefined,
    field.error ? field.errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    ...props,
    id: props.id ?? field.id,
    name: props.name ?? field.name,
    required: props.required ?? (field.required || undefined),
    disabled: props.disabled ?? (field.disabled || undefined),
    readOnly: props.readOnly ?? (field.readOnly || undefined),
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
  };
}
