"use client";
import { HeartIcon } from "@ux-sting/icons";
import { HotelCard } from "@ux-sting/react/business-card";
import { IconButton } from "@ux-sting/react/button";
import { FeaturedBadge } from "@ux-sting/react/premium-badge";
import { Price } from "@ux-sting/react/price";
import { Tag } from "@ux-sting/react/tag";
import { toast } from "@ux-sting/react/toast";
import NextLink from "next/link";
import { useState } from "react";
import { CURRENCY, getDestination, type Stay } from "../lib/data";
import { sized } from "../lib/photos";

export function StayCard({
  stay,
  layout = "vertical",
  headingLevel = 3,
}: {
  stay: Stay;
  layout?: "vertical" | "horizontal";
  headingLevel?: 2 | 3;
}) {
  const [saved, setSaved] = useState(false);
  const destination = getDestination(stay.destination);
  return (
    <HotelCard
      layout={layout}
      headingLevel={headingLevel}
      name={stay.name}
      href={`/stays/${stay.id}`}
      renderLink={({ href, children, className }) => (
        <NextLink href={href} className={className}>
          {children}
        </NextLink>
      )}
      image={{ src: sized(stay.image, 960), alt: "" }}
      stars={stay.stars}
      category={`${stay.type} · ${stay.stars}-star`}
      rating={stay.rating}
      reviewCount={stay.reviews}
      address={`${stay.area}, ${destination?.name ?? ""}`}
      distance={stay.distance}
      badges={stay.featured ? <FeaturedBadge size="sm">Guest favourite</FeaturedBadge> : undefined}
      tags={
        <>
          {stay.freeCancellation ? (
            <Tag size="sm" variant="success">
              Free cancellation
            </Tag>
          ) : null}
          {stay.amenities.slice(0, 2).map((a) => (
            <Tag key={a} size="sm">
              {a}
            </Tag>
          ))}
        </>
      }
      nightlyPrice={
        <Price
          amount={stay.nightly}
          compareAt={stay.compareAt}
          currency={CURRENCY}
          period="/ night"
          fractionDigits={0}
        />
      }
      actions={
        <IconButton
          aria-label={saved ? `Remove ${stay.name} from saved` : `Save ${stay.name}`}
          aria-pressed={saved}
          size="sm"
          variant="secondary"
          shape="circle"
          onClick={() => {
            setSaved(!saved);
            toast(saved ? "Removed from saved" : "Saved to your wishlist", {
              description: stay.name,
            });
          }}
        >
          <HeartIcon className={saved ? "fill-destructive text-destructive" : undefined} />
        </IconButton>
      }
    />
  );
}
