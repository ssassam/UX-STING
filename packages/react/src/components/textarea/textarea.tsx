"use client";
import { useMergedRefs } from "@unified-ui/hooks";
import { cn } from "@unified-ui/utils";
import { forwardRef, useCallback, useEffect, useRef, type TextareaHTMLAttributes } from "react";
import { controlVariants } from "../../lib/control.js";
import { useFieldControlProps } from "../../lib/field.js";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content up to `maxRows`. */
  autoResize?: boolean;
  maxRows?: number;
  invalid?: boolean;
  /** Show a live character count when `maxLength` is set. */
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autoResize, maxRows = 12, invalid, showCount, className, onChange, rows = 3, ...props },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const merged = useMergedRefs(ref, innerRef);
  const fieldProps = useFieldControlProps({ ...props, "aria-invalid": invalid || props["aria-invalid"] || undefined });

  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    el.style.height = `${Math.min(el.scrollHeight, lineHeight * maxRows + 16)}px`;
  }, [autoResize, maxRows]);

  useEffect(resize, [resize, props.value]);
  const length = typeof props.value === "string" ? props.value.length : undefined;

  const textarea = (
    <textarea
      ref={merged}
      rows={rows}
      className={cn(controlVariants({ size: "md" }), "h-auto min-h-16 py-2 leading-relaxed", autoResize && "resize-none overflow-hidden", className)}
      onChange={(e) => {
        onChange?.(e);
        resize();
      }}
      {...fieldProps}
    />
  );
  if (!showCount || !props.maxLength) return textarea;
  return (
    <div className="grid gap-1">
      {textarea}
      <span aria-live="polite" className="justify-self-end text-xs tabular-nums text-muted-foreground">
        {length ?? 0}/{props.maxLength}
      </span>
    </div>
  );
});
