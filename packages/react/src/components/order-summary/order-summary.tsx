"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { useLocale, useMessages } from "../../provider/context.js";

export interface OrderSummaryLine {
  label: ReactNode;
  /** Amount in currency units. Discounts are given as positive numbers with `kind: "discount"`. */
  amount: number;
  /** `discount` renders as a deduction (−) with success styling and text. */
  kind?: "default" | "discount";
  /** Replaces the formatted amount, e.g. "Free" or "Calculated at checkout". */
  display?: ReactNode;
  /** Small secondary text under the label (e.g. a promo code). */
  hint?: ReactNode;
}

export interface OrderSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** ISO 4217 code. */
  currency: string;
  lines: OrderSummaryLine[];
  /** Grand total. Computed from `lines` when omitted. */
  total?: number;
  /** Heading text (defaults to "Order summary"); `null` hides the heading. */
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  totalLabel?: ReactNode;
  /** Text under the total, e.g. "Taxes included". */
  note?: ReactNode;
  locale?: string;
  /** Promo-code field, checkout button, trust badges… rendered below the total. */
  children?: ReactNode;
}

/**
 * Cart and checkout totals as a description list: subtotal, discounts,
 * shipping, tax and a prominent total. Amounts are locale-formatted with
 * tabular figures; discounts read as deductions in text, not only by color.
 * Adapted from the Storefront UI OrderSummary block (MIT).
 */
export const OrderSummary = forwardRef<HTMLElement, OrderSummaryProps>(function OrderSummary(
  {
    currency,
    lines,
    total: totalProp,
    title,
    headingLevel = 2,
    totalLabel,
    note,
    locale: localeProp,
    className,
    children,
    ...props
  },
  ref,
) {
  const { locale } = useLocale();
  const messages = useMessages();
  const fmt = new Intl.NumberFormat(localeProp ?? locale, { style: "currency", currency });
  const total =
    totalProp ??
    lines.reduce((sum, l) => sum + (l.kind === "discount" ? -Math.abs(l.amount) : l.amount), 0);
  const Heading = `h${headingLevel}` as const;
  const headingId = `order-summary${useId().replace(/:/g, "")}`;
  const showHeading = title !== null;

  return (
    <section
      ref={ref}
      aria-labelledby={showHeading ? headingId : undefined}
      aria-label={showHeading ? undefined : messages.orderSummary}
      className={cn(
        "grid gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-6",
        className,
      )}
      {...props}
    >
      {showHeading ? (
        <Heading id={headingId} className="text-lg font-semibold text-balance">
          {title ?? messages.orderSummary}
        </Heading>
      ) : null}
      <dl className="grid gap-2.5 text-sm">
        {lines.map((line, i) => {
          const discount = line.kind === "discount";
          return (
            <div key={i} className="flex items-start justify-between gap-4">
              <dt className="grid gap-0.5 text-muted-foreground">
                <span>{line.label}</span>
                {line.hint ? <span className="text-xs">{line.hint}</span> : null}
              </dt>
              <dd
                className={cn(
                  "shrink-0 text-end tabular-nums",
                  discount ? "font-medium text-success" : "text-foreground",
                )}
              >
                {line.display ??
                  (discount ? `−${fmt.format(Math.abs(line.amount))}` : fmt.format(line.amount))}
              </dd>
            </div>
          );
        })}
        <div className="mt-1.5 flex items-baseline justify-between gap-4 border-t border-border pt-4">
          <dt className="text-md font-semibold text-foreground">{totalLabel ?? messages.total}</dt>
          <dd className="text-xl font-semibold tabular-nums text-foreground">
            {fmt.format(total)}
          </dd>
        </div>
      </dl>
      {note ? <p className="-mt-2 text-end text-xs text-muted-foreground">{note}</p> : null}
      {children ? <div className="grid gap-3">{children}</div> : null}
    </section>
  );
});
