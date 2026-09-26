"use client";
import { Button } from "@ux-sting/react/button";
import { Checkbox } from "@ux-sting/react/checkbox";
import { FilterChips, FilterPanel, FilterSection } from "@ux-sting/react/filter-panel";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Pagination } from "@ux-sting/react/pagination";
import { SearchInput } from "@ux-sting/react/search-input";
import { SearchResults } from "@ux-sting/react/search-result";
import { RangeSlider } from "@ux-sting/react/slider";
import { EmptyState } from "@ux-sting/react/state";
import { Chip } from "@ux-sting/react/tag";
import { Heading } from "@ux-sting/react/typography";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { categories, products, type CategoryId } from "../lib/data";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 6;
const allColors = [...new Map(products.flatMap((p) => p.colors).map((c) => [c.id, c])).values()];

export function ShopBrowser() {
  const params = useSearchParams();
  const [category, setCategory] = useState<CategoryId | null>(
    params.get("category") as CategoryId | null,
  );
  const [q, setQ] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([0, 70]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || `${p.name} ${p.maker}`.toLowerCase().includes(q.toLowerCase())) &&
        (!colors.length || p.colors.some((c) => colors.includes(c.id))) &&
        p.price >= price[0]! &&
        (price[1]! >= 70 || p.price <= price[1]!) &&
        (!inStock || p.stock > 10),
    );
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      featured: (a, b) =>
        Number(b.badge === "Bestseller") - Number(a.badge === "Bestseller") ||
        b.reviews - a.reviews,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(by[sort]);
  }, [category, q, colors, price, inStock, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const chips = [
    ...(category
      ? [{ id: "category", label: categories.find((c) => c.id === category)!.name }]
      : []),
    ...colors.map((c) => ({ id: `color:${c}`, label: allColors.find((x) => x.id === c)!.name })),
    ...(price[0] !== 0 || price[1] !== 70
      ? [{ id: "price", label: `€${price[0]}–${price[1]! >= 70 ? "€70+" : `€${price[1]}`}` }]
      : []),
    ...(inStock ? [{ id: "stock", label: "Ships today" }] : []),
  ];
  const clearAll = () => {
    setCategory(null);
    setColors([]);
    setPrice([0, 70]);
    setInStock(false);
    setPage(1);
  };
  const remove = (id: string) => {
    if (id === "category") setCategory(null);
    else if (id === "price") setPrice([0, 70]);
    else if (id === "stock") setInStock(false);
    else if (id.startsWith("color:")) setColors((c) => c.filter((x) => x !== id.slice(6)));
    setPage(1);
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 sm:px-6">
      <div className="grid gap-3">
        <Heading level={1} size="3xl" className="font-serif font-normal">
          {category ? categories.find((c) => c.id === category)!.name : "The collection"}
        </Heading>
        <SearchInput
          value={q}
          onValueChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search products or makers"
          className="max-w-md"
        />
        <div
          role="group"
          aria-label="Category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          <Chip
            selected={!category}
            onClick={() => {
              setCategory(null);
              setPage(1);
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
                setPage(1);
              }}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <FilterPanel
          activeCount={chips.length}
          onClear={clearAll}
          applyLabel={`Show ${results.length} products`}
        >
          <FilterSection title="Price">
            <RangeSlider
              value={price}
              onValueChange={(v) => {
                setPrice(v);
                setPage(1);
              }}
              min={0}
              max={70}
              step={5}
              thumbLabels={["Minimum price", "Maximum price"]}
              formatValue={(v) => (v >= 70 ? "€70+" : `€${v}`)}
              showValue
            />
          </FilterSection>
          <FilterSection title="Colour" activeCount={colors.length}>
            <div role="group" aria-label="Colour" className="flex flex-wrap gap-2">
              {allColors.map((c) => {
                const on = colors.includes(c.id);
                return (
                  <Chip
                    key={c.id}
                    size="sm"
                    selected={on}
                    onClick={() => {
                      setColors(on ? colors.filter((x) => x !== c.id) : [...colors, c.id]);
                      setPage(1);
                    }}
                    icon={
                      <span
                        className="size-3 rounded-full border border-border-strong"
                        style={{ background: c.swatch }}
                      />
                    }
                  >
                    {c.name}
                  </Chip>
                );
              })}
            </div>
          </FilterSection>
          <FilterSection title="Availability">
            <Checkbox
              label="Ships today"
              checked={inStock}
              onCheckedChange={(v) => {
                setInStock(v === true);
                setPage(1);
              }}
            />
          </FilterSection>
        </FilterPanel>
        <SearchResults
          aria-label="Products"
          summary={`${results.length} ${results.length === 1 ? "product" : "products"}`}
          toolbar={
            <NativeSelect
              size="sm"
              aria-label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-44"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </NativeSelect>
          }
        >
          <FilterChips filters={chips} onRemove={remove} onClearAll={clearAll} />
          {visible.length ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-3">
              {visible.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} headingLevel={2} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              title="Nothing matches yet"
              description="Try another colour or clear the filters."
              actions={
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              }
            />
          )}
          {pages > 1 ? (
            <Pagination totalPages={pages} page={current} onPageChange={setPage} className="mt-8" />
          ) : null}
        </SearchResults>
      </div>
    </div>
  );
}
