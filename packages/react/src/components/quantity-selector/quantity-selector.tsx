"use client";
import { useControllableState } from "@ux-sting/hooks";
import { MinusIcon, PlusIcon } from "@ux-sting/icons";
import { clamp, cn } from "@ux-sting/utils";
import { forwardRef, useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { useField, useFieldControlProps } from "../../lib/field.js";
import { useMessages } from "../../provider/context.js";

const sizes = {
  sm: { root: "h-8", button: "w-8 [&_svg]:size-3.5", input: "w-10 text-sm" },
  md: { root: "h-10", button: "w-10 [&_svg]:size-4", input: "w-12 text-md" },
  lg: { root: "h-12", button: "w-12 [&_svg]:size-5", input: "w-14 text-lg" },
};

export interface QuantitySelectorProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "size"
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Default 1. */
  min?: number;
  /** Defaults to `stock` when given. */
  max?: number;
  step?: number;
  /** Units available; shows "N in stock" under the control and caps the value. */
  stock?: number;
  size?: keyof typeof sizes;
  /** Stretch to the container width (mobile add-to-cart bars). */
  fullWidth?: boolean;
}

/**
 * Cart quantity control: − / input / + with clamping to stock. The input is a
 * native number field (spinbutton), so arrows, typing and form submission
 * work; the buttons are real tab stops, sized for touch. Adapted from the
 * Storefront UI QuantitySelector block (MIT).
 */
export const QuantitySelector = forwardRef<HTMLInputElement, QuantitySelectorProps>(
  function QuantitySelector(
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      min = 1,
      max: maxProp,
      step = 1,
      stock,
      size = "md",
      fullWidth,
      disabled,
      className,
      onBlur,
      onKeyDown,
      "aria-describedby": describedByProp,
      ...props
    },
    ref,
  ) {
    const messages = useMessages();
    const field = useField();
    const max = maxProp ?? stock ?? Infinity;
    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue: defaultValue ?? min,
      onChange: onValueChange,
    });
    const [text, setText] = useState(String(value));
    useEffect(() => setText(String(value)), [value]);

    const autoId = useId();
    const stockId = `qty${autoId.replace(/:/g, "")}-stock`;
    const describedBy =
      [describedByProp, stock !== undefined ? stockId : undefined].filter(Boolean).join(" ") ||
      undefined;
    const control = useFieldControlProps({
      ...props,
      disabled,
      "aria-describedby": describedBy,
    });
    const inputId = control.id ?? `qty${autoId.replace(/:/g, "")}`;

    const commit = (n: number) => {
      const next = Number.isFinite(n) ? clamp(Math.round(n / step) * step, min, max) : value;
      setValue(next);
      setText(String(next));
    };
    const s = sizes[size];
    const buttonClass = cn(
      "ui-hit-area inline-flex h-full shrink-0 items-center justify-center text-foreground outline-none transition-colors",
      "hover:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent",
      s.button,
    );

    return (
      <div className={cn("inline-grid gap-1", fullWidth ? "w-full" : "w-fit", className)}>
        <div
          className={cn(
            "flex items-stretch overflow-hidden rounded-md border border-input bg-background shadow-xs",
            disabled && "opacity-50",
            s.root,
          )}
        >
          <button
            type="button"
            aria-controls={inputId}
            aria-label={messages.decrement}
            className={cn(buttonClass, "border-e border-input")}
            disabled={disabled || value <= min}
            onClick={() => commit(value - step)}
          >
            <MinusIcon />
          </button>
          <input
            ref={ref}
            type="number"
            inputMode="numeric"
            // A Field label or aria-labelledby names the input; otherwise fall back to "Quantity".
            aria-label={field || props["aria-labelledby"] ? undefined : messages.quantity}
            {...control}
            id={inputId}
            min={min}
            max={Number.isFinite(max) ? max : undefined}
            step={step}
            value={text}
            className={cn(
              "ui-number-input min-w-0 grow appearance-none bg-transparent text-center font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
              s.input,
            )}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => {
              commit(text === "" ? min : Number(text));
              onBlur?.(e);
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e);
              if (e.defaultPrevented) return;
              const keys: Record<string, number | undefined> = {
                ArrowUp: value + step,
                ArrowDown: value - step,
                Home: min,
                End: Number.isFinite(max) ? max : undefined,
                Enter: text === "" ? min : Number(text),
              };
              const next = keys[e.key];
              if (next === undefined) return;
              e.preventDefault();
              commit(next);
            }}
          />
          <button
            type="button"
            aria-controls={inputId}
            aria-label={messages.increment}
            className={cn(buttonClass, "border-s border-input")}
            disabled={disabled || value >= max}
            onClick={() => commit(value + step)}
          >
            <PlusIcon />
          </button>
        </div>
        {stock !== undefined ? (
          <p id={stockId} className="text-center text-xs text-muted-foreground">
            {messages.inStock(stock)}
          </p>
        ) : null}
      </div>
    );
  },
);
