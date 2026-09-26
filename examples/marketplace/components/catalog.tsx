"use client";
import { Checkbox, CheckboxGroup } from "@unified-ui/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@unified-ui/react/filter-panel";
import { Grid } from "@unified-ui/react/grid";
import { NativeSelect } from "@unified-ui/react/native-select";
import { Pagination } from "@unified-ui/react/pagination";
import { Rating } from "@unified-ui/react/rating";
import { SearchResults } from "@unified-ui/react/search-result";
import { RangeSlider } from "@unified-ui/react/slider";
import { EmptyState } from "@unified-ui/react/state";
import { Switch } from "@unified-ui/react/switch";
import { Chip } from "@unified-ui/react/tag";
import { Heading } from "@unified-ui/react/typography";
import { Button } from "@unified-ui/react/button";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { brands, categories, products } from "../lib/data";
import { ProductTile } from "./product-tile";

const PAGE_SIZE = 8;
const eur = (v: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const category = params.get("category");
  const page = Number(params.get("page") ?? 1);
  const [price, setPrice] = useState<[number, number]>([0, 600]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");

  const results = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!q || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase())) &&
        (!category || p.category === category) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        (!selectedBrands.length || selectedBrands.includes(p.brand)) &&
        (!inStock || p.stock > 0) &&
        p.rating >= minRating,
    );
    const sorters: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> =
      {
        popular: (a, b) => b.reviews - a.reviews,
        rating: (a, b) => b.rating - a.rating,
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
      };
    return [...list].sort(sorters[sort]);
  }, [q, category, price, selectedBrands, inStock, minRating, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    return s ? `/?${s}` : "/";
  };

  const chips = [
    ...(q ? [{ id: "q", label: `“${q}”` }] : []),
    ...(category ? [{ id: "category", label: category }] : []),
    ...(price[0] > 0 || price[1] < 600
      ? [{ id: "price", label: `${eur(price[0])} – ${eur(price[1])}` }]
      : []),
    ...selectedBrands.map((b) => ({ id: `brand:${b}`, label: b })),
    ...(inStock ? [{ id: "stock", label: "In stock" }] : []),
    ...(minRating ? [{ id: "rating", label: `${minRating}+ stars` }] : []),
  ];
  const remove = (id: string) => {
    if (id === "q" || id === "category") router.push(href({ [id]: null, page: null }));
    else if (id === "price") setPrice([0, 600]);
    else if (id.startsWith("brand:")) setSelectedBrands((b) => b.filter((x) => x !== id.slice(6)));
    else if (id === "stock") setInStock(false);
    else if (id === "rating") setMinRating(0);
  };
  const clearAll = () => {
    setPrice([0, 600]);
    setSelectedBrands([]);
    setInStock(false);
    setMinRating(0);
    router.push("/");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div className="grid gap-3">
        <Heading level={1} size="lg">
          {category ?? "Handmade goods"}
        </Heading>
        <nav aria-label="Categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <Chip
            selected={!category}
            onClick={() => router.push(href({ category: null, page: null }))}
          >
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c}
              selected={category === c}
              onClick={() => router.push(href({ category: c, page: null }))}
            >
              {c}
            </Chip>
          ))}
        </nav>
      </div>
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <FilterPanel
          activeCount={chips.length}
          onClear={clearAll}
          applyLabel={`Show ${results.length} results`}
        >
          <FilterSection title="Price">
            <RangeSlider
              value={price}
              onValueChange={(v) => setPrice([v[0] ?? 0, v[1] ?? 600])}
              min={0}
              max={600}
              step={10}
              thumbLabels={["Minimum price", "Maximum price"]}
              formatValue={eur}
              showValue
            />
          </FilterSection>
          <FilterSection title="Brand" activeCount={selectedBrands.length}>
            <CheckboxGroup
              legend="Brand"
              className="[&>legend]:sr-only"
              value={selectedBrands}
              onValueChange={setSelectedBrands}
            >
              {brands.map((b) => (
                <Checkbox key={b} value={b} label={b} />
              ))}
            </CheckboxGroup>
          </FilterSection>
          <FilterSection title="Availability">
            <Switch label="In stock only" checked={inStock} onCheckedChange={setInStock} />
          </FilterSection>
          <FilterSection title="Rating">
            <Rating
              label="Minimum rating"
              size="md"
              value={minRating}
              onValueChange={setMinRating}
            />
          </FilterSection>
        </FilterPanel>
        <SearchResults
          aria-label="Products"
          summary={`${results.length} products`}
          toolbar={
            <NativeSelect
              size="sm"
              aria-label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-44"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </NativeSelect>
          }
        >
          <FilterChips filters={chips} onRemove={remove} onClearAll={clearAll} />
          {visible.length ? (
            <Grid columns={{ base: 2, md: 3, xl: 4 }} gap="4">
              {visible.map((p) => (
                <ProductTile key={p.id} product={p} headingLevel={2} />
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="No products match your filters"
              description="Try a wider price range or fewer filters."
              actions={
                <Button variant="outline" onClick={clearAll}>
                  Clear filters
                </Button>
              }
            />
          )}
          <Pagination
            totalPages={totalPages}
            page={Math.min(page, totalPages)}
            getHref={(p) => href({ page: p === 1 ? null : String(p) })}
            renderLink={({ href: to, ...props }) => <NextLink href={to} {...props} />}
          />
        </SearchResults>
      </div>
    </div>
  );
}
