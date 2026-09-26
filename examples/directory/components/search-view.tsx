"use client";
import { LayoutGridIcon, ListIcon, MapIcon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { Checkbox, CheckboxGroup } from "@unified-ui/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@unified-ui/react/filter-panel";
import { MapPanel, MapPlaceholder } from "@unified-ui/react/map-placeholder";
import { NativeSelect } from "@unified-ui/react/native-select";
import { Rating } from "@unified-ui/react/rating";
import { SearchInput } from "@unified-ui/react/search-input";
import { SearchResults } from "@unified-ui/react/search-result";
import { Slider } from "@unified-ui/react/slider";
import { EmptyState } from "@unified-ui/react/state";
import { Switch } from "@unified-ui/react/switch";
import { Chip } from "@unified-ui/react/tag";
import { ToggleGroup, ToggleGroupItem } from "@unified-ui/react/toggle";
import { Heading } from "@unified-ui/react/typography";
import { getOpeningStatus } from "@unified-ui/react/opening-hours";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { amenities, categories, cities, places } from "../lib/data";
import { PlaceCard } from "./place-card";

export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<string | null>(params.get("category"));
  const city = params.get("city");
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [prices, setPrices] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState<"list" | "grid" | "map">("list");
  const [activePin, setActivePin] = useState<string | null>(null);

  const results = useMemo(() => {
    const list = places.filter(
      (p) =>
        (!q || `${p.name} ${p.category} ${p.area}`.toLowerCase().includes(q.toLowerCase())) &&
        (!category || p.categoryId === category) &&
        (!city || p.city.toLowerCase() === city) &&
        (!openNow || getOpeningStatus(p.hours).open) &&
        p.rating >= minRating &&
        (!prices.length || prices.includes(p.priceLevel)) &&
        selectedAmenities.every((a) => p.amenities.includes(a)) &&
        p.distanceKm <= distance,
    );
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      relevance: (a, b) => Number(b.premium) - Number(a.premium) || b.rating - a.rating,
      rating: (a, b) => b.rating - a.rating,
      distance: (a, b) => a.distanceKm - b.distanceKm,
      reviews: (a, b) => b.reviews - a.reviews,
    };
    return [...list].sort(by[sort]);
  }, [q, category, city, openNow, minRating, prices, selectedAmenities, distance, sort]);

  const chips = [
    ...(category
      ? [{ id: "category", label: categories.find((c) => c.id === category)?.name ?? category }]
      : []),
    ...(city ? [{ id: "city", label: cities.find((c) => c.id === city)?.name ?? city }] : []),
    ...(openNow ? [{ id: "open", label: "Open now" }] : []),
    ...(minRating ? [{ id: "rating", label: `${minRating}+ stars` }] : []),
    ...prices.map((p) => ({ id: `price:${p}`, label: "$".repeat(p) })),
    ...selectedAmenities.map((a) => ({ id: `amenity:${a}`, label: a })),
    ...(distance < 10 ? [{ id: "distance", label: `Within ${distance} km` }] : []),
  ];
  const clearAll = () => {
    setCategory(null);
    setOpenNow(false);
    setMinRating(0);
    setPrices([]);
    setSelectedAmenities([]);
    setDistance(10);
    if (city) router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };
  const remove = (id: string) => {
    if (id === "category") setCategory(null);
    else if (id === "city") router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    else if (id === "open") setOpenNow(false);
    else if (id === "rating") setMinRating(0);
    else if (id === "distance") setDistance(10);
    else if (id.startsWith("price:")) setPrices((p) => p.filter((x) => x !== Number(id.slice(6))));
    else if (id.startsWith("amenity:"))
      setSelectedAmenities((a) => a.filter((x) => x !== id.slice(8)));
  };

  const list = results.length ? (
    <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
      {results.map((p) => (
        <PlaceCard
          key={p.slug}
          place={p}
          layout={view === "grid" ? "vertical" : "horizontal"}
          headingLevel={2}
        />
      ))}
    </div>
  ) : (
    <EmptyState
      title="No places match your filters"
      description="Widen the distance or remove a filter."
      actions={
        <Button variant="outline" onClick={clearAll}>
          Clear all filters
        </Button>
      }
    />
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6">
      <div className="grid gap-3">
        <Heading level={1} size="lg">
          {category ? categories.find((c) => c.id === category)?.name : "Search places"}
          {city ? ` in ${cities.find((c) => c.id === city)?.name}` : ""}
        </Heading>
        <SearchInput
          value={q}
          onValueChange={setQ}
          placeholder="Search by name, category or neighbourhood"
          className="max-w-xl"
        />
        <div
          role="group"
          aria-label="Categories"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {categories.map((c) => (
            <Chip
              key={c.id}
              selected={category === c.id}
              onClick={() => setCategory(category === c.id ? null : c.id)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <FilterPanel
          activeCount={chips.length}
          onClear={clearAll}
          applyLabel={`Show ${results.length} places`}
        >
          <FilterSection title="Availability">
            <Switch label="Open now" checked={openNow} onCheckedChange={setOpenNow} />
          </FilterSection>
          <FilterSection title="Distance">
            <Slider
              aria-label="Maximum distance"
              value={[distance]}
              onValueChange={([v]) => setDistance(v ?? 10)}
              min={1}
              max={10}
              formatValue={(v) => (v >= 10 ? "Any distance" : `Within ${v} km`)}
              showValue
            />
          </FilterSection>
          <FilterSection title="Rating">
            <Rating
              label="Minimum rating"
              size="md"
              value={minRating}
              onValueChange={setMinRating}
            />
          </FilterSection>
          <FilterSection title="Price" activeCount={prices.length}>
            <div role="group" aria-label="Price level" className="flex gap-2">
              {[1, 2, 3, 4].map((p) => (
                <Chip
                  key={p}
                  size="sm"
                  selected={prices.includes(p)}
                  aria-label={["Inexpensive", "Moderate", "Expensive", "Very expensive"][p - 1]}
                  onClick={() =>
                    setPrices(prices.includes(p) ? prices.filter((x) => x !== p) : [...prices, p])
                  }
                >
                  {"$".repeat(p)}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Amenities"
            activeCount={selectedAmenities.length}
            defaultOpen={false}
          >
            <CheckboxGroup
              legend="Amenities"
              className="[&>legend]:sr-only"
              value={selectedAmenities}
              onValueChange={setSelectedAmenities}
            >
              {amenities.map((a) => (
                <Checkbox key={a} value={a} label={a} />
              ))}
            </CheckboxGroup>
          </FilterSection>
        </FilterPanel>
        <SearchResults
          aria-label="Results"
          summary={`${results.length} ${results.length === 1 ? "place" : "places"}`}
          toolbar={
            <div className="flex items-center gap-2">
              <NativeSelect
                size="sm"
                aria-label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-40"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest rated</option>
                <option value="distance">Nearest</option>
                <option value="reviews">Most reviewed</option>
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
                  label={`Map of ${results.length} results`}
                  className="h-72 lg:h-full"
                  pins={results.map((p) => ({
                    id: p.slug,
                    label: p.name,
                    x: p.pin.x,
                    y: p.pin.y,
                    active: activePin === p.slug,
                  }))}
                  onPinClick={(id) => {
                    setActivePin(id);
                    document
                      .getElementById(`result-${id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />
              }
            />
          ) : (
            list
          )}
        </SearchResults>
      </div>
    </div>
  );
}
