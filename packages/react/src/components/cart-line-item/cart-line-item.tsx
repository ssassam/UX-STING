"use client";
import { Trash2Icon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import { IconButton } from "../button/button.js";
import { Image } from "../media/image.js";
import { Price } from "../price/price.js";
import { QuantitySelector } from "../quantity-selector/quantity-selector.js";

export interface CartLineItemOption {
  label: string;
  value: string;
}

export interface CartLineItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  name: string;
  href?: string;
  image: { src: string; alt: string };
  /** Chosen variant, e.g. `[{ label: "Color", value: "Sand" }, { label: "Size", value: "M" }]`. */
  options?: CartLineItemOption[];
  /** Unit price. The line shows unit price × quantity. */
  price: number;
  /** Previous unit price (sale). */
  compareAt?: number;
  /** ISO 4217 code. */
  currency: string;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  /** Units available; caps the quantity. */
  stock?: number;
  onRemove?: () => void;
  /** Small note such as "Only 2 left" or "Ships in 3 days". */
  meta?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** Read-only line (order confirmation): shows "Qty: n" instead of the control. */
  readOnly?: boolean;
  /** Label for the read-only quantity. Default "Quantity". */
  quantityLabel?: string;
}

/**
 * One product in a cart or order: image, name, chosen options, line price,
 * quantity control and remove. Wrap lines in a `<ul>` with `<li>` per item.
 * Adapted from the Storefront UI cart line block (MIT).
 */
export const CartLineItem = forwardRef<HTMLDivElement, CartLineItemProps>(function CartLineItem(
  {
    name,
    href,
    image,
    options,
    price,
    compareAt,
    currency,
    quantity,
    onQuantityChange,
    stock,
    onRemove,
    meta,
    headingLevel = 3,
    readOnly,
    quantityLabel,
    className,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 py-4 sm:grid-cols-[6rem_1fr_auto]",
        className,
      )}
      {...props}
    >
      <Image
        src={image.src}
        alt={image.alt}
        ratio={1}
        radius="md"
        className="row-span-2 bg-muted sm:row-span-1"
      />
      <div className="grid min-w-0 content-start gap-1">
        <Heading className="line-clamp-2 text-sm font-medium text-foreground">
          {href ? (
            <a
              href={href}
              className="rounded-xs outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </Heading>
        {options?.length ? (
          <dl className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {options.map((o) => (
              <div key={o.label} className="flex gap-1">
                <dt>{o.label}:</dt>
                <dd className="text-foreground">{o.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      <div className="col-start-2 flex flex-wrap items-center justify-between gap-3 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end sm:justify-start">
        <Price
          amount={price * quantity}
          compareAt={compareAt !== undefined ? compareAt * quantity : undefined}
          currency={currency}
          className="sm:justify-end"
        />
        <div className="flex items-center gap-1">
          {readOnly ? (
            <span className="text-sm text-muted-foreground tabular-nums">
              {quantityLabel ?? messages.quantity}: {quantity}
            </span>
          ) : (
            <QuantitySelector
              size="sm"
              value={quantity}
              onValueChange={onQuantityChange}
              max={stock}
              aria-label={`${messages.quantity}, ${name}`}
            />
          )}
          {onRemove && !readOnly ? (
            <IconButton
              aria-label={messages.removeItem(name)}
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2Icon />
            </IconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
});
