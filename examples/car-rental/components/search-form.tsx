"use client";
import { SearchIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { DateRangePicker } from "@ux-sting/react/date-picker";
import { Field } from "@ux-sting/react/field";
import { NativeSelect } from "@ux-sting/react/native-select";
import { Switch } from "@ux-sting/react/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iso, useDefaultTrip } from "../lib/dates";
import { locations } from "../lib/data";

const times = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`);

export function SearchForm() {
  const router = useRouter();
  const [pickup, setPickup] = useState("cdg");
  const [dropoff, setDropoff] = useState("cdg");
  const [different, setDifferent] = useState(false);
  const { today, dates, setDates } = useDefaultTrip();
  const [time, setTime] = useState("10:00");

  return (
    <form
      role="search"
      aria-label="Find a car"
      onSubmit={(e) => {
        e.preventDefault();
        const p = new URLSearchParams({ pickup, dropoff: different ? dropoff : pickup, time });
        if (dates.from) p.set("from", iso(dates.from));
        if (dates.to) p.set("to", iso(dates.to));
        router.push(`/cars?${p}`);
      }}
      className="grid gap-4 rounded-2xl border border-border bg-background p-4 text-foreground shadow-xl sm:p-5"
    >
      <div className="grid gap-3">
        {/* The desk names are long ("Paris Charles de Gaulle Airport") and the hero
            card is narrow, so the location gets its own row instead of being
            truncated inside a four-up strip. */}
        <Field label="Pick-up location">
          <NativeSelect size="lg" value={pickup} onChange={(e) => setPickup(e.target.value)}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_auto] sm:items-end">
          <Field label="Pick-up and return dates">
            <DateRangePicker
              size="lg"
              value={dates}
              onValueChange={setDates}
              min={today}
              numberOfMonths={2}
              placeholder="Select dates"
            />
          </Field>
          <Field label="Time">
            <NativeSelect size="lg" value={time} onChange={(e) => setTime(e.target.value)}>
              {times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </NativeSelect>
          </Field>
          <Button type="submit" size="lg" startIcon={<SearchIcon />}>
            Show cars
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Switch
          label="Return to a different location"
          checked={different}
          onCheckedChange={setDifferent}
        />
        {different ? (
          <Field label="Return location" className="min-w-64 flex-1 sm:flex-none">
            <NativeSelect value={dropoff} onChange={(e) => setDropoff(e.target.value)}>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
        ) : null}
      </div>
    </form>
  );
}
