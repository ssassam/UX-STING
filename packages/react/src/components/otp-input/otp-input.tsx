"use client";
import { useControllableState } from "@unified-ui/hooks";
import { cn } from "@unified-ui/utils";
import { forwardRef, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { useFieldControlProps } from "../../lib/field.js";

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once all digits are filled. */
  onComplete?: (value: string) => void;
  /** `numeric` (default) or `alphanumeric`. */
  type?: "numeric" | "alphanumeric";
  /** Mask the characters (e.g. PINs). */
  mask?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Accessible name for the group, e.g. "Verification code". */
  "aria-label"?: string;
  /** Insert a visual separator after this index (e.g. 3 for 123-456). */
  groupAfter?: number;
}

/**
 * One-time code entry. Supports paste of the full code, SMS autofill
 * (`autocomplete="one-time-code"`), arrow keys and Backspace navigation.
 */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(function OTPInput(
  {
    length = 6,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    onComplete,
    type = "numeric",
    mask,
    disabled,
    invalid,
    name,
    id,
    className,
    groupAfter,
    ...aria
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined });
  const pattern = type === "numeric" ? /[0-9]/ : /[0-9a-z]/i;

  const update = (next: string) => {
    const clean = next.slice(0, length);
    setValue(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const setChar = (index: number, char: string) => {
    const chars = value.padEnd(length, " ").split("");
    chars[index] = char;
    update(chars.join("").replace(/\s+$/, ""));
  };

  const focusAt = (i: number) => inputs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i] && value[i] !== " ") setChar(i, " ");
      else {
        setChar(Math.max(0, i - 1), " ");
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .split("")
      .filter((c) => pattern.test(c))
      .join("");
    if (!pasted) return;
    update(pasted);
    focusAt(pasted.length);
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={aria["aria-label"]}
      className={cn("flex items-center gap-2", className)}
      dir="ltr"
    >
      {Array.from({ length }, (_, i) => (
        <span key={i} className="contents">
          <input
            ref={(el) => {
              inputs.current[i] = el;
            }}
            id={i === 0 ? fieldProps.id : undefined}
            type={mask ? "password" : "text"}
            inputMode={type === "numeric" ? "numeric" : "text"}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={length}
            disabled={fieldProps.disabled}
            aria-invalid={fieldProps["aria-invalid"]}
            aria-describedby={i === 0 ? fieldProps["aria-describedby"] : undefined}
            aria-label={`${aria["aria-label"] ?? "Code"} ${i + 1}/${length}`}
            value={value[i]?.trim() ?? ""}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const chars = e.target.value.split("").filter((c) => pattern.test(c));
              if (chars.length > 1) {
                update(chars.join(""));
                focusAt(chars.length);
                return;
              }
              const char = chars[0];
              if (!char) return;
              setChar(i, type === "numeric" ? char : char.toUpperCase());
              focusAt(i + 1);
            }}
            onKeyDown={onKeyDown(i)}
            onPaste={onPaste}
            className={cn(
              "size-11 rounded-md border border-input bg-background text-center text-lg font-semibold tabular-nums shadow-xs outline-none transition-[border-color,box-shadow]",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive disabled:opacity-50",
            )}
          />
          {groupAfter && i === groupAfter - 1 ? (
            <span aria-hidden className="text-muted-foreground">
              –
            </span>
          ) : null}
        </span>
      ))}
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
});
