"use client";
import { useInView, useMergedRefs, usePrefersReducedMotion } from "@ux-sting/hooks";
import { cn } from "@ux-sting/utils";
import { forwardRef, useEffect, useMemo, useRef, useState, type HTMLAttributes } from "react";
import { useLocale } from "../../provider/context.js";

export interface AnimatedNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  /** Starting value of the first count. Default 0. */
  from?: number;
  /** `Intl.NumberFormat` options: currency, percent, compact, fraction digits… */
  format?: Intl.NumberFormatOptions;
  /** Overrides the provider locale. */
  locale?: string;
  /** Duration in ms. Default 900. */
  duration?: number;
  /** Wait until the number scrolls into view before counting. Default `true`. */
  startOnView?: boolean;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts up (or down) to a value with locale formatting and tabular figures,
 * so digits don't jitter. Later `value` changes animate from the previous
 * value. Assistive tech and reduced motion get the final value only.
 */
export const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  function AnimatedNumber(
    {
      value,
      from = 0,
      format,
      locale: localeProp,
      duration = 900,
      startOnView = true,
      className,
      ...props
    },
    ref,
  ) {
    const { locale } = useLocale();
    const innerRef = useRef<HTMLSpanElement>(null);
    const merged = useMergedRefs(ref, innerRef);
    const reduced = usePrefersReducedMotion();
    const inView = useInView(innerRef);
    const started = !startOnView || inView;
    const [display, setDisplay] = useState(from);
    const lastRef = useRef(from);

    const formatter = useMemo(
      () => new Intl.NumberFormat(localeProp ?? locale, format),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- options are compared by value
      [localeProp, locale, JSON.stringify(format)],
    );

    useEffect(() => {
      if (!started) return;
      const start = lastRef.current;
      if (reduced || duration <= 0 || start === value) {
        lastRef.current = value;
        setDisplay(value);
        return;
      }
      let frame = 0;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const next = start + (value - start) * easeOutCubic(t);
        lastRef.current = next;
        setDisplay(next);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [started, value, reduced, duration]);

    return (
      <span ref={merged} className={cn("tabular-nums", className)} {...props}>
        <span className="sr-only">{formatter.format(value)}</span>
        <span aria-hidden>{formatter.format(display)}</span>
      </span>
    );
  },
);
