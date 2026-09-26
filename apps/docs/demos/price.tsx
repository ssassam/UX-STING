"use client";
import { Currency, Price, PriceLevel, PriceRange } from "@ux-sting/react/price";

export function Variants() {
  return (
    <div className="grid gap-3">
      <Price amount={49} currency="USD" compareAt={69} size="lg" />
      <Price amount={120} currency="EUR" period="/ night" />
      <Price amount={899} currency="MAD" size="xl" />
      <PriceRange min={40} max={180} currency="EUR" />
      <PriceLevel level={2} label="Moderate" />
      <p className="text-sm">
        Delivery fee: <Currency value={2.5} currency="GBP" />
      </p>
    </div>
  );
}
