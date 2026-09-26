"use client";
import { NavigationRail, NavigationRailItem } from "@unified-ui/react/navigation-rail";
import { CountBadge } from "@unified-ui/react/badge";
import { BellIcon, CalendarIcon, HomeIcon, SettingsIcon } from "@unified-ui/icons";

export function Basic() {
  return (
    <div className="h-80 w-fit overflow-hidden rounded-lg border border-border">
      <NavigationRail>
        <NavigationRailItem href="#" icon={<HomeIcon />} active>Home</NavigationRailItem>
        <NavigationRailItem href="#" icon={<CalendarIcon />}>Bookings</NavigationRailItem>
        <NavigationRailItem href="#" icon={<BellIcon />} badge={<CountBadge count={3} label="3 unread" />}>Alerts</NavigationRailItem>
        <NavigationRailItem href="#" icon={<SettingsIcon />}>Settings</NavigationRailItem>
      </NavigationRail>
    </div>
  );
}
