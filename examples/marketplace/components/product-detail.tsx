"use client";
import { ShieldCheckIcon, ShoppingCartIcon, TruckIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ux-sting/react/breadcrumb";
import { Button } from "@ux-sting/react/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ux-sting/react/carousel";
import { Field } from "@ux-sting/react/field";
import { ImageGallery } from "@ux-sting/react/media";
import { NumberInput } from "@ux-sting/react/number-input";
import { Price } from "@ux-sting/react/price";
import { RadioCard, RadioGroup } from "@ux-sting/react/radio-group";
import { ReviewStars } from "@ux-sting/react/rating";
import { ReviewCard } from "@ux-sting/react/review-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ux-sting/react/tabs";
import { toast } from "@ux-sting/react/toast";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { useState } from "react";
import { useCart } from "../app/providers";
import { products, type Product } from "../lib/data";
import { ProductTile } from "./product-tile";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState<number | null>(1);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.slice(0, 4))
    .slice(0, 6);
  const images = [0, 1, 2, 3].map((i) => ({
    src: `${product.image}&sig=${i}`,
    alt: `${product.name} — photo ${i + 1}`,
  }));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NextLink href="/">Shop</NextLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NextLink href={`/?category=${product.category}`}>{product.category}</NextLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery images={images} layout="mosaic" columns={3} ratio={1} />
        <div className="grid content-start gap-5">
          <div className="grid gap-2">
            <Text variant="muted" size="sm">
              {product.brand}
            </Text>
            <Heading level={1} size="xl">
              {product.name}
            </Heading>
            <ReviewStars value={product.rating} showValue count={product.reviews} />
          </div>
          <Price amount={product.price} currency="EUR" compareAt={product.compareAt} size="xl" />
          <Field label="Size">
            <RadioGroup
              defaultValue="m"
              orientation="horizontal"
              className="grid grid-cols-3 gap-2"
            >
              <RadioCard value="s" label="Small" />
              <RadioCard value="m" label="Medium" />
              <RadioCard value="l" label="Large" disabled description="Sold out" />
            </RadioGroup>
          </Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Quantity" className="w-36">
              <NumberInput
                value={qty}
                onValueChange={setQty}
                min={1}
                max={Math.max(1, product.stock)}
              />
            </Field>
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
              startIcon={<ShoppingCartIcon />}
              onClick={() => {
                add(product.id, qty ?? 1);
                toast.success("Added to cart", {
                  description: `${qty} × ${product.name}`,
                  action: {
                    label: "View cart",
                    onClick: () => (window.location.href = "/checkout"),
                  },
                });
              }}
            >
              {product.stock === 0 ? "Sold out" : "Add to cart"}
            </Button>
          </div>
          {product.stock > 0 && product.stock <= 5 ? (
            <Badge variant="warning" className="justify-self-start">
              Only {product.stock} left in stock
            </Badge>
          ) : null}
          <ul className="grid gap-2 text-sm text-muted-foreground [&_svg]:size-4">
            <li className="flex items-center gap-2">
              <TruckIcon aria-hidden /> Free delivery over €75 · 3–5 days
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheckIcon aria-hidden /> 30-day returns, secure payment
            </li>
          </ul>
        </div>
      </div>
      <Tabs defaultValue="details">
        <TabsList aria-label="Product information">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Text className="max-w-prose">{product.description}</Text>
        </TabsContent>
        <TabsContent value="reviews" className="grid gap-4 md:grid-cols-2">
          <ReviewCard
            author={{ name: "Inès R.", subtitle: "Verified buyer" }}
            rating={5}
            date={{ display: "March 2026", dateTime: "2026-03" }}
            body="Beautiful craftsmanship and arrived well packaged. Colors are exactly as pictured."
          />
          <ReviewCard
            author={{ name: "Mark T.", subtitle: "Verified buyer" }}
            rating={4}
            date={{ display: "February 2026", dateTime: "2026-02" }}
            body="Great quality. Shipping took a day longer than estimated but the seller kept me informed."
          />
        </TabsContent>
      </Tabs>
      <section aria-labelledby="related" className="grid gap-4">
        <Heading id="related" level={2} size="md">
          You may also like
        </Heading>
        <Carousel label="Related products">
          <CarouselContent
            itemsPerView={2}
            className="sm:[&>*]:basis-[calc((100%-2rem)/3)] lg:[&>*]:basis-[calc((100%-3rem)/4)]"
          >
            {related.map((p, i) => (
              <CarouselItem key={`${p.id}-${i}`} index={i}>
                <ProductTile product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-start-3" />
          <CarouselNext className="-end-3" />
        </Carousel>
      </section>
    </div>
  );
}
