"use client";
import { ArrowRightIcon, SlidersHorizontalIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { Checkbox, CheckboxGroup } from "@ux-sting/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@ux-sting/react/filter-panel";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Pagination } from "@ux-sting/react/pagination";
import { RadioGroup, RadioGroupItem } from "@ux-sting/react/radio-group";
import { SearchResults } from "@ux-sting/react/search-result";
import { RangeSlider } from "@ux-sting/react/slider";
import { EmptyState } from "@ux-sting/react/state";
import { Heading, Text } from "@ux-sting/react/typography";
import { useFlipLayout } from "@ux-sting/motion/gsap";
import { useTabIndicator } from "@ux-sting/motion/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { cars, categories, getLocation, type Category, type Fuel } from "../lib/data";
import { CarCard } from "./car-card";

const PRICE_MIN = 20;
const PRICE_MAX = 130;
const PAGE_SIZE = 6;
const fuels: Fuel[] = ["Petrol", "Diesel", "Hybrid", "Electric"];

/** Reads pickup and category from the URL; the page renders `FleetBrowser` as its fallback. */
export function FleetBrowserFromUrl() {
  const params = useSearchParams();
  return (
    <FleetBrowser
      pickupId={params.get("pickup")}
      initialCategory={params.get("category") as Category | null}
      from={params.get("from")}
      to={params.get("to")}
    />
  );
}

/** One roadbook tab: mono label, live count, and the shared sliding indicator under it. */
function FleetTab({
  selected,
  count,
  onSelect,
  children,
}: {
  selected: boolean;
  count: number;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`roadbook-label shrink-0 rounded-t-sm border-b-2 border-transparent px-3 py-2.5 text-nowrap outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring ${
        selected ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
      <span aria-hidden className="ms-1.5 text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

export function FleetBrowser({
  pickupId = null,
  initialCategory = null,
  from = null,
  to = null,
}: {
  pickupId?: string | null;
  initialCategory?: Category | null;
  from?: string | null;
  to?: string | null;
}) {
  const pickup = getLocation(pickupId ?? "");
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [transmission, setTransmission] = useState("any");
  const [fuel, setFuel] = useState<string[]>([]);
  const [seats, setSeats] = useState("0");
  const [price, setPrice] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);

  const tabs = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  // The bar under the selected category glides instead of jumping; the grid
  // plays FLIP, so cars slide to their new place instead of blinking.
  useTabIndicator(tabs, { selected: '[aria-pressed="true"]' });
  const { capture } = useFlipLayout(list, { duration: 0.45, ease: "power2.inOut" });
  const move = (update: () => void) => {
    capture();
    update();
  };
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
  const activeCategory = category ? categories.find((c) => c.id === category)! : null;

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
  const clearAll = () =>
    move(() => {
      setCategory(null);
      setTransmission("any");
      setFuel([]);
      setSeats("0");
      setPrice([PRICE_MIN, PRICE_MAX]);
      setPage(1);
    });
  const remove = (id: string) => {
    move(() => {
      if (id === "category") setCategory(null);
      else if (id === "transmission") setTransmission("any");
      else if (id === "seats") setSeats("0");
      else if (id === "price") setPrice([PRICE_MIN, PRICE_MAX]);
      else if (id.startsWith("fuel:")) setFuel((f) => f.filter((x) => x !== id.slice(5)));
      setPage(1);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <header className="grid gap-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10">
        <div className="relative hidden ps-4 md:block">
          <span aria-hidden className="route-line absolute inset-y-0 start-0 w-px overflow-hidden">
            <span className="route-line-fill" />
          </span>
          <p className="roadbook-label text-primary">
            <span className="text-muted-foreground">STAGE</span> 08
          </p>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="grid gap-2">
            <p className="roadbook-label text-muted-foreground">
              The fleet · {cars.length} models · unlimited kilometres
            </p>
            <Heading level={1} size="3xl" className="font-display text-balance tracking-tight">
              {activeCategory
                ? `${activeCategory.name}, picked for the coast road`
                : "Pick your car"}
            </Heading>
            <Text variant="muted" className="max-w-2xl text-pretty">
              {pickup
                ? `Waiting at ${pickup.name}${from ? ` · ${from} → ${to ?? "?"}` : ""}. Every price is per day, taxes included, with the deposit held on your card.`
                : "Six desks across France, two of them open all night. Filter it the way you drive."}
            </Text>
          </div>

          <div
            ref={tabs}
            role="group"
            aria-label="Filter by category"
            className="us-tabs -mx-1 flex gap-1 overflow-x-auto border-b border-border px-1"
          >
            <FleetTab
              selected={!category}
              count={cars.length}
              onSelect={() =>
                move(() => {
                  setCategory(null);
                  reset();
                })
              }
            >
              All
            </FleetTab>
            {categories.map((c) => (
              <FleetTab
                key={c.id}
                selected={category === c.id}
                count={cars.filter((car) => car.category === c.id).length}
                onSelect={() =>
                  move(() => {
                    setCategory(category === c.id ? null : c.id);
                    reset();
                  })
                }
              >
                {c.name}
              </FleetTab>
            ))}
            <span aria-hidden className="us-tab-indicator" />
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <FilterPanel
          activeCount={chips.length}
          onClear={clearAll}
          applyLabel={`Show ${results.length} cars`}
        >
          <FilterSection title="Price per day">
            <RangeSlider
              value={price}
              onValueChange={(v) => {
                move(() => {
                  setPrice(v);
                  reset();
                });
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
                move(() => {
                  setTransmission(v);
                  reset();
                });
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
                move(() => {
                  setFuel(v);
                  reset();
                });
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
                move(() => {
                  setSeats(v);
                  reset();
                });
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
              onChange={(e) =>
                move(() => {
                  setSort(e.target.value);
                  reset();
                })
              }
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
            <ul
              ref={list}
              className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {visible.map((c) => (
                <li key={c.id} data-flip-id={c.id} className="fleet-card grid">
                  <CarCard car={c} headingLevel={2} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              icon={<SlidersHorizontalIcon />}
              title="No cars match your filters"
              description="Try another category or widen the price range — the fleet is twelve models, so the bands are close together."
              actions={
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              }
            />
          )}
          {pages > 1 ? (
            <Pagination
              totalPages={pages}
              page={current}
              onPageChange={(n) =>
                move(() => {
                  setPage(n);
                })
              }
              className="mt-6"
            />
          ) : null}
          {pickup ? (
            <p className="roadbook-label mt-6 flex items-center gap-2 text-muted-foreground">
              <ArrowRightIcon aria-hidden className="size-3.5 text-primary" />
              Prices shown for {pickup.name} · change it from the home search
            </p>
          ) : null}
        </SearchResults>
      </div>
    </div>
  );
}
