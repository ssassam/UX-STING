import { cn } from "@unified-ui/utils";
import type { ReactNode } from "react";
import { CardLink } from "../card/card.js";

export interface CategoryCardProps {
  name: string;
  href: string;
  icon?: ReactNode;
  /** e.g. "248 places". */
  count?: ReactNode;
  className?: string;
}

/** Compact category tile (icon + name + count). */
export function CategoryCard({ name, href, icon, count, className }: CategoryCardProps) {
  return (
    <div className={cn("group/card relative flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-sm has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring", className)}>
      {icon ? <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground [&_svg]:size-5">{icon}</span> : null}
      <div className="grid min-w-0">
        <CardLink href={href} className="truncate text-sm font-semibold hover:no-underline">
          {name}
        </CardLink>
        {count ? <span className="text-xs text-muted-foreground">{count}</span> : null}
      </div>
    </div>
  );
}

export interface CityCardProps {
  name: string;
  href: string;
  image: { src: string; alt: string };
  /** e.g. "1,204 places". */
  count?: ReactNode;
  className?: string;
}

/** Destination tile with image and legible text over a scrim. */
export function CityCard({ name, href, image, count, className }: CityCardProps) {
  return (
    <div className={cn("group/card relative isolate overflow-hidden rounded-xl bg-muted has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2", className)} style={{ aspectRatio: "4 / 5" }}>
      <img src={image.src} alt={image.alt} loading="lazy" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-(--ui-duration-slower) group-hover/card:scale-105" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 grid gap-0.5 p-4 text-white">
        <CardLink href={href} className="text-lg font-semibold hover:no-underline">
          {name}
        </CardLink>
        {count ? <span className="text-sm text-white/85">{count}</span> : null}
      </div>
    </div>
  );
}
