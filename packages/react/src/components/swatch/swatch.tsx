"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CheckIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useFieldControlProps } from "../../lib/field.js";
import { useMessages } from "../../provider/context.js";

export interface SwatchGroupProps extends Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "orientation"
> {
  invalid?: boolean;
}

/**
 * Product variant picker (color, size, material). A single-select radio group:
 * one tab stop, arrow keys move and select, form-submittable via `name`.
 * Pattern adapted from Storefront UI's product details block (MIT).
 */
export const SwatchGroup = forwardRef<HTMLDivElement, SwatchGroupProps>(function SwatchGroup(
  { className, invalid, loop = true, ...props },
  ref,
) {
  const control = useFieldControlProps({ ...props, "aria-invalid": invalid || undefined });
  const { id: _id, ...rest } = control;
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      orientation="horizontal"
      loop={loop}
      className={cn("flex flex-wrap gap-2", className)}
      {...rest}
    />
  );
});

export interface SwatchProps extends Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "children" | "color"
> {
  /** Accessible and visible name, e.g. "Sand" or "M". */
  label: string;
  /** CSS color (or gradient) for a color swatch. Omit for a text swatch ("S", "M", "L"). */
  color?: string;
  /** Sold out: still listed and announced, but crossed out and not selectable. */
  unavailable?: boolean;
  /** Custom content for text swatches (defaults to `label`). */
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const colorSize = { sm: "size-7", md: "size-9", lg: "size-11" };
const textSize = {
  sm: "h-8 min-w-8 px-2 text-xs",
  md: "h-10 min-w-10 px-3 text-sm",
  lg: "h-12 min-w-12 px-4 text-md",
};

export const Swatch = forwardRef<HTMLButtonElement, SwatchProps>(function Swatch(
  { label, color, unavailable, disabled, size = "md", className, children, ...props },
  ref,
) {
  const messages = useMessages();
  const isColor = color !== undefined;
  const crossOut = unavailable ? (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-[-20%] top-1/2 h-px -rotate-45 bg-muted-foreground"
    />
  ) : null;
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      aria-label={unavailable ? `${label}, ${messages.unavailable}` : label}
      title={label}
      disabled={disabled || unavailable}
      className={cn(
        "ui-hit-area group/swatch relative inline-flex shrink-0 items-center justify-center overflow-hidden outline-none transition-[box-shadow,border-color,background-color] duration-(--ui-duration-fast)",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed",
        isColor
          ? cn(
              "rounded-full border border-border-strong",
              "data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background",
              colorSize[size],
            )
          : cn(
              "rounded-md border border-input bg-background font-medium text-foreground tabular-nums",
              "hover:border-border-strong data-[state=checked]:border-primary data-[state=checked]:bg-primary-subtle data-[state=checked]:text-primary-subtle-foreground data-[state=checked]:ring-1 data-[state=checked]:ring-primary",
              "disabled:text-muted-foreground",
              textSize[size],
            ),
        className,
      )}
      {...props}
    >
      {isColor ? (
        <>
          <span aria-hidden className="absolute inset-0" style={{ background: color }} />
          <RadioGroupPrimitive.Indicator className="relative flex size-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-xs [&_svg]:size-3">
            <CheckIcon />
          </RadioGroupPrimitive.Indicator>
        </>
      ) : (
        <span aria-hidden className={cn(unavailable && "opacity-60")}>
          {children ?? label}
        </span>
      )}
      {crossOut}
    </RadioGroupPrimitive.Item>
  );
});
