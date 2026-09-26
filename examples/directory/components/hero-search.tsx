"use client";
import { SearchIcon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { Combobox } from "@unified-ui/react/combobox";
import { Field } from "@unified-ui/react/field";
import { SearchInput } from "@unified-ui/react/search-input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cities } from "../lib/data";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string | null>("casablanca");
  const go = () => router.push(`/search?q=${encodeURIComponent(q)}${city ? `&city=${city}` : ""}`);
  return (
    <form
      role="search"
      aria-label="Find places"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="grid gap-3 rounded-2xl border border-border bg-background p-3 shadow-lg sm:grid-cols-[1fr_14rem_auto] sm:items-end"
    >
      <Field label="What" className="[&>label]:sr-only sm:[&>label]:not-sr-only">
        <SearchInput size="lg" value={q} onValueChange={setQ} placeholder="Restaurants, plumbers, hotels…" aria-label="What are you looking for?" />
      </Field>
      <Field label="Where" className="[&>label]:sr-only sm:[&>label]:not-sr-only">
        <Combobox size="lg" options={cities.map((c) => ({ value: c.id, label: c.name }))} value={city} onValueChange={setCity} placeholder="Any city" />
      </Field>
      <Button type="submit" size="lg" startIcon={<SearchIcon />}>Search</Button>
    </form>
  );
}
