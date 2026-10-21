"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ux-sting/react/breadcrumb";
import { CheckboxGroup, Checkbox } from "@ux-sting/react/checkbox";
import { FilterSection } from "@ux-sting/react/filter-panel";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Pagination } from "@ux-sting/react/pagination";
import { Price } from "@ux-sting/react/price";
import { ProductCard } from "@ux-sting/react/product-card";
import { ProductListing } from "@ux-sting/react/product-listing";
import { Swatch, SwatchGroup } from "@ux-sting/react/swatch";
import { useState } from "react";
import { img } from "./_data";

const products = [
  ["Handwoven Berber rug", 420, "photo-1600166898405-da9535204843"],
  ["Ceramic tagine", 38, "photo-1590502593747-42a996133562"],
  ["Argan oil, 100 ml", 19, "photo-1608571423902-eed4a5ad8108"],
] as const;

const materialLabels: Record<string, string> = { wool: "Wool", cotton: "Cotton", clay: "Clay" };

export function CategoryPage() {
  const [materials, setMaterials] = useState<string[]>(["wool"]);
  const active = materials.map((m) => ({ id: m, label: `Material: ${materialLabels[m]}` }));
  return (
    <ProductListing
      title="Home & living"
      description="Handmade pieces from Moroccan workshops."
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Home & living</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      resultCount={128}
      activeFilters={active}
      onRemoveFilter={(id) => setMaterials((ms) => ms.filter((m) => m !== id))}
      onClearFilters={() => setMaterials([])}
      filters={
        <>
          <FilterSection title="Material" activeCount={materials.length}>
            <CheckboxGroup aria-label="Material" value={materials} onValueChange={setMaterials}>
              {Object.entries(materialLabels).map(([value, label]) => (
                <Checkbox key={value} value={value} label={label} />
              ))}
            </CheckboxGroup>
          </FilterSection>
          <FilterSection title="Color">
            <SwatchGroup aria-label="Color">
              <Swatch value="sand" label="Sand" color="oklch(0.82 0.06 80)" size="sm" />
              <Swatch value="terracotta" label="Terracotta" color="oklch(0.6 0.13 40)" size="sm" />
              <Swatch value="indigo" label="Indigo" color="oklch(0.4 0.12 270)" size="sm" />
            </SwatchGroup>
          </FilterSection>
        </>
      }
      sort={
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <NativeSelect size="sm" className="w-auto" defaultValue="popular">
            <option value="popular">Most popular</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price: low to high</option>
          </NativeSelect>
        </label>
      }
      pagination={<Pagination totalPages={11} defaultPage={1} variant="compact" />}
    >
      <ul aria-label="Products" className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map(([name, price, id]) => (
          <li key={name}>
            <ProductCard
              href="#"
              headingLevel={2}
              name={name}
              image={{ src: img(id, 500), alt: name }}
              price={<Price amount={price} currency="EUR" />}
            />
          </li>
        ))}
      </ul>
    </ProductListing>
  );
}
