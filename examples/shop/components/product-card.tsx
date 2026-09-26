"use client";
import { PlusIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { IconButton } from "@ux-sting/react/button";
import { CardLink } from "@ux-sting/react/card";
import { Price } from "@ux-sting/react/price";
import { ReviewStars } from "@ux-sting/react/rating";
import { toast } from "@ux-sting/react/toast";
import NextLink from "next/link";
import { useCart } from "../app/providers";
import { CURRENCY, type Product } from "../lib/data";
import { sized } from "../lib/photos";

export function ProductCard({
  product,
  headingLevel = 3,
}: {
  product: Product;
  headingLevel?: 2 | 3;
}) {
  const cart = useCart();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative grid content-start gap-3 rounded-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-4">
      <div className="relative overflow-hidden rounded-md bg-muted">
        <img
          src={sized(product.photo, 960)}
          alt=""
          loading="lazy"
          className="aspect-4/5 w-full object-cover transition-transform duration-(--ui-duration-slower) group-hover:scale-105"
        />
        {product.badge ? (
          <Badge
            variant={product.badge === "Last pieces" ? "warning" : "default"}
            className="absolute start-3 top-3"
          >
            {product.badge}
          </Badge>
        ) : null}
        <IconButton
          aria-label={`Add ${product.name} to bag`}
          shape="circle"
          className="absolute bottom-3 end-3 z-[2] shadow-md"
          onClick={() => {
            cart.add(product.id, product.colors[0]!.id);
            toast.success("Added to your bag", {
              description: product.name,
              action: { label: "View bag", onClick: () => cart.setOpen(true) },
            });
          }}
        >
          <PlusIcon />
        </IconButton>
      </div>
      <div className="grid gap-1">
        <div className="flex items-start justify-between gap-2">
          <Heading className="text-md font-medium leading-snug">
            <CardLink asChild className="hover:no-underline">
              <NextLink href={`/product/${product.id}`}>{product.name}</NextLink>
            </CardLink>
          </Heading>
          <Price
            amount={product.price}
            compareAt={product.compareAt}
            currency={CURRENCY}
            size="sm"
            fractionDigits={0}
          />
        </div>
        <ReviewStars value={product.rating} count={product.reviews} size="sm" />
        <ul aria-label="Colours" className="flex gap-1.5 pt-1">
          {product.colors.map((c) => (
            <li key={c.id}>
              <span
                className="block size-3.5 rounded-full border border-border-strong"
                style={{ background: c.swatch }}
                title={c.name}
              />
              <span className="sr-only">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
