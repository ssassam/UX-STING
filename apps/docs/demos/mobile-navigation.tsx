"use client";
import { MobileNavigation, MobileNavigationItem } from "@unified-ui/react/mobile-navigation";
import { HeartIcon, HomeIcon, SearchIcon, UserIcon } from "@unified-ui/icons";

export function Basic() {
  return (
    <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface [transform:translateZ(0)]">
      <p className="p-4 text-sm text-muted-foreground">
        Phone-sized preview. The bar is fixed to the bottom of the viewport.
      </p>
      <MobileNavigation showOnDesktop className="absolute">
        <MobileNavigationItem href="#" icon={<HomeIcon />} active>
          Home
        </MobileNavigationItem>
        <MobileNavigationItem href="#" icon={<SearchIcon />}>
          Search
        </MobileNavigationItem>
        <MobileNavigationItem href="#" icon={<HeartIcon />}>
          Saved
        </MobileNavigationItem>
        <MobileNavigationItem href="#" icon={<UserIcon />}>
          Profile
        </MobileNavigationItem>
      </MobileNavigation>
    </div>
  );
}
