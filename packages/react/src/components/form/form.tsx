"use client";
import { AlertCircleIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type MutableRefObject,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { FormContext, type FormContextValue } from "../../lib/field.js";
import { useMessages } from "../../provider/context.js";

export type FormErrors = Record<string, ReactNode | undefined>;
export type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** External errors (e.g. from a server response or React Hook Form), keyed by field name. */
  errors?: FormErrors;
  /** Custom validation, run on submit after native constraint validation. */
  validate?: (values: FormValues) => FormErrors | undefined | Promise<FormErrors | undefined>;
  /** Called with parsed values only when the form is valid. */
  onSubmit?: (values: FormValues, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /**
   * `aria` (default): uses the browser's constraint validation (`required`,
   * `type="email"`, `min`…) but renders accessible inline errors instead of
   * native bubbles. `native` keeps browser bubbles. `none` skips validation.
   */
  validationBehavior?: "aria" | "native" | "none";
}

interface FormStateValue {
  submitting: boolean;
  submitCount: number;
  errorCount: number;
  summaryRef: MutableRefObject<HTMLDivElement | null>;
  fields: Map<string, { id: string; label?: string }>;
  errors: FormErrors;
}

const FormStateContext = createContext<FormStateValue | null>(null);

/** Access submit state (e.g. to show a loading button). */
export function useFormState() {
  const ctx = useContext(FormStateContext);
  return {
    submitting: ctx?.submitting ?? false,
    submitCount: ctx?.submitCount ?? 0,
    errorCount: ctx?.errorCount ?? 0,
  };
}

function readValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form);
  const values: FormValues = {};
  for (const key of new Set(data.keys())) {
    const all = data.getAll(key);
    values[key] = all.length > 1 ? all : (all[0] ?? "");
  }
  return values;
}

function collectNativeErrors(form: HTMLFormElement): FormErrors {
  const errors: FormErrors = {};
  for (const el of Array.from(form.elements) as Array<HTMLInputElement>) {
    if (!el.name || !el.willValidate || el.validity.valid) continue;
    errors[el.name] ??= el.validationMessage;
  }
  return errors;
}

/**
 * Accessible form with zero-config validation: fields are validated on
 * submit and re-validated on blur (not on every keystroke). After a failed
 * submit, focus moves to the `FormErrorSummary` (or the first invalid field).
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    errors: externalErrors,
    validate,
    onSubmit,
    validationBehavior = "aria",
    className,
    children,
    onBlur,
    ...props
  },
  ref,
) {
  const [internalErrors, setInternalErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const fieldsRef = useRef(new Map<string, { id: string; label?: string }>());
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [, forceRender] = useState(0);

  const errors = useMemo(() => {
    const merged: FormErrors = { ...internalErrors };
    for (const [k, v] of Object.entries(externalErrors ?? {})) if (v) merged[k] = v;
    return merged;
  }, [internalErrors, externalErrors]);
  const errorCount = Object.values(errors).filter(Boolean).length;

  const registerField = useCallback<FormContextValue["registerField"]>((name, info) => {
    fieldsRef.current.set(name, info);
    forceRender((n) => n + 1);
    return () => {
      fieldsRef.current.delete(name);
    };
  }, []);

  const focusFirstError = (errs: FormErrors) => {
    requestAnimationFrame(() => {
      if (summaryRef.current) {
        summaryRef.current.focus();
        return;
      }
      const firstName = Object.keys(errs).find((k) => errs[k]);
      const el = firstName
        ? formRef.current?.querySelector<HTMLElement>(`[name="${CSS.escape(firstName)}"]`)
        : null;
      el?.focus();
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitCount((n) => n + 1);
    let nextErrors: FormErrors = validationBehavior === "aria" ? collectNativeErrors(form) : {};
    const values = readValues(form);
    if (validate && validationBehavior !== "none") {
      nextErrors = { ...nextErrors, ...(await validate(values)) };
    }
    const hasErrors = Object.values(nextErrors).some(Boolean);
    setInternalErrors(nextErrors);
    if (hasErrors) {
      focusFirstError(nextErrors);
      return;
    }
    if (!onSubmit) return;
    try {
      setSubmitting(true);
      await onSubmit(values, event);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    onBlur?.(event);
    const el = event.target as unknown as HTMLInputElement;
    if (validationBehavior !== "aria" || !el.name || !el.willValidate) return;
    const touched = submitCount > 0 || el.value !== "";
    if (!touched) return;
    setInternalErrors((prev) => {
      const message = el.validity.valid ? undefined : el.validationMessage;
      if (prev[el.name] === message) return prev;
      return { ...prev, [el.name]: message };
    });
  };

  const formContext = useMemo<FormContextValue>(
    () => ({ errors, registerField }),
    [errors, registerField],
  );

  return (
    <FormContext.Provider value={formContext}>
      <FormStateContext.Provider
        value={{
          submitting,
          submitCount,
          errorCount,
          summaryRef,
          fields: fieldsRef.current,
          errors,
        }}
      >
        <form
          ref={(node) => {
            formRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          noValidate={validationBehavior !== "native"}
          aria-busy={submitting || undefined}
          onSubmit={handleSubmit}
          onBlur={handleBlur}
          className={cn("grid gap-(--ui-stack-gap)", className)}
          {...props}
        >
          {children}
        </form>
      </FormStateContext.Provider>
    </FormContext.Provider>
  );
});

/**
 * Focusable summary of all errors after a failed submit, linking to each
 * invalid field. Inline field errors remain. Place it at the top of the form.
 */
export const FormErrorSummary = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { title?: ReactNode }
>(function FormErrorSummary({ title, className, ...props }, ref) {
  const state = useContext(FormStateContext);
  const messages = useMessages();
  const entries = Object.entries(state?.errors ?? {}).filter(([, v]) => Boolean(v));
  const localRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!state) return;
    state.summaryRef.current = entries.length && state.submitCount > 0 ? localRef.current : null;
  });

  if (!state || state.submitCount === 0 || entries.length === 0) return null;
  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      tabIndex={-1}
      role="alert"
      aria-labelledby="form-error-summary-title"
      className={cn(
        "rounded-lg border border-destructive/40 bg-destructive-subtle p-4 text-sm text-destructive-subtle-foreground outline-none focus-visible:ring-2 focus-visible:ring-destructive",
        className,
      )}
      {...props}
    >
      <p
        id="form-error-summary-title"
        className="flex items-center gap-2 font-semibold [&_svg]:size-4"
      >
        <AlertCircleIcon />
        {title ?? messages.errorSummaryTitle(entries.length)}
      </p>
      <ul className="mt-2 grid list-disc gap-1 ps-9">
        {entries.map(([name, message]) => {
          const info = state.fields.get(name);
          return (
            <li key={name}>
              <a
                href={info ? `#${info.id}` : undefined}
                className="underline underline-offset-2"
                onClick={(e) => {
                  if (!info) return;
                  e.preventDefault();
                  document.getElementById(info.id)?.focus();
                }}
              >
                {info?.label ? `${info.label}: ` : ""}
                {message}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
