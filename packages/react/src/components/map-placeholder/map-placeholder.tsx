"use client";
import { MapIcon, MapPinIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface MapPin {
  id: string;
  /** Position in percent of the container (0–100). */
  x: number;
  y: number;
  label: string;
  active?: boolean;
}

export interface MapPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  pins?: MapPin[];
  onPinClick?: (id: string) => void;
  /** Accessible description of what the map shows. */
  label?: string;
  ratio?: number;
  children?: ReactNode;
}

/**
 * Lightweight, dependency-free map stand-in: grid background with
 * positioned, keyboard-accessible pins. Swap for a real map provider later
 * without changing surrounding layout.
 */
export function MapPlaceholder({
  pins = [],
  onPinClick,
  label = "Map",
  ratio,
  className,
  children,
  style,
  ...props
}: MapPlaceholderProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-surface",
        "bg-[linear-gradient(var(--ui-border)_1px,transparent_1px),linear-gradient(90deg,var(--ui-border)_1px,transparent_1px)] bg-[size:32px_32px]",
        className,
      )}
      style={{ aspectRatio: ratio ? String(ratio) : undefined, ...style }}
      {...props}
    >
      {pins.length === 0 && !children ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground [&_svg]:size-8">
          <MapIcon aria-hidden />
        </div>
      ) : null}
      <ul>
        {pins.map((pin) => (
          <li
            key={pin.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <button
              type="button"
              aria-label={pin.label}
              aria-pressed={pin.active}
              onClick={() => onPinClick?.(pin.id)}
              className={cn(
                "ui-hit-area flex items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-7 [&_svg]:drop-shadow",
                pin.active ? "scale-125 text-primary" : "text-destructive hover:scale-110",
              )}
            >
              <MapPinIcon aria-hidden className="fill-background" />
            </button>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

/** Split layout: results list beside a map (map stacks above on mobile). */
export function MapPanel({
  list,
  map,
  className,
}: {
  list: ReactNode;
  map: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]", className)}>
      <div className="order-2 min-w-0 lg:order-1">{list}</div>
      <div className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-[calc(100dvh-6rem)]">{map}</div>
    </div>
  );
}
