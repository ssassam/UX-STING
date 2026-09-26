import { ArrowRightIcon, RecycleIcon, TruckIcon, Undo2Icon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Heading, Text } from "@ux-sting/react/typography";
import NextLink from "next/link";
import { ProductCard } from "../components/product-card";
import { Section } from "../components/section";
import { categories, makers, products } from "../lib/data";
import { photos, sized } from "../lib/photos";
import { jsonLd, pageMeta, SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata = pageMeta({
  description:
    "Slow objects for everyday rituals: handmade stoneware, linen, brass and plants from 23 independent workshops.",
});

const perks = [
  {
    icon: <TruckIcon />,
    title: "Free delivery over €80",
    body: "Carbon-neutral, 2–4 working days.",
  },
  { icon: <Undo2Icon />, title: "60-day returns", body: "Changed your mind? Send it back free." },
  {
    icon: <RecycleIcon />,
    title: "Plastic-free packaging",
    body: "Paper, card and plant-based tape.",
  },
];

const categoryPhoto = {
  kitchen: photos.frenchpress,
  table: photos.mug,
  living: photos.cushion,
  lighting: photos.lamp,
  plants: photos.plant,
} as const;

export default function HomePage() {
  const bestsellers = products.slice(0, 8);
  return (
    <div className="grid gap-20 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: "Handmade homeware from independent workshops.",
            },
            { "@type": "OnlineStore", name: SITE_NAME, url: SITE_URL },
          ],
        })}
      />
      <section
        aria-labelledby="hero-title"
        className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pt-8 sm:px-6 md:grid-cols-2 md:pt-14"
      >
        <div className="grid gap-5">
          <Text size="sm" weight="medium" variant="muted" className="uppercase tracking-widest">
            Autumn collection
          </Text>
          <h1
            id="hero-title"
            className="font-serif text-5xl leading-[1.05] text-balance md:text-6xl"
          >
            Slow objects for everyday rituals
          </h1>
          <Text size="lg" variant="muted" className="max-w-md">
            Stoneware, linen and brass from 23 independent workshops — made to be used every day and
            kept for years.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" endIcon={<ArrowRightIcon className="rtl:rotate-180" />}>
              <NextLink href="/shop">Shop the collection</NextLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <NextLink href="/#makers">Meet the makers</NextLink>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img
            src={sized(photos.cushion, 960)}
            alt={photos.cushion.alt}
            className="col-span-2 aspect-16/10 w-full rounded-md bg-muted object-cover"
            fetchPriority="high"
          />
          <img
            src={sized(photos.teapot, 960)}
            alt={photos.teapot.alt}
            className="aspect-square w-full rounded-md bg-muted object-cover"
          />
          <img
            src={sized(photos.plant, 960)}
            alt={photos.plant.alt}
            className="aspect-square w-full rounded-md bg-muted object-cover"
          />
        </div>
      </section>

      <section aria-label="Why shop with us" className="border-y border-border bg-muted/50">
        <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {perks.map((p) => (
            <li key={p.title} className="flex items-start gap-3 [&_svg]:size-5">
              <span aria-hidden className="mt-0.5 text-foreground">
                {p.icon}
              </span>
              <span className="grid">
                <span className="font-medium">{p.title}</span>
                <span className="text-sm text-muted-foreground">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Section id="categories" title="Shop by room" href="/shop" hrefLabel="Shop all">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <li key={c.id} className="w-[42%] shrink-0 snap-start sm:w-auto">
              <NextLink
                href={`/shop?category=${c.id}`}
                className="group grid gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <span className="overflow-hidden rounded-md bg-muted">
                  <img
                    src={sized(categoryPhoto[c.id], 500)}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-(--ui-duration-slower) group-hover:scale-105"
                  />
                </span>
                <span className="font-medium">{c.name}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="bestsellers"
        title="Bestsellers"
        intro="The pieces our customers reorder most."
        href="/shop"
        hrefLabel="View all"
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Section>

      <section
        id="makers"
        aria-labelledby="makers-title"
        className="mx-auto grid w-full max-w-7xl scroll-mt-24 grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 sm:px-6 md:grid-cols-2"
      >
        <img
          src={sized(makers.photo, 960)}
          alt={makers.photo.alt}
          loading="lazy"
          className="aspect-4/3 w-full rounded-md bg-muted object-cover"
        />
        <div className="grid gap-4">
          <Heading level={2} size="2xl" id="makers-title" className="font-serif font-normal">
            {makers.title}
          </Heading>
          <Text size="lg" variant="muted">
            {makers.body}
          </Text>
          <dl className="grid grid-cols-3 gap-4 pt-2">
            {[
              ["23", "workshops"],
              ["11", "countries"],
              ["100%", "paid upfront"],
            ].map(([v, l]) => (
              <div key={l} className="grid">
                <dt className="order-2 text-sm text-muted-foreground">{l}</dt>
                <dd className="order-1 font-serif text-3xl tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
