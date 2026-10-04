"use client";
import { useInView, useTween } from "@ux-sting/hooks";
import { cn, springs, type SpringConfig } from "@ux-sting/utils";
import { forwardRef, useRef, type HTMLAttributes } from "react";
import { useLocale } from "../../provider/context.js";

export interface AnimatedNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  /** Start value for the first animation, played when the number scrolls into view. Omit to only animate later changes. */
  from?: number;
  /** Intl number format options (currency, percent, compact, units). */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  /** Duration in ms for the eased tween. Ignored when `spring` is set. Default 900. */
  duration?: number;
  /** Spring physics instead of a fixed duration: a preset name or a config. */
  spring?: keyof typeof springs | SpringConfig;
}

function decimalsOf(n: number): number {
  return (String(n).split(".")[1] ?? "").length;
}

/**
 * A number that counts to its value — for KPIs, prices and live totals.
 * Screen readers get the final, formatted value only (never the intermediate
 * frames), figures are tabular so the width stays stable, and reduced motion
 * shows the value instantly.
 */
export const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  function AnimatedNumber(
    { value, from, formatOptions, locale: localeProp, duration = 900, spring, className, ...props },
    ref,
  ) {
    const { locale } = useLocale();
    const local = useRef<HTMLSpanElement>(null);
    const inView = useInView(local);
    const springConfig = typeof spring === "string" ? springs[spring] : spring;
    const display = useTween(from !== undefined && !inView ? from : value, {
      from,
      duration,
      spring: springConfig,
    });

    const options: Intl.NumberFormatOptions = { ...formatOptions };
    const hasDigits =
      options.minimumFractionDigits !== undefined ||
      options.maximumFractionDigits !== undefined ||
      options.maximumSignificantDigits !== undefined;
    if (!hasDigits && options.style !== "currency" && options.notation !== "compact") {
      // Keep frames at the target's precision so digits don't jitter.
      options.minimumFractionDigits = options.maximumFractionDigits = decimalsOf(value);
    }
    const format = new Intl.NumberFormat(localeProp ?? locale, options);

    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        <span ref={local} aria-hidden>
          {format.format(display)}
        </span>
        <span className="sr-only">{format.format(value)}</span>
      </span>
    );
  },
);
