"use client";
import { CartLineItem } from "@ux-sting/react/cart-line-item";
import { useState } from "react";
import { img } from "./_data";

const initial = [
  {
    id: "rug",
    name: "Handwoven Berber rug, 160 × 230 cm",
    image: { src: img("photo-1600166898405-da9535204843", 200), alt: "Berber rug" },
    options: [{ label: "Color", value: "Cream" }],
    price: 420,
    compareAt: 520,
    quantity: 1,
    stock: 2,
    meta: "Only 2 left",
  },
  {
    id: "tagine",
    name: "Ceramic tagine, hand painted",
    image: { src: img("photo-1590502593747-42a996133562", 200), alt: "Ceramic tagine" },
    options: [
      { label: "Size", value: "Large" },
      { label: "Pattern", value: "Fes blue" },
    ],
    price: 38,
    quantity: 2,
  },
];

export function Cart() {
  const [lines, setLines] = useState(initial);
  if (!lines.length) return <p className="text-sm text-muted-foreground">Your cart is empty.</p>;
  return (
    <ul aria-label="Cart" className="max-w-2xl divide-y divide-border">
      {lines.map(({ id, ...line }) => (
        <li key={id}>
          <CartLineItem
            {...line}
            href="#"
            currency="EUR"
            onQuantityChange={(q) =>
              setLines((ls) => ls.map((l) => (l.id === id ? { ...l, quantity: q } : l)))
            }
            onRemove={() => setLines((ls) => ls.filter((l) => l.id !== id))}
          />
        </li>
      ))}
    </ul>
  );
}

export function ReadOnly() {
  const { id: _id, ...line } = initial[1]!;
  return (
    <ul aria-label="Order items" className="max-w-2xl">
      <li>
        <CartLineItem {...line} currency="EUR" readOnly />
      </li>
    </ul>
  );
}
