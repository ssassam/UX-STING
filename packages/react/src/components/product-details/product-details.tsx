"use client";
import { cn } from "@ux-sting/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import { ReviewStars } from "../rating/rating.js";

export interface ProductDetailsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Media column, usually a ProductGallery. */
  gallery: ReactNode;
  /** Product name, rendered as the page's `h1`. */
  title: ReactNode;
  brand?: ReactNode;
  rating?: number;
  reviewCount?: number;
  /** Link target for the rating (e.g. "#reviews"). */
  reviewsHref?: string;
  /** Price element, e.g. `<Price amount={89} compareAt={120} currency="EUR" size="xl" />`. */
  price: ReactNode;
  /** Badges next to the brand ("New", "−25%"). */
  badges?: ReactNode;
  /** Short description under the price. */
  description?: ReactNode;
  /** Variant pickers (labelled SwatchGroups) between description and actions. */
  options?: ReactNode;
  /** QuantitySelector + add-to-cart + wishlist row. */
  actions?: ReactNode;
  /** Delivery, returns, stock — small reassurance lines under the actions. */
  info?: ReactNode;
  /** Details below (an Accordion with description, materials, care). */
  details?: ReactNode;
  /**
   * Heading for the details, visually hidden by default so Accordion headings (h3)
   * sit under an h2. Defaults to "Product details".
   */
  detailsTitle?: ReactNode;
}

/**
 * Product page layout: gallery beside a buy box (brand, title, rating,
 * price, options, quantity and add to cart), stacked on phones with the
 * gallery first. The buy box stays in view while long galleries scroll on
 * desktop.
 * Adapted from the Storefront UI product details block (MIT).
 */
export const ProductDetails = forwardRef<HTMLElement, ProductDetailsProps>(function ProductDetails(
  {
    gallery,
    title,
    brand,
    rating,
    reviewCount,
    reviewsHref,
    price,
    badges,
    description,
    options,
    actions,
    info,
    details,
    detailsTitle,
    className,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const stars =
    rating !== undefined ? <ReviewStars value={rating} count={reviewCount} showValue /> : null;
  return (
    <article ref={ref} className={cn("grid gap-8 md:grid-cols-2 lg:gap-12", className)} {...props}>
      <div className="min-w-0">{gallery}</div>
      <div className="grid content-start gap-5 md:sticky md:top-(--ui-sticky-offset,5rem) md:self-start">
        <div className="grid gap-2">
          {brand || badges ? (
            <div className="flex flex-wrap items-center gap-2">
              {brand ? <p className="text-sm font-medium text-muted-foreground">{brand}</p> : null}
              {badges}
            </div>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {title}
          </h1>
          {stars ? (
            reviewsHref ? (
              <a
                href={reviewsHref}
                className="justify-self-start rounded-xs outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {stars}
              </a>
            ) : (
              stars
            )
          ) : null}
        </div>
        <div>{price}</div>
        {description ? (
          <div className="text-md text-muted-foreground [&_p]:max-w-prose">{description}</div>
        ) : null}
        {options ? <div className="grid gap-5">{options}</div> : null}
        {actions ? <div className="flex flex-wrap items-start gap-3">{actions}</div> : null}
        {info ? <div className="grid gap-2 text-sm text-muted-foreground">{info}</div> : null}
        {details ? (
          <section className="border-t border-border pt-2">
            <h2 className="sr-only">{detailsTitle ?? messages.productDetails}</h2>
            {details}
          </section>
        ) : null}
      </div>
    </article>
  );
});
