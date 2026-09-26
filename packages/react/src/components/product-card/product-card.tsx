import { cn } from "@unified-ui/utils";
import type { ReactNode } from "react";
import { Card, CardLink } from "../card/card.js";
import { Image } from "../media/image.js";
import { ReviewStars } from "../rating/rating.js";

export interface ProductCardProps {
  name: string;
  href?: string;
  image: { src: string; alt: string };
  /** Price element, e.g. `<Price amount={49} currency="USD" compareAt={69} />`. */
  price: ReactNode;
  brand?: ReactNode;
  rating?: number;
  reviewCount?: number;
  badges?: ReactNode;
  /** Primary action (add to cart). */
  action?: ReactNode;
  /** Secondary action over the image (wishlist). */
  secondaryAction?: ReactNode;
  /** e.g. "Only 3 left" or color swatches. */
  meta?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Marketplace product tile with stretched link and independent actions. */
export function ProductCard({
  name,
  href,
  image,
  price,
  brand,
  rating,
  reviewCount,
  badges,
  action,
  secondaryAction,
  meta,
  headingLevel = 3,
  className,
}: ProductCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Card interactive={Boolean(href)} variant="ghost" className={cn("gap-3 rounded-xl", className)}>
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          ratio={1}
          radius="none"
          className="transition-transform duration-(--ui-duration-slow) group-hover/card:scale-[1.03]"
        />
        {badges ? (
          <div className="absolute start-2 top-2 flex flex-wrap gap-1">{badges}</div>
        ) : null}
        {secondaryAction ? (
          <div className="absolute end-2 top-2 z-[2]">{secondaryAction}</div>
        ) : null}
      </div>
      <div className="grid gap-1 px-0.5">
        {brand ? <p className="text-xs text-muted-foreground">{brand}</p> : null}
        <Heading className="line-clamp-2 text-sm font-medium text-foreground">
          {href ? (
            <CardLink href={href} className="after:z-[1]">
              {name}
            </CardLink>
          ) : (
            name
          )}
        </Heading>
        {rating !== undefined ? <ReviewStars value={rating} size="sm" count={reviewCount} /> : null}
        <div className="mt-1">{price}</div>
        {meta}
      </div>
      {action ? <div className="relative z-[2] mt-auto">{action}</div> : null}
    </Card>
  );
}
