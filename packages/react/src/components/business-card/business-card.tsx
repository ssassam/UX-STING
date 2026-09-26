import { cn } from "@unified-ui/utils";
import type { ReactNode } from "react";
import { Card, CardLink } from "../card/card.js";
import { Image } from "../media/image.js";
import { Location } from "../location/location.js";
import { PriceLevel } from "../price/price.js";
import { ReviewStars } from "../rating/rating.js";

export interface BusinessCardProps {
  name: string;
  href?: string;
  image?: { src: string; alt: string };
  /** Category label, e.g. "Italian restaurant". */
  category?: ReactNode;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  priceLevelLabel?: string;
  address?: ReactNode;
  distance?: ReactNode;
  /** Open status element, e.g. `<OpenStatus periods={…} />`. */
  status?: ReactNode;
  /** Badges over the image (e.g. `<PremiumBadge />`). */
  badges?: ReactNode;
  /** Short highlights (tags). */
  tags?: ReactNode;
  /** Extra details slot (price per night, cuisine, response time…). */
  meta?: ReactNode;
  /** Actions (save/favorite button). Rendered above the card link. */
  actions?: ReactNode;
  layout?: "vertical" | "horizontal";
  headingLevel?: 2 | 3 | 4;
  className?: string;
  /** Render the title link via a router component. */
  renderLink?: (props: { href: string; children: ReactNode; className: string }) => ReactNode;
}

/**
 * Generic listing card for local businesses and places. The entire card is
 * clickable through one stretched link; secondary actions stay independently
 * focusable. Presets: PlaceCard, RestaurantCard, HotelCard, ServiceCard.
 */
export function BusinessCard({
  name,
  href,
  image,
  category,
  rating,
  reviewCount,
  priceLevel,
  priceLevelLabel,
  address,
  distance,
  status,
  badges,
  tags,
  meta,
  actions,
  layout = "vertical",
  headingLevel = 3,
  className,
  renderLink,
}: BusinessCardProps) {
  const Heading = `h${headingLevel}` as const;
  const linkClass = "outline-none after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring hover:underline underline-offset-2";
  const title = href ? (renderLink ? renderLink({ href, children: name, className: linkClass }) : <CardLink href={href} className={linkClass}>{name}</CardLink>) : name;
  return (
    <Card interactive={Boolean(href)} className={cn(layout === "horizontal" && "sm:flex-row", className)}>
      {image ? (
        <div className={cn("relative shrink-0", layout === "horizontal" ? "sm:w-56" : "")}>
          <Image src={image.src} alt={image.alt} ratio={layout === "horizontal" ? undefined : 4 / 3} radius="none" containerClassName={cn(layout === "horizontal" && "h-full min-h-40")} />
          {badges ? <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">{badges}</div> : null}
          {actions ? <div className="absolute end-3 top-3 z-[2] flex gap-1.5">{actions}</div> : null}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {category ? <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{category}</p> : null}
        <Heading className="text-md font-semibold leading-snug text-foreground">{title}</Heading>
        {rating !== undefined || priceLevel !== undefined ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {rating !== undefined ? <ReviewStars value={rating} size="sm" showValue count={reviewCount} /> : null}
            {priceLevel !== undefined ? <PriceLevel level={priceLevel} label={priceLevelLabel} className="text-sm" /> : null}
          </div>
        ) : null}
        {address ? <Location address={address} distance={distance} /> : null}
        {status}
        {meta}
        {tags ? <div className="mt-1 flex flex-wrap gap-1.5">{tags}</div> : null}
        {!image && actions ? <div className="relative z-[2] mt-auto flex gap-2 pt-2">{actions}</div> : null}
      </div>
    </Card>
  );
}

/** Generic place (park, museum, venue). */
export function PlaceCard(props: BusinessCardProps) {
  return <BusinessCard {...props} />;
}

export interface RestaurantCardProps extends BusinessCardProps {
  cuisine?: ReactNode;
}

/** Restaurant preset: cuisine as category, price level emphasised. */
export function RestaurantCard({ cuisine, category, ...props }: RestaurantCardProps) {
  return <BusinessCard category={cuisine ?? category} {...props} />;
}

export interface HotelCardProps extends BusinessCardProps {
  /** e.g. `<Price amount={120} currency="EUR" period="/ night" />`. */
  nightlyPrice?: ReactNode;
  /** Hotel class, 1–5. */
  stars?: number;
}

/** Hotel preset: nightly price and hotel class. */
export function HotelCard({ nightlyPrice, stars, meta, category, ...props }: HotelCardProps) {
  return (
    <BusinessCard
      category={category ?? (stars ? `${"★".repeat(stars)}` : undefined)}
      meta={
        <>
          {meta}
          {nightlyPrice ? <div className="mt-auto pt-1">{nightlyPrice}</div> : null}
        </>
      }
      {...props}
    />
  );
}

export interface ServiceCardProps extends BusinessCardProps {
  /** e.g. "From €40". */
  startingPrice?: ReactNode;
  /** e.g. "Responds within 1 hour". */
  responseTime?: ReactNode;
}

/** Service provider preset (plumber, tutor, salon). */
export function ServiceCard({ startingPrice, responseTime, meta, ...props }: ServiceCardProps) {
  return (
    <BusinessCard
      meta={
        <>
          {meta}
          {responseTime ? <p className="text-sm text-muted-foreground">{responseTime}</p> : null}
          {startingPrice ? <p className="text-sm font-semibold">{startingPrice}</p> : null}
        </>
      }
      {...props}
    />
  );
}
