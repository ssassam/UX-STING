"use client";
import { CityCard } from "@ux-sting/react/category-card";
import { NativeSelect } from "@ux-sting/react/native-select";
import { EmptyState } from "@ux-sting/react/state";
import { Chip } from "@ux-sting/react/tag";
import { Heading, Text } from "@ux-sting/react/typography";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { destinations, tripStyles, type TripStyle } from "../lib/data";
import { sized } from "../lib/photos";

const regions = ["All regions", ...new Set(destinations.map((d) => d.region))];

export function DestinationsBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const style = params.get("style") as TripStyle | null;
  const [region, setRegion] = useState("All regions");
  const [sort, setSort] = useState("popular");

  const setStyle = (next: TripStyle | null) =>
    router.replace(next ? `/destinations?style=${next}` : "/destinations", { scroll: false });

  const results = useMemo(() => {
    const list = destinations.filter(
      (d) =>
        (!style || d.styles.includes(style)) && (region === "All regions" || d.region === region),
    );
    return [...list].sort((a, b) =>
      sort === "price"
        ? a.fromPrice - b.fromPrice
        : sort === "rating"
          ? b.rating - a.rating
          : b.reviews - a.reviews,
    );
  }, [style, region, sort]);

  const styleName = tripStyles.find((s) => s.id === style)?.name;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-10 sm:px-6">
      <div className="grid gap-2">
        <Heading level={1} size="2xl">
          {styleName ?? "Explore destinations"}
        </Heading>
        <Text variant="muted">Hand-picked places for every kind of traveller.</Text>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Trip style"
          className="-mx-1 flex min-w-0 basis-full gap-2 overflow-x-auto px-1 pb-1 lg:basis-0 lg:flex-1"
        >
          <Chip selected={!style} onClick={() => setStyle(null)}>
            All
          </Chip>
          {tripStyles.map((s) => (
            <Chip
              key={s.id}
              selected={style === s.id}
              onClick={() => setStyle(style === s.id ? null : s.id)}
            >
              {s.name}
            </Chip>
          ))}
        </div>
        <NativeSelect
          size="sm"
          aria-label="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-40"
        >
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
        <NativeSelect
          size="sm"
          aria-label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-40"
        >
          <option value="popular">Most popular</option>
          <option value="rating">Highest rated</option>
          <option value="price">Lowest price</option>
        </NativeSelect>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "destination" : "destinations"}
      </p>
      {results.length ? (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((d) => (
            <li key={d.slug}>
              <CityCard
                name={d.name}
                href={`/destinations/${d.slug}`}
                image={{ src: sized(d.image, 960), alt: "" }}
                count={`${d.country} · from €${d.fromPrice}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No destinations match"
          description="Try another region or trip style."
          headingLevel={2}
        />
      )}
    </div>
  );
}
