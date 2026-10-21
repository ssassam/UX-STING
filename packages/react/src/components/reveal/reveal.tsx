"use client";
import { useInView, useMergedRefs } from "@ux-sting/hooks";
import { cn } from "@ux-sting/utils";
import {
  forwardRef,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react";

export type RevealPreset = "fade" | "slide-up" | "slide-start" | "blur" | "scale";

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `div`. */
  as?: ElementType;
  /** Entrance style. Default `slide-up`. */
  preset?: RevealPreset;
  /** Delay in ms. */
  delay?: number;
  /** Reveal direct children one after another, this many ms apart (up to 12 children). */
  stagger?: number;
  /** Fraction of the element that must be visible (0–1). Default 0.15. */
  amount?: number;
  /** Hide again when scrolled out. Default `false` (reveal once). */
  repeat?: boolean;
}

/**
 * Fades content in as it scrolls into view. Content is only hidden when
 * JavaScript runs and motion is allowed, so it is never lost to no-JS
 * visitors, crawlers or reduced-motion users. Use on a few key sections —
 * not on every element.
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as: Tag = "div",
    preset = "slide-up",
    delay = 0,
    stagger,
    amount,
    repeat = false,
    className,
    style,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLElement>(null);
  const merged = useMergedRefs(ref, innerRef);
  const visible = useInView(innerRef, { once: !repeat, amount });
  return (
    <Tag
      ref={merged}
      className={cn("ui-reveal", className)}
      data-preset={preset}
      data-stagger={stagger ? "" : undefined}
      data-visible={visible ? "" : undefined}
      style={
        {
          "--ui-reveal-delay": `${delay}ms`,
          ...(stagger ? { "--ui-reveal-stagger": `${stagger}ms` } : null),
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
});
