"use client";
import { HeartIcon, ShoppingCartIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import { Button, IconButton } from "@ux-sting/react/button";
import { Price } from "@ux-sting/react/price";
import { ProductCard } from "@ux-sting/react/product-card";
import { toast } from "@ux-sting/react/toast";
import { useState } from "react";
import { useCart } from "../app/providers";
import type { Product } from "../lib/data";

export function ProductTile({
  product,
  headingLevel = 3,
}: {
  product: Product;
  headingLevel?: 2 | 3;
}) {
  const { add } = useCart();
  const [saved, setSaved] = useState(false);
  return (
    <ProductCard
      href={`/product/${product.id}`}
      headingLevel={headingLevel}
      name={product.name}
      brand={product.brand}
      image={{ src: product.image, alt: product.name }}
      price={<Price amount={product.price} currency="EUR" compareAt={product.compareAt} />}
      rating={product.rating}
      reviewCount={product.reviews}
      badges={
        <>
          {product.compareAt ? <Badge variant="destructive">Sale</Badge> : null}
          {product.stock > 0 && product.stock <= 5 ? (
            <Badge variant="warning">Only {product.stock} left</Badge>
          ) : null}
          {product.stock === 0 ? <Badge variant="secondary">Sold out</Badge> : null}
        </>
      }
      secondaryAction={
        <IconButton
          aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name}`}
          aria-pressed={saved}
          size="sm"
          variant="secondary"
          shape="circle"
          onClick={() => setSaved(!saved)}
        >
          <HeartIcon className={saved ? "fill-destructive text-destructive" : undefined} />
        </IconButton>
      }
      action={
        <Button
          size="sm"
          fullWidth
          variant="outline"
          disabled={product.stock === 0}
          startIcon={<ShoppingCartIcon />}
          onClick={() => {
            add(product.id);
            toast.success("Added to cart", { description: product.name });
          }}
        >
          {product.stock === 0 ? "Sold out" : "Add to cart"}
        </Button>
      }
    />
  );
}
