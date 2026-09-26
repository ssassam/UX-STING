"use client";
import { Icon } from "@ux-sting/react/icon";
import { SearchIcon, StarIcon } from "@ux-sting/icons";

export function Basic() {
  return (
    <div className="flex items-center gap-4 text-foreground">
      <SearchIcon size="lg" />
      <StarIcon size={24} className="fill-warning text-warning" title="Favorite" />
      <Icon name="map-pin" size="xl" className="text-primary" />
      <Icon name="calendar" />
    </div>
  );
}
