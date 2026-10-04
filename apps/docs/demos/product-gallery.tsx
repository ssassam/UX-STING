"use client";
import { ProductGallery } from "@ux-sting/react/product-gallery";
import { img } from "./_data";

const images = [
  ["photo-1600166898405-da9535204843", "Berber rug laid out in a living room"],
  ["photo-1590502593747-42a996133562", "Hand-painted ceramic tagine"],
  ["photo-1608571423902-eed4a5ad8108", "Bottle of argan oil"],
  ["photo-1554118811-1e0d58224f24", "Café interior with rugs"],
].map(([id, alt]) => ({ src: img(id!, 1000), thumbnail: img(id!, 160), alt: alt! }));

export function Default() {
  return (
    <div className="max-w-md">
      <ProductGallery images={images} label="Berber rug images" />
    </div>
  );
}

export function SideThumbnails() {
  return (
    <div className="max-w-xl">
      <ProductGallery images={images} thumbnails="start" ratio={4 / 5} label="Tagine images" />
    </div>
  );
}
