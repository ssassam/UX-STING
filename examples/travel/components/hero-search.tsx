"use client";
import { SearchIcon } from "@ux-sting/icons";
import { Autocomplete } from "@ux-sting/react/autocomplete";
import { Button } from "@ux-sting/react/button";
import { DateRangePicker } from "@ux-sting/react/date-picker";
import { Field } from "@ux-sting/react/field";
import { NumberInput } from "@ux-sting/react/number-input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { destinations } from "../lib/data";

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function HeroSearch() {
  const router = useRouter();
  const [where, setWhere] = useState("");
  const [dates, setDates] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [guests, setGuests] = useState<number | null>(2);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submit = () => {
    const match = destinations.find(
      (d) => d.name.toLowerCase() === where.trim().toLowerCase() || d.slug === where.trim(),
    );
    const params = new URLSearchParams();
    if (match) params.set("destination", match.slug);
    else if (where.trim()) params.set("q", where.trim());
    if (dates.from) params.set("from", iso(dates.from));
    if (dates.to) params.set("to", iso(dates.to));
    if (guests) params.set("guests", String(guests));
    router.push(`/search?${params}`);
  };

  return (
    <form
      role="search"
      aria-label="Find a stay"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="grid gap-3 rounded-2xl border border-border bg-background p-4 text-foreground shadow-xl md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_8rem_auto] md:items-end"
    >
      <Field label="Where to?">
        <Autocomplete
          size="lg"
          value={where}
          onValueChange={setWhere}
          onSelect={setWhere}
          suggestions={destinations.map((d) => d.name)}
          placeholder="Search destinations"
        />
      </Field>
      <Field label="Dates">
        <DateRangePicker
          size="lg"
          value={dates}
          onValueChange={setDates}
          min={today}
          numberOfMonths={2}
          placeholder="Check-in – check-out"
        />
      </Field>
      <Field label="Guests">
        <NumberInput size="lg" value={guests} onValueChange={setGuests} min={1} max={12} />
      </Field>
      <Button type="submit" size="lg" startIcon={<SearchIcon />}>
        Search
      </Button>
    </form>
  );
}
