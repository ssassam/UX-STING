"use client";
import { Location, LocationCard } from "@unified-ui/react/location";
import { MapPlaceholder } from "@unified-ui/react/map-placeholder";

export function Basic() {
  return (
    <div className="grid max-w-sm gap-4">
      <Location address="12 Rue de Fès" area="Gauthier, Casablanca" distance="850 m" />
      <LocationCard
        name="Café Atlas"
        address="12 Rue de Fès, Casablanca"
        distance="850 m away"
        directionsHref="https://maps.google.com/?q=Casablanca"
        map={
          <MapPlaceholder
            ratio={16 / 9}
            className="rounded-none border-0 border-b"
            pins={[{ id: "a", x: 50, y: 55, label: "Café Atlas", active: true }]}
            label="Map showing Café Atlas"
          />
        }
      />
    </div>
  );
}
