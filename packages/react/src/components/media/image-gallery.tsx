"use client";
import { cn } from "@ux-sting/utils";
import { useState } from "react";
import { Image } from "./image.js";
import { Lightbox, type LightboxImage } from "./lightbox.js";

export interface ImageGalleryProps {
  images: LightboxImage[];
  /** Grid columns on ≥ sm screens. */
  columns?: 2 | 3 | 4;
  /**
   * `mosaic` shows one large image plus groups of four (four columns from
   * `sm`), so the grid never has gaps; extra images go behind the "+n" tile.
   * With fewer than five images it falls back to `grid`.
   */
  layout?: "grid" | "mosaic";
  ratio?: number;
  className?: string;
  /** Maximum thumbnails shown; the last one shows "+n". */
  max?: number;
}

/** Thumbnail grid that opens a Lightbox. Each thumbnail is a button. */
export function ImageGallery({
  images,
  columns = 3,
  layout = "grid",
  ratio = 4 / 3,
  className,
  max,
}: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const limit = Math.min(max ?? images.length, images.length);
  const mosaic = layout === "mosaic" && limit >= 5;
  // Mosaic: 1 large (2×2) + multiples of 4 small tiles fill 2 and 4 columns exactly.
  const count = mosaic ? 1 + Math.floor((limit - 1) / 4) * 4 : limit;
  const shown = images.slice(0, count);
  const rest = images.length - shown.length;
  const cols = mosaic
    ? 4
    : layout === "mosaic"
      ? limit === 4
        ? 2
        : Math.min(Math.max(limit, 2), 3)
      : columns;
  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-2 gap-2",
          cols === 3 && "sm:grid-cols-3",
          cols === 4 && "sm:grid-cols-4",
          mosaic && "[&>li:first-child]:col-span-2 [&>li:first-child]:row-span-2",
          className,
        )}
      >
        {shown.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="relative block size-full overflow-hidden rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Image
                src={image.src}
                alt={image.alt}
                ratio={mosaic && i === 0 ? undefined : ratio}
                containerClassName="size-full"
                className="transition-transform duration-(--ui-duration-slow) hover:scale-[1.03]"
              />
              {rest > 0 && i === shown.length - 1 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white">
                  +{rest}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={images}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
