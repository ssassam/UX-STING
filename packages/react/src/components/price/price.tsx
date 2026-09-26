"use client";
import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useLocale } from "../../provider/context.js";

export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  amount: number;
  /** ISO 4217 code, e.g. "USD", "EUR", "MAD". */
  currency: string;
  /** Previous price; rendered struck through with an accessible label. */
  compareAt?: number;
  /** Suffix such as "/ night" or "per month". */
  period?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Label for the previous price (localize). */
  compareAtLabel?: string;
  fractionDigits?: number;
  locale?: string;
}

const sizeClass = { sm: "text-sm", md: "text-md", lg: "text-xl", xl: "text-3xl" };

/** Locale-aware price with optional discount and period. Tabular figures. */
export const Price = forwardRef<HTMLSpanElement, PriceProps>(function Price(
  {
    amount,
    currency,
    compareAt,
    period,
    size = "md",
    compareAtLabel = "Original price",
    fractionDigits,
    locale: localeProp,
    className,
    ...props
  },
  ref,
) {
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(localeProp ?? locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return (
    <span
      ref={ref}
      className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}
      {...props}
    >
      <span className={cn("font-semibold tabular-nums text-foreground", sizeClass[size])}>
        {fmt.format(amount)}
      </span>
      {compareAt !== undefined && compareAt > amount ? (
        <span className="text-sm tabular-nums text-muted-foreground line-through">
          <span className="sr-only">{compareAtLabel}: </span>
          {fmt.format(compareAt)}
        </span>
      ) : null}
      {period ? <span className="text-sm text-muted-foreground">{period}</span> : null}
    </span>
  );
});

export interface PriceRangeProps extends HTMLAttributes<HTMLSpanElement> {
  min: number;
  max: number;
  currency: string;
  fractionDigits?: number;
}

export const PriceRange = forwardRef<HTMLSpanElement, PriceRangeProps>(function PriceRange(
  { min, max, currency, fractionDigits = 0, className, ...props },
  ref,
) {
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
  const text =
    typeof fmt.formatRange === "function"
      ? fmt.formatRange(min, max)
      : `${fmt.format(min)} – ${fmt.format(max)}`;
  return (
    <span ref={ref} className={cn("font-medium tabular-nums", className)} {...props}>
      {text}
    </span>
  );
});

export interface PriceLevelProps extends HTMLAttributes<HTMLSpanElement> {
  /** 1–max, e.g. 2 renders "$$" of "$$$$". */
  level: number;
  max?: number;
  symbol?: string;
  /** Accessible text, e.g. "Moderate price" (localize). */
  label?: string;
}

/** Relative price indicator ($ – $$$$) for places and restaurants. */
export const PriceLevel = forwardRef<HTMLSpanElement, PriceLevelProps>(function PriceLevel(
  { level, max = 4, symbol = "$", label, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="img"
      aria-label={label ?? `Price level ${level} of ${max}`}
      className={cn("inline-flex font-medium tracking-wider", className)}
      {...props}
    >
      <span aria-hidden className="text-foreground">
        {symbol.repeat(level)}
      </span>
      <span aria-hidden className="text-border-strong">
        {symbol.repeat(Math.max(0, max - level))}
      </span>
    </span>
  );
});

/** Formats a number as currency inline: `<Currency value={12} currency="EUR" />`. */
export function Currency({
  value,
  currency,
  fractionDigits,
  className,
}: {
  value: number;
  currency: string;
  fractionDigits?: number;
  className?: string;
}) {
  const { locale } = useLocale();
  return (
    <span className={cn("tabular-nums", className)}>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value)}
    </span>
  );
}
