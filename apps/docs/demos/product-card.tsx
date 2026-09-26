"use client";
import { Badge } from "@ux-sting/react/badge";
import { Button, IconButton } from "@ux-sting/react/button";
import { Price } from "@ux-sting/react/price";
import { ProductCard } from "@ux-sting/react/product-card";
import { HeartIcon, ShoppingCartIcon } from "@ux-sting/icons";
import { img } from "./_data";

const products = [
  {
    name: "Handwoven Berber rug, 160 × 230 cm",
    brand: "Atlas Loom",
    price: 420,
    compareAt: 520,
    rating: 4.8,
    reviews: 88,
    img: "photo-1600166898405-da9535204843",
  },
  {
    name: "Ceramic tagine, hand painted",
    brand: "Safi Clay",
    price: 38,
    rating: 4.6,
    reviews: 214,
    img: "photo-1590502593747-42a996133562",
  },
  {
    name: "Argan oil, organic 100 ml",
    brand: "Souss",
    price: 19,
    rating: 4.9,
    reviews: 1320,
    img: "photo-1608571423902-eed4a5ad8108",
  },
];

export function Grid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.name}
          href="#"
          name={p.name}
          brand={p.brand}
          image={{ src: img(p.img, 600), alt: p.name }}
          price={<Price amount={p.price} currency="EUR" compareAt={p.compareAt} />}
          rating={p.rating}
          reviewCount={p.reviews}
          badges={p.compareAt ? <Badge variant="destructive">Sale</Badge> : undefined}
          secondaryAction={
            <IconButton aria-label={`Save ${p.name}`} size="sm" variant="secondary" shape="circle">
              <HeartIcon />
            </IconButton>
          }
          action={
            <Button size="sm" fullWidth variant="outline" startIcon={<ShoppingCartIcon />}>
              Add to cart
            </Button>
          }
        />
      ))}
    </div>
  );
}
