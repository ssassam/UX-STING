"use client";
import { HeartIcon, RotateCcwIcon, TruckIcon } from "@ux-sting/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { Badge } from "@ux-sting/react/badge";
import { Button, IconButton } from "@ux-sting/react/button";
import { Price } from "@ux-sting/react/price";
import { ProductDetails } from "@ux-sting/react/product-details";
import { ProductGallery } from "@ux-sting/react/product-gallery";
import { QuantitySelector } from "@ux-sting/react/quantity-selector";
import { Swatch, SwatchGroup } from "@ux-sting/react/swatch";
import { useState } from "react";
import { img } from "./_data";

const images = [
  ["photo-1600166898405-da9535204843", "Berber rug in a living room"],
  ["photo-1554118811-1e0d58224f24", "Rug detail in a café"],
].map(([id, alt]) => ({ src: img(id!, 1000), thumbnail: img(id!, 160), alt: alt! }));

export function ProductPage() {
  const [size, setSize] = useState("160x230");
  return (
    <ProductDetails
      gallery={<ProductGallery images={images} label="Berber rug images" />}
      brand="Atlas Loom"
      badges={<Badge variant="destructive">−20%</Badge>}
      title="Handwoven Berber rug"
      rating={4.8}
      reviewCount={88}
      reviewsHref="#reviews"
      price={
        <Price
          amount={size === "160x230" ? 420 : 690}
          compareAt={size === "160x230" ? 520 : 860}
          currency="EUR"
          size="xl"
        />
      }
      description={
        <p>Knotted by hand from undyed wool in the Middle Atlas. Every rug is one of a kind.</p>
      }
      options={
        <div className="grid gap-2">
          <p id="rug-size" className="text-sm font-medium">
            Size
          </p>
          <SwatchGroup aria-labelledby="rug-size" value={size} onValueChange={setSize}>
            <Swatch value="160x230" label="160 × 230 cm" />
            <Swatch value="200x300" label="200 × 300 cm" />
            <Swatch value="250x350" label="250 × 350 cm" unavailable />
          </SwatchGroup>
        </div>
      }
      actions={
        <>
          <QuantitySelector stock={4} size="lg" />
          <Button size="lg" className="grow">
            Add to cart
          </Button>
          <IconButton aria-label="Save to wishlist" variant="outline" size="lg">
            <HeartIcon />
          </IconButton>
        </>
      }
      info={
        <>
          <p className="flex items-center gap-2">
            <TruckIcon aria-hidden className="size-4" /> Free delivery in 3–5 days
          </p>
          <p className="flex items-center gap-2">
            <RotateCcwIcon aria-hidden className="size-4" /> 30-day returns
          </p>
        </>
      }
      details={
        <Accordion type="single" collapsible>
          <AccordionItem value="materials">
            <AccordionTrigger>Materials & care</AccordionTrigger>
            <AccordionContent>
              100% wool. Vacuum without a beater bar; spot clean only.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping</AccordionTrigger>
            <AccordionContent>Ships rolled in recycled packaging from Marrakech.</AccordionContent>
          </AccordionItem>
        </Accordion>
      }
    />
  );
}
