"use client";
import { HeartIcon, NavigationIcon, PhoneIcon, Share2Icon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { toast } from "@unified-ui/react/toast";
import type { Place } from "../lib/data";

/** Sticky bottom action bar on phones (respects the safe area). */
export function PlaceActions({ place }: { place: Place }) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-(--ui-z-sticky) border-t border-border bg-background/95 px-4 py-2 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0">
      <div className="mx-auto flex max-w-lg gap-2 md:max-w-none">
        <Button asChild className="flex-1 md:flex-none" startIcon={<PhoneIcon />}>
          <a href={`tel:${place.phone.replace(/\s/g, "")}`}>Call</a>
        </Button>
        <Button asChild variant="outline" className="flex-1 md:flex-none" startIcon={<NavigationIcon />}>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${place.name} ${place.address} ${place.city}`)}`} target="_blank" rel="noopener noreferrer">
            Directions
          </a>
        </Button>
        <Button variant="outline" aria-label="Save" onClick={() => toast.success("Saved", { description: place.name })}>
          <HeartIcon />
        </Button>
        <Button
          variant="outline"
          aria-label="Share"
          onClick={async () => {
            await navigator.clipboard?.writeText(window.location.href);
            toast("Link copied");
          }}
        >
          <Share2Icon />
        </Button>
      </div>
    </div>
  );
}
