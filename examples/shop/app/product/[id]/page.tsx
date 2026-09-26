import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux-sting/react/accordion";
import { Badge } from "@ux-sting/react/badge";
import { ReviewStars } from "@ux-sting/react/rating";
import { Heading, Text } from "@ux-sting/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { ProductBuy } from "../../../components/product-buy";
import { ProductCard } from "../../../components/product-card";
import { categories, getProduct, products } from "../../../lib/data";
import { absolute, jsonLd, pageMeta } from "../../../lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const p = getProduct((await params).id);
  return p
    ? pageMeta({
        title: p.name,
        description: p.description,
        path: `product/${p.id}`,
        image: { url: p.photo.src, alt: p.photo.alt },
      })
    : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const category = categories.find((c) => c.id === product.category)!;
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.category !== product.category))
    .slice(0, 4);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.photo.src,
          url: absolute(`product/${product.id}`),
          brand: { "@type": "Brand", name: "Maison Nord" },
          color: product.colors.map((c) => c.name).join(", "),
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: product.price,
            availability:
              product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/shop?category=${category.id}` },
          { label: product.name },
        ]}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-md bg-muted md:sticky md:top-24 md:self-start">
          <img
            src={product.photo.src}
            alt={product.photo.alt}
            className="aspect-4/5 w-full object-cover"
          />
        </div>
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            {product.badge ? <Badge className="w-fit">{product.badge}</Badge> : null}
            <Heading level={1} size="3xl" className="font-serif font-normal">
              {product.name}
            </Heading>
            <ReviewStars value={product.rating} count={product.reviews} showValue />
          </div>
          <Text size="lg" variant="muted">
            {product.description}
          </Text>
          <ProductBuy product={product} />
          <Accordion type="single" collapsible defaultValue="details" variant="default">
            <AccordionItem value="details">
              <AccordionTrigger headingLevel={2}>Details</AccordionTrigger>
              <AccordionContent>
                <ul className="grid list-disc gap-1 ps-5">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="maker">
              <AccordionTrigger headingLevel={2}>The maker</AccordionTrigger>
              <AccordionContent>
                Made by {product.maker}. We buy directly and pay upfront at the price the workshop
                sets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger headingLevel={2}>Delivery and returns</AccordionTrigger>
              <AccordionContent>
                Free carbon-neutral delivery over €80 in 2–4 working days. Return anything within 60
                days, free of charge.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <section aria-labelledby="related-title" className="grid gap-6">
        <Heading level={2} size="xl" id="related-title" className="font-serif font-normal">
          You might also like
        </Heading>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
