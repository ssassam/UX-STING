"use client";
import { AspectRatio } from "@unified-ui/react/aspect-ratio";

export function Basic() {
  return (
    <div className="max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=70"
          alt="City skyline at dusk"
        />
      </AspectRatio>
    </div>
  );
}
