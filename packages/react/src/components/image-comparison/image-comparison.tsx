"use client";
import { useControllableState } from "@ux-sting/hooks";
import { cn } from "@ux-sting/utils";
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { useLocale, useMessages } from "../../provider/context.js";

export interface ImageComparisonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /** Shown on the inline-start side (usually an `Image`). */
  before: ReactNode;
  /** Shown on the inline-end side. */
  after: ReactNode;
  /** Accessible name of the slider. Defaults to the localized "Compare images". */
  label?: string;
  /** Visible corner captions. Pass `null` to hide them. */
  beforeLabel?: ReactNode;
  afterLabel?: ReactNode;
  /** Divider position in percent (controlled). */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}

/**
 * Before/after slider. The control is a native range input, so arrow keys,
 * Home/End, Page Up/Down, screen readers and touch work without custom
 * code. Vertical page scrolling still works on touch. Mirrors in RTL.
 */
export const ImageComparison = forwardRef<HTMLDivElement, ImageComparisonProps>(
  function ImageComparison(
    {
      before,
      after,
      label,
      beforeLabel,
      afterLabel,
      value: valueProp,
      defaultValue = 50,
      onValueChange,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const messages = useMessages();
    const { dir } = useLocale();
    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    const startCaption = beforeLabel === undefined ? messages.before : beforeLabel;
    const endCaption = afterLabel === undefined ? messages.after : afterLabel;
    return (
      <div
        ref={ref}
        dir={dir}
        className={cn(
          "ui-image-comparison relative isolate overflow-hidden rounded-lg select-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
          className,
        )}
        style={{ "--ui-compare": `${value}%`, ...style } as CSSProperties}
        {...props}
      >
        <div className="ui-image-comparison-after h-full">{after}</div>
        <div className="ui-image-comparison-before absolute inset-0">{before}</div>
        {startCaption !== null ? (
          <span
            aria-hidden
            className="pointer-events-none absolute start-2 top-2 rounded-sm bg-background/85 px-2 py-0.5 text-xs font-medium text-foreground"
          >
            {startCaption}
          </span>
        ) : null}
        {endCaption !== null ? (
          <span
            aria-hidden
            className="pointer-events-none absolute end-2 top-2 rounded-sm bg-background/85 px-2 py-0.5 text-xs font-medium text-foreground"
          >
            {endCaption}
          </span>
        ) : null}
        <span aria-hidden className="ui-image-comparison-handle">
          <span className="ui-image-comparison-knob" />
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-label={label ?? messages.compareImages}
          aria-valuetext={`${Math.round(value)}%`}
          onChange={(event) => setValue(Number(event.target.value))}
          className="ui-image-comparison-input absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
    );
  },
);
