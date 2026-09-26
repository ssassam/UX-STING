"use client";
import {
  BusinessCard,
  HotelCard,
  RestaurantCard,
  ServiceCard,
} from "@ux-sting/react/business-card";
import { IconButton } from "@ux-sting/react/button";
import { OpenStatus } from "@ux-sting/react/opening-hours";
import { PremiumBadge, VerifiedBadge } from "@ux-sting/react/premium-badge";
import { Price } from "@ux-sting/react/price";
import { Tag } from "@ux-sting/react/tag";
import { HeartIcon } from "@ux-sting/icons";
import { img } from "./_data";

const periods = [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open: "08:00", close: "22:00" }));
const save = (
  <IconButton aria-label="Save" size="sm" variant="secondary" shape="circle">
    <HeartIcon />
  </IconButton>
);

export function Presets() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RestaurantCard
        name="La Sqala"
        href="#"
        image={{ src: img("photo-1517248135467-4c7edcad34c4", 600), alt: "Restaurant courtyard" }}
        cuisine="Moroccan · Brunch"
        rating={4.7}
        reviewCount={2310}
        priceLevel={2}
        address="Boulevard des Almohades"
        distance="1.2 km"
        status={<OpenStatus periods={periods} />}
        badges={<PremiumBadge size="sm" />}
        actions={save}
      />
      <HotelCard
        name="Riad Zitoun"
        href="#"
        image={{ src: img("photo-1566073771259-6a8506099945", 600), alt: "Riad pool" }}
        stars={4}
        rating={4.9}
        reviewCount={412}
        address="Medina, Marrakech"
        nightlyPrice={<Price amount={140} currency="EUR" period="/ night" compareAt={180} />}
        badges={<VerifiedBadge size="sm" />}
        actions={save}
      />
      <ServiceCard
        name="Karim Plumbing"
        href="#"
        category="Plumber"
        rating={4.8}
        reviewCount={96}
        address="Serves Casablanca & Mohammedia"
        responseTime="Usually responds within 1 hour"
        startingPrice="From 200 MAD"
        tags={
          <>
            <Tag size="sm">Emergency</Tag>
            <Tag size="sm">Licensed</Tag>
          </>
        }
      />
    </div>
  );
}

export function Horizontal() {
  return (
    <BusinessCard
      layout="horizontal"
      name="Café Atlas"
      href="#"
      image={{ src: img("photo-1554118811-1e0d58224f24", 600), alt: "Café interior" }}
      category="Coffee shop"
      rating={4.6}
      reviewCount={128}
      priceLevel={1}
      address="12 Rue de Fès"
      distance="850 m"
      status={<OpenStatus periods={periods} />}
      tags={
        <>
          <Tag size="sm">Wi-Fi</Tag>
          <Tag size="sm">Terrace</Tag>
        </>
      }
      className="max-w-2xl"
    />
  );
}
