"use client";
import { Button } from "@ux-sting/react/button";
import { Checkbox, CheckboxGroup } from "@ux-sting/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@ux-sting/react/filter-panel";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Pagination } from "@ux-sting/react/pagination";
import { RadioGroup, RadioGroupItem } from "@ux-sting/react/radio-group";
import { SearchResults } from "@ux-sting/react/search-result";
import { RangeSlider } from "@ux-sting/react/slider";
import { EmptyState } from "@ux-sting/react/state";
import { Chip } from "@ux-sting/react/tag";
import { Heading, Text } from "@ux-sting/react/typography";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cars, categories, getLocation, type Category, type Fuel } from "../lib/data";
import { CarCard } from "./car-card";

const PRICE_MIN = 20;
const PRICE_MAX = 130;
const PAGE_SIZE = 6;
const fuels: Fuel[] = ["Petrol", "Diesel", "Hybrid", "Electric"];

export function FleetBrowser() {
  const params = useSearchParams();
  const pickup = getLocation(params.get("pickup") ?? "");
  const [category, setCategory] = useState<Category | null>(
    params.get("category") as Category | null,
  );
  const [transmission, setTransmission] = useState("any");
  const [fuel, setFuel] = useState<string[]>([]);
  const [seats, setSeats] = useState("0");
  const [price, setPrice] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const reset = () => setPage(1);

  const results = useMemo(() => {
    const list = cars.filter(
      (c) =>
        (!category || c.category === category) &&
        (transmission === "any" || c.transmission === transmission) &&
        (!fuel.length || fuel.includes(c.fuel)) &&
        c.seats >= Number(seats) &&
        c.pricePerDay >= price[0]! &&
        (price[1]! >= PRICE_MAX || c.pricePerDay <= price[1]!),
    );
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      recommended: (a, b) => Number(!!b.popular) - Number(!!a.popular) || b.rating - a.rating,
      "price-asc": (a, b) => a.pricePerDay - b.pricePerDay,
      "price-desc": (a, b) => b.pricePerDay - a.pricePerDay,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(by[sort]);
  }, [category, transmission, fuel, seats, price, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const chips = [
    ...(category
      ? [{ id: "category", label: categories.find((c) => c.id === category)!.name }]
      : []),
    ...(transmission !== "any" ? [{ id: "transmission", label: transmission }] : []),
    ...fuel.map((f) => ({ id: `fuel:${f}`, label: f })),
    ...(seats !== "0" ? [{ id: "seats", label: `${seats}+ seats` }] : []),
    ...(price[0] !== PRICE_MIN || price[1] !== PRICE_MAX
      ? [
          {
            id: "price",
            label: `€${price[0]}–${price[1]! >= PRICE_MAX ? `€${PRICE_MAX}+` : `€${price[1]}`} / day`,
          },
        ]
      : []),
  ];
  const clearAll = () => {
    setCategory(null);
    setTransmission("any");
    setFuel([]);
    setSeats("0");
    setPrice([PRICE_MIN, PRICE_MAX]);
    reset();
  };
  const remove = (id: string) => {
    if (id === "category") setCategory(null);
    else if (id === "transmission") setTransmission("any");
    else if (id === "seats") setSeats("0");
    else if (id === "price") setPrice([PRICE_MIN, PRICE_MAX]);
    else if (id.startsWith("fuel:")) setFuel((f) => f.filter((x) => x !== id.slice(5)));
    reset();
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 sm:px-6">
      <div className="grid gap-2">
        <Heading level={1} size="2xl">
          {category ? `${categories.find((c) => c.id === category)!.name} cars` : "Our fleet"}
        </Heading>
        <Text variant="muted">
          {pickup
            ? `Available at ${pickup.name}${params.get("from") ? ` · ${params.get("from")} → ${params.get("to") ?? "?"}` : ""}`
            : "Unlimited kilometres and free cancellation on every car."}
        </Text>
        <div
          role="group"
          aria-label="Category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          <Chip
            selected={!category}
            onClick={() => {
              setCategory(null);
              reset();
            }}
          >
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              selected={category === c.id}
              onClick={() => {
                setCategory(category === c.id ? null : c.id);
                reset();
              }}
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
          applyLabel={`Show ${results.length} cars`}
        >
          <FilterSection title="Price per day">
            <RangeSlider
              value={price}
              onValueChange={(v) => {
                setPrice(v);
                reset();
              }}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5}
              minStepsBetweenThumbs={2}
              thumbLabels={["Minimum price", "Maximum price"]}
              formatValue={(v) => (v >= PRICE_MAX ? `€${PRICE_MAX}+` : `€${v}`)}
              showValue
            />
          </FilterSection>
          <FilterSection title="Gearbox">
            <RadioGroup
              aria-label="Gearbox"
              value={transmission}
              onValueChange={(v) => {
                setTransmission(v);
                reset();
              }}
            >
              <RadioGroupItem value="any" label="Any" />
              <RadioGroupItem value="Automatic" label="Automatic" />
              <RadioGroupItem value="Manual" label="Manual" />
            </RadioGroup>
          </FilterSection>
          <FilterSection title="Fuel" activeCount={fuel.length}>
            <CheckboxGroup
              legend="Fuel"
              className="[&>legend]:sr-only"
              value={fuel}
              onValueChange={(v) => {
                setFuel(v);
                reset();
              }}
            >
              {fuels.map((f) => (
                <Checkbox key={f} value={f} label={f} />
              ))}
            </CheckboxGroup>
          </FilterSection>
          <FilterSection title="Seats">
            <RadioGroup
              aria-label="Minimum seats"
              value={seats}
              onValueChange={(v) => {
                setSeats(v);
                reset();
              }}
            >
              <RadioGroupItem value="0" label="Any" />
              <RadioGroupItem value="5" label="5 or more" />
              <RadioGroupItem value="7" label="7 or more" />
            </RadioGroup>
          </FilterSection>
        </FilterPanel>
        <SearchResults
          aria-label="Cars"
          summary={`${results.length} ${results.length === 1 ? "car" : "cars"}`}
          toolbar={
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
          }
        >
          <FilterChips filters={chips} onRemove={remove} onClearAll={clearAll} />
          {visible.length ? (
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((c) => (
                <li key={c.id} className="grid">
                  <CarCard car={c} headingLevel={2} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              title="No cars match your filters"
              description="Try another category or widen the price range."
              actions={
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              }
            />
          )}
          {pages > 1 ? (
            <Pagination totalPages={pages} page={current} onPageChange={setPage} className="mt-6" />
          ) : null}
        </SearchResults>
      </div>
    </div>
  );
}
