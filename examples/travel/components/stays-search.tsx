"use client";
import { LayoutGridIcon, ListIcon, MapIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Checkbox, CheckboxGroup } from "@ux-sting/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@ux-sting/react/filter-panel";
import { MapPanel, MapPlaceholder } from "@ux-sting/react/map-placeholder";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Pagination } from "@ux-sting/react/pagination";
import { RadioGroup, RadioGroupItem } from "@ux-sting/react/radio-group";
import { SearchResults } from "@ux-sting/react/search-result";
import { RangeSlider } from "@ux-sting/react/slider";
import { EmptyState } from "@ux-sting/react/state";
import { Switch } from "@ux-sting/react/switch";
import { Chip } from "@ux-sting/react/tag";
import { ToggleGroup, ToggleGroupItem } from "@ux-sting/react/toggle";
import { Heading, Text } from "@ux-sting/react/typography";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { amenityOptions, destinations, getDestination, stays } from "../lib/data";
import { StayCard } from "./stay-card";

const PRICE_MIN = 50;
const PRICE_MAX = 500;
const PAGE_SIZE = 6;
const eur = (v: number) => `€${v}`;

export function StaysSearch() {
  const params = useSearchParams();
  const [destination, setDestination] = useState<string | null>(params.get("destination"));
  const q = params.get("q");
  const guests = Number(params.get("guests") ?? 0);
  const [price, setPrice] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [stars, setStars] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("0");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [freeCancel, setFreeCancel] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"list" | "grid" | "map">("list");
  const [activePin, setActivePin] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const list = stays.filter(
      (s) =>
        (!destination || s.destination === destination) &&
        (!q ||
          `${s.name} ${s.area} ${getDestination(s.destination)?.name}`
            .toLowerCase()
            .includes(q.toLowerCase())) &&
        (!guests || s.rooms.some((r) => r.guests >= guests)) &&
        s.nightly >= price[0]! &&
        (price[1]! >= PRICE_MAX || s.nightly <= price[1]!) &&
        (!stars.length || stars.includes(String(s.stars))) &&
        s.rating >= Number(minRating) &&
        amenities.every((a) => s.amenities.includes(a)) &&
        (!freeCancel || s.freeCancellation),
    );
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      recommended: (a, b) =>
        Number(b.featured ?? 0) - Number(a.featured ?? 0) || b.rating - a.rating,
      "price-asc": (a, b) => a.nightly - b.nightly,
      "price-desc": (a, b) => b.nightly - a.nightly,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(by[sort]);
  }, [destination, q, guests, price, stars, minRating, amenities, freeCancel, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const place = destination ? getDestination(destination) : undefined;

  const chips = [
    ...(place ? [{ id: "destination", label: place.name }] : []),
    ...(price[0] !== PRICE_MIN || price[1] !== PRICE_MAX
      ? [
          {
            id: "price",
            label: `${eur(price[0]!)}–${price[1]! >= PRICE_MAX ? `${eur(PRICE_MAX)}+` : eur(price[1]!)}`,
          },
        ]
      : []),
    ...stars.map((s) => ({ id: `stars:${s}`, label: `${s} stars` })),
    ...(minRating !== "0" ? [{ id: "rating", label: `Rated ${minRating}+` }] : []),
    ...amenities.map((a) => ({ id: `amenity:${a}`, label: a })),
    ...(freeCancel ? [{ id: "cancel", label: "Free cancellation" }] : []),
  ];
  const clearAll = () => {
    setDestination(null);
    setPrice([PRICE_MIN, PRICE_MAX]);
    setStars([]);
    setMinRating("0");
    setAmenities([]);
    setFreeCancel(false);
    setPage(1);
  };
  const remove = (id: string) => {
    if (id === "destination") setDestination(null);
    else if (id === "price") setPrice([PRICE_MIN, PRICE_MAX]);
    else if (id === "rating") setMinRating("0");
    else if (id === "cancel") setFreeCancel(false);
    else if (id.startsWith("stars:")) setStars((s) => s.filter((x) => x !== id.slice(6)));
    else if (id.startsWith("amenity:")) setAmenities((a) => a.filter((x) => x !== id.slice(8)));
    setPage(1);
  };

  const list = visible.length ? (
    <ul className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
      {visible.map((s) => (
        <li key={s.id} id={`stay-${s.id}`} className="grid">
          <StayCard
            stay={s}
            layout={view === "grid" ? "vertical" : "horizontal"}
            headingLevel={2}
          />
        </li>
      ))}
    </ul>
  ) : (
    <EmptyState
      headingLevel={2}
      title="No stays match your filters"
      description="Widen your price range or remove a filter."
      actions={
        <Button variant="outline" onClick={clearAll}>
          Clear all filters
        </Button>
      }
    />
  );

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 sm:px-6">
      <div className="grid gap-3">
        <Heading level={1} size="2xl">
          {place ? `Stays in ${place.name}` : q ? `Stays matching “${q}”` : "Find your stay"}
        </Heading>
        {guests ? (
          <Text variant="muted">
            For {guests} {guests === 1 ? "guest" : "guests"}
            {params.get("from") ? ` · ${params.get("from")} → ${params.get("to") ?? "?"}` : ""}
          </Text>
        ) : null}
        <div
          role="group"
          aria-label="Destination"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {destinations.map((d) => (
            <Chip
              key={d.slug}
              selected={destination === d.slug}
              onClick={() => {
                setDestination(destination === d.slug ? null : d.slug);
                setPage(1);
              }}
            >
              {d.name}
            </Chip>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <FilterPanel
          activeCount={chips.length}
          onClear={clearAll}
          applyLabel={`Show ${results.length} stays`}
        >
          <FilterSection title="Price per night">
            <RangeSlider
              value={price}
              onValueChange={(v) => {
                setPrice(v);
                setPage(1);
              }}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={10}
              minStepsBetweenThumbs={5}
              thumbLabels={["Minimum price", "Maximum price"]}
              formatValue={(v) => (v >= PRICE_MAX ? `${eur(PRICE_MAX)}+` : eur(v))}
              showValue
            />
          </FilterSection>
          <FilterSection title="Booking">
            <Switch
              label="Free cancellation"
              checked={freeCancel}
              onCheckedChange={setFreeCancel}
            />
          </FilterSection>
          <FilterSection title="Star rating" activeCount={stars.length}>
            <CheckboxGroup
              legend="Star rating"
              className="[&>legend]:sr-only"
              value={stars}
              onValueChange={setStars}
            >
              {["5", "4", "3"].map((s) => (
                <Checkbox key={s} value={s} label={`${s} stars`} />
              ))}
            </CheckboxGroup>
          </FilterSection>
          <FilterSection title="Guest rating">
            <RadioGroup aria-label="Guest rating" value={minRating} onValueChange={setMinRating}>
              <RadioGroupItem value="0" label="Any" />
              <RadioGroupItem value="4.5" label="Excellent 4.5+" />
              <RadioGroupItem value="4.7" label="Exceptional 4.7+" />
            </RadioGroup>
          </FilterSection>
          <FilterSection title="Amenities" activeCount={amenities.length} defaultOpen={false}>
            <CheckboxGroup
              legend="Amenities"
              className="[&>legend]:sr-only"
              value={amenities}
              onValueChange={setAmenities}
            >
              {amenityOptions.map((a) => (
                <Checkbox key={a} value={a} label={a} />
              ))}
            </CheckboxGroup>
          </FilterSection>
        </FilterPanel>
        <SearchResults
          aria-label="Stays"
          summary={`${results.length} ${results.length === 1 ? "stay" : "stays"}`}
          toolbar={
            <div className="flex items-center gap-2">
              <NativeSelect
                size="sm"
                aria-label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-44"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </NativeSelect>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                value={view}
                onValueChange={(v) => v && setView(v as typeof view)}
                aria-label="View"
              >
                <ToggleGroupItem value="list" aria-label="List view">
                  <ListIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGridIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="map" aria-label="Map view">
                  <MapIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          }
        >
          <FilterChips filters={chips} onRemove={remove} onClearAll={clearAll} />
          {view === "map" ? (
            <MapPanel
              list={list}
              map={
                <MapPlaceholder
                  label={`Map of ${visible.length} stays`}
                  className="h-72 lg:h-full"
                  pins={visible.map((s) => ({
                    id: s.id,
                    label: `${s.name}, €${s.nightly}`,
                    x: s.pin.x,
                    y: s.pin.y,
                    active: activePin === s.id,
                  }))}
                  onPinClick={(id) => {
                    setActivePin(id);
                    document
                      .getElementById(`stay-${id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />
              }
            />
          ) : (
            list
          )}
          {pages > 1 ? (
            <Pagination totalPages={pages} page={current} onPageChange={setPage} className="mt-6" />
          ) : null}
        </SearchResults>
      </div>
    </div>
  );
}
