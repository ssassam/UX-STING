"use client";
import { cn } from "@ux-sting/utils";
import { useState } from "react";
import { Image } from "./image.js";
import { Lightbox, type LightboxImage } from "./lightbox.js";

export interface ImageGalleryProps {
  images: LightboxImage[];
  /** Grid columns on ≥ sm screens. */
  columns?: 2 | 3 | 4;
  /** `mosaic` makes the first image larger. */
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
  const shown = max ? images.slice(0, max) : images;
  const rest = images.length - shown.length;
  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-2 gap-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-4",
          layout === "mosaic" && "[&>li:first-child]:col-span-2 [&>li:first-child]:row-span-2",
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
                ratio={layout === "mosaic" && i === 0 ? undefined : ratio}
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
