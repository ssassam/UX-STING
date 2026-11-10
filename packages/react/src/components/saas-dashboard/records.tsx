"use client";
import { useId, useState, type ReactNode } from "react";
import { Button } from "../button/index.js";
import { cn } from "@ux-sting/utils";
export interface RecordField {
  key: string;
  label: string;
  type?: "text" | "password" | "email" | "url" | "number" | "date" | "datetime-local" | "textarea";
  required?: boolean;
  min?: number;
  step?: number;
  options?: { value: string; label: string }[];
}
export interface RecordEditorProps {
  label: string;
  fields: RecordField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSave: (values: Record<string, string>) => void | Promise<void>;
  saveLabel?: string;
  errorLabel?: string;
  actions?: ReactNode;
  className?: string;
}
/** Reusable customer, product and event form. Consumer owns validation beyond native constraints and persistence. */
export function RecordEditor({
  label,
  fields,
  values,
  onChange,
  onSave,
  saveLabel = "Save",
  errorLabel = "Could not save. Try again.",
  actions,
  className,
}: RecordEditorProps) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const input =
    "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <form
      aria-label={label}
      className={cn("grid gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(false);
        try {
          await onSave(values);
        } catch {
          setError(true);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.key}
            htmlFor={`${id}-${field.key}`}
            className="grid min-w-0 gap-2 text-sm font-medium"
          >
            <span>{field.label}</span>
            {field.options ? (
              <select
                id={`${id}-${field.key}`}
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                disabled={busy}
                required={field.required}
                className={input}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={`${id}-${field.key}`}
                rows={3}
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                disabled={busy}
                required={field.required}
                className={input}
              />
            ) : (
              <input
                id={`${id}-${field.key}`}
                type={field.type || "text"}
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                disabled={busy}
                required={field.required}
                min={field.min}
                step={field.step}
                className={input}
              />
            )}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {errorLabel}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {actions}
        <Button type="submit" loading={busy} disabled={busy}>
          {saveLabel}
        </Button>
      </div>
    </form>
  );
}
export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}
export interface InvoiceComposerProps {
  label: string;
  items: InvoiceLine[];
  onChange: (items: InvoiceLine[]) => void;
  currency: string;
  locale?: string;
  taxRate?: number;
  labels?: Partial<
    Record<
      "description" | "quantity" | "unitPrice" | "add" | "remove" | "subtotal" | "tax" | "total",
      string
    >
  >;
  className?: string;
}
/** Controlled invoice rows and currency totals. Tax rate is an explicit decimal (0.2 = 20%). */
export function InvoiceComposer({
  label,
  items,
  onChange,
  currency,
  locale = "en",
  taxRate = 0,
  labels = {},
  className,
}: InvoiceComposerProps) {
  const id = useId();
  const [next, setNext] = useState(0);
  const text = {
    description: "Description",
    quantity: "Quantity",
    unitPrice: "Unit price",
    add: "Add line",
    remove: "Remove",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    ...labels,
  };
  const number = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  const subtotal = items.reduce(
      (sum, item) => sum + Math.round(number(item.quantity) * number(item.unitPrice) * 100) / 100,
      0,
    ),
    tax = Math.round(subtotal * number(taxRate) * 100) / 100;
  const format = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
  const update = (key: string, patch: Partial<InvoiceLine>) =>
    onChange(items.map((item) => (item.id === key ? { ...item, ...patch } : item)));
  return (
    <section aria-label={label} className={cn("grid gap-4", className)}>
      <ol className="grid gap-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <label className="grid min-w-0 gap-1 text-xs">
              {text.description}
              <input
                aria-label={`${text.description} ${index + 1}`}
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
                className="min-h-11 min-w-0 rounded border border-input bg-background px-2 text-base"
              />
            </label>
            <label className="grid min-w-0 gap-1 text-xs">
              {text.quantity}
              <input
                aria-label={`${text.quantity} ${index + 1}`}
                type="number"
                min="0"
                step="any"
                value={item.quantity}
                onChange={(e) => update(item.id, { quantity: Number(e.target.value) })}
                className="min-h-11 min-w-0 rounded border border-input bg-background px-2 text-base"
              />
            </label>
            <label className="grid min-w-0 gap-1 text-xs">
              {text.unitPrice}
              <input
                aria-label={`${text.unitPrice} ${index + 1}`}
                type="number"
                min="0"
                step=".01"
                value={item.unitPrice}
                onChange={(e) => update(item.id, { unitPrice: Number(e.target.value) })}
                className="min-h-11 min-w-0 rounded border border-input bg-background px-2 text-base"
              />
            </label>
            <Button
              variant="ghost"
              className="self-end"
              aria-label={`${text.remove} ${index + 1}`}
              onClick={() => onChange(items.filter((row) => row.id !== item.id))}
            >
              {text.remove}
            </Button>
          </li>
        ))}
      </ol>
      <Button
        variant="outline"
        className="justify-self-start"
        onClick={() => {
          let rowId = `${id}-${next}`;
          let sequence = next;
          while (items.some((item) => item.id === rowId)) rowId = `${id}-${++sequence}`;
          setNext(sequence + 1);
          onChange([...items, { id: rowId, description: "", quantity: 1, unitPrice: 0 }]);
        }}
      >
        {text.add}
      </Button>
      <dl aria-live="polite" className="ms-auto grid w-full max-w-xs gap-2 text-sm">
        {[
          [text.subtotal, subtotal],
          [text.tax, tax],
          [text.total, subtotal + tax],
        ].map(([name, value]) => (
          <div key={String(name)} className="flex justify-between gap-4">
            <dt>{name}</dt>
            <dd className="font-semibold tabular-nums">{format(Number(value))}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
