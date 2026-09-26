"use client";
import { useState } from "react";
import { MapPanel, MapPlaceholder } from "@unified-ui/react/map-placeholder";

const pins = [
  { id: "1", x: 30, y: 40, label: "Café Atlas" },
  { id: "2", x: 55, y: 60, label: "La Sqala" },
  { id: "3", x: 72, y: 30, label: "Riad Zitoun" },
];

export function Interactive() {
  const [active, setActive] = useState("1");
  return (
    <MapPanel
      list={
        <ul className="grid gap-2">
          {pins.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setActive(p.id)} aria-pressed={active === p.id} className="w-full rounded-lg border border-border p-3 text-start text-sm aria-pressed:border-primary aria-pressed:bg-primary-subtle">
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      }
      map={<MapPlaceholder label="Map of results" className="h-72 lg:h-full" pins={pins.map((p) => ({ ...p, active: p.id === active }))} onPinClick={setActive} />}
    />
  );
}
