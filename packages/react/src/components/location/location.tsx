import { MapPinIcon, NavigationIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface LocationProps extends HTMLAttributes<HTMLElement> {
  address: ReactNode;
  /** Pre-formatted distance, e.g. "1.2 km". */
  distance?: ReactNode;
  /** Optional neighbourhood / city line. */
  area?: ReactNode;
}

/** Address line with pin icon and distance. Renders an `<address>`. */
export function Location({ address, distance, area, className, ...props }: LocationProps) {
  return (
    <address className={cn("flex items-start gap-1.5 text-sm not-italic text-muted-foreground [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0", className)} {...props}>
      <MapPinIcon aria-hidden />
      <span className="min-w-0">
        <span className="text-foreground">{address}</span>
        {area ? <span> · {area}</span> : null}
        {distance ? <span className="tabular-nums"> · {distance}</span> : null}
      </span>
    </address>
  );
}

export interface LocationCardProps extends HTMLAttributes<HTMLDivElement> {
  name?: ReactNode;
  address: ReactNode;
  distance?: ReactNode;
  /** URL for directions (maps app). */
  directionsHref?: string;
  directionsLabel?: string;
  map?: ReactNode;
}

/** Address + optional map + directions link. */
export function LocationCard({ name, address, distance, directionsHref, directionsLabel = "Get directions", map, className, ...props }: LocationCardProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)} {...props}>
      {map}
      <div className="grid gap-2 p-4">
        {name ? <p className="font-semibold">{name}</p> : null}
        <Location address={address} distance={distance} />
        {directionsHref ? (
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline [&_svg]:size-4">
            <NavigationIcon aria-hidden />
            {directionsLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
