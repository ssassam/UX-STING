"use client";
import { useControllableState } from "@ux-sting/hooks";
import { MinusIcon, PlusIcon } from "@ux-sting/icons";
import { clamp, cn, snapToStep } from "@ux-sting/utils";
import { forwardRef, useEffect, useState, type KeyboardEvent } from "react";
import { useLocale, useMessages } from "../../provider/context.js";
import { Input, type InputProps } from "../input/input.js";
import { InputGroup, InputGroupAction } from "../input-group/input-group.js";

export interface NumberInputProps extends Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Intl number format options (currency, percent, units). */
  formatOptions?: Intl.NumberFormatOptions;
  /** Hide the stepper buttons. */
  hideSteppers?: boolean;
}

function parseLocaleNumber(input: string, locale: string): number | null {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const normalized = input
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(new RegExp(`[${group}\\s\u00a0\u202f]`, "g"), "")
    .replace(decimal, ".")
    .replace(/[^\d.-]/g, "");
  if (normalized === "" || normalized === "-") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Locale-aware numeric input with steppers, clamping and keyboard support
 * (ArrowUp/Down, PageUp/Down, Home/End). Exposes `role="spinbutton"`.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    formatOptions,
    hideSteppers,
    size = "md",
    className,
    onBlur,
    disabled,
    ...props
  },
  ref,
) {
  const { locale } = useLocale();
  const messages = useMessages();
  const [value, setValue] = useControllableState<number | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const format = (n: number | null) =>
    n === null
      ? ""
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 20, ...formatOptions }).format(n);
  const [text, setText] = useState(format(value));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setText(format(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editing, locale]);

  const commit = (n: number | null) => {
    const next =
      n === null ? null : clamp(snapToStep(n, step, Number.isFinite(min) ? min : 0), min, max);
    setValue(next);
    setText(format(next));
  };
  const increment = (delta: number) => commit((value ?? (Number.isFinite(min) ? min : 0)) + delta);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keys: Record<string, () => void> = {
      ArrowUp: () => increment(step),
      ArrowDown: () => increment(-step),
      PageUp: () => increment(step * 10),
      PageDown: () => increment(-step * 10),
      Home: () => Number.isFinite(min) && commit(min),
      End: () => Number.isFinite(max) && commit(max),
      Enter: () => commit(parseLocaleNumber(text, locale)),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const stepperClass =
    "ui-hit-area inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 [&_svg]:size-3.5";

  return (
    <InputGroup size={size} className={className}>
      <Input
        ref={ref}
        role="spinbutton"
        inputMode={
          formatOptions?.maximumFractionDigits === 0 || Number.isInteger(step)
            ? "numeric"
            : "decimal"
        }
        size={size}
        value={text}
        disabled={disabled}
        aria-valuenow={value ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuetext={value === null ? undefined : format(value)}
        autoComplete="off"
        className="ui-number-input tabular-nums"
        onChange={(e) => {
          setEditing(true);
          setText(e.target.value);
        }}
        onBlur={(e) => {
          setEditing(false);
          commit(parseLocaleNumber(text, locale));
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        {...props}
      />
      {hideSteppers ? null : (
        <InputGroupAction>
          <button
            type="button"
            tabIndex={-1}
            aria-label={messages.decrement}
            className={stepperClass}
            disabled={disabled || (value !== null && value <= min)}
            onClick={() => increment(-step)}
          >
            <MinusIcon />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label={messages.increment}
            className={cn(stepperClass)}
            disabled={disabled || (value !== null && value >= max)}
            onClick={() => increment(step)}
          >
            <PlusIcon />
          </button>
        </InputGroupAction>
      )}
    </InputGroup>
  );
});
