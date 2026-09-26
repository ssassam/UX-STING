"use client";
import { HeartIcon } from "@ux-sting/icons";
import { BusinessCard } from "@ux-sting/react/business-card";
import { IconButton } from "@ux-sting/react/button";
import { OpenStatus } from "@ux-sting/react/opening-hours";
import { PremiumBadge, VerifiedBadge } from "@ux-sting/react/premium-badge";
import { Tag } from "@ux-sting/react/tag";
import { toast } from "@ux-sting/react/toast";
import NextLink from "next/link";
import { useState } from "react";
import type { Place } from "../lib/data";

const km = (v: number) => (v < 1 ? `${Math.round(v * 1000)} m` : `${v.toFixed(1)} km`);

export function PlaceCard({
  place,
  layout = "vertical",
  headingLevel = 3,
}: {
  place: Place;
  layout?: "vertical" | "horizontal";
  headingLevel?: 2 | 3;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <BusinessCard
      layout={layout}
      headingLevel={headingLevel}
      name={place.name}
      href={`/place/${place.slug}`}
      renderLink={({ href, children, className }) => (
        <NextLink href={href} className={className}>
          {children}
        </NextLink>
      )}
      image={{ src: place.image, alt: "" }}
      category={place.category}
      rating={place.rating}
      reviewCount={place.reviews}
      priceLevel={place.priceLevel}
      priceLevelLabel={
        ["Inexpensive", "Moderate", "Expensive", "Very expensive"][place.priceLevel - 1]
      }
      address={`${place.address}, ${place.area}`}
      distance={km(place.distanceKm)}
      status={<OpenStatus periods={place.hours} />}
      badges={
        place.premium || place.verified ? (
          <>
            {place.premium ? <PremiumBadge size="sm" /> : null}
            {place.verified ? <VerifiedBadge size="sm" /> : null}
          </>
        ) : undefined
      }
      tags={place.amenities.slice(0, 3).map((a) => (
        <Tag key={a} size="sm">
          {a}
        </Tag>
      ))}
      actions={
        <IconButton
          aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
          aria-pressed={saved}
          size="sm"
          variant="secondary"
          shape="circle"
          onClick={() => {
            setSaved(!saved);
            toast(saved ? "Removed from saved" : "Saved", { description: place.name });
          }}
        >
          <HeartIcon className={saved ? "fill-destructive text-destructive" : undefined} />
        </IconButton>
      }
    />
  );
}
