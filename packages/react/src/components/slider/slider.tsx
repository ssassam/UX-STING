"use client";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@ux-sting/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useLocale } from "../../provider/context.js";

export interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Accessible names for each thumb, e.g. `["Minimum price", "Maximum price"]`. */
  thumbLabels?: string[];
  /** Formats the value for `aria-valuetext` and the optional visible output. */
  formatValue?: (value: number) => string;
  showValue?: boolean;
}

/**
 * Select a value (or a range with two thumbs) along a track. Keyboard:
 * arrows, PageUp/Down, Home/End; mirrored in RTL.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { className, thumbLabels, formatValue, showValue, value, defaultValue, ...props },
  ref,
) {
  const { dir } = useLocale();
  const values = value ?? defaultValue ?? [props.min ?? 0];
  return (
    <div className={cn("grid gap-2", className)}>
      <SliderPrimitive.Root
        ref={ref}
        dir={dir}
        value={value}
        defaultValue={defaultValue}
        className="relative flex w-full touch-none select-none items-center py-2 data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
          <SliderPrimitive.Range className="absolute h-full bg-primary data-[orientation=vertical]:w-full" />
        </SliderPrimitive.Track>
        {values.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={thumbLabels?.[i] ?? props["aria-label"]}
            aria-valuetext={formatValue ? formatValue(v) : undefined}
            className={cn(
              "ui-hit-area block size-5 rounded-full border-2 border-primary bg-background shadow-sm transition-[box-shadow]",
              "outline-none hover:ring-4 hover:ring-ring/20 focus-visible:ring-4 focus-visible:ring-ring/40 disabled:pointer-events-none",
            )}
          />
        ))}
      </SliderPrimitive.Root>
      {showValue ? (
        <output className="text-sm tabular-nums text-muted-foreground">
          {values.map((v) => (formatValue ? formatValue(v) : v)).join(" – ")}
        </output>
      ) : null}
    </div>
  );
});

/** Two-thumb slider for ranges (price, dates). */
export const RangeSlider = forwardRef<HTMLSpanElement, SliderProps>(function RangeSlider(
  { defaultValue, minStepsBetweenThumbs = 1, ...props },
  ref,
) {
  return (
    <Slider
      ref={ref}
      defaultValue={defaultValue ?? (props.value ? undefined : [props.min ?? 0, props.max ?? 100])}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      {...props}
    />
  );
});
