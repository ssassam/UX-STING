"use client";
import { useControllableState } from "@ux-sting/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@ux-sting/icons";
import { cn, getNextIndex } from "@ux-sting/utils";
import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent } from "react";
import { useLocale, useMessages } from "../../provider/context.js";
import { IconButton } from "../button/button.js";
import { Image } from "../media/image.js";

export interface ProductGalleryImage {
  src: string;
  alt: string;
  /** Smaller source for the thumbnail. Defaults to `src`. */
  thumbnail?: string;
}

export interface ProductGalleryProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  images: ProductGalleryImage[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Aspect ratio of the main image. Default 1 (square). */
  ratio?: number;
  /** Thumbnails below (default) or beside the image from `md` up. */
  thumbnails?: "bottom" | "start" | "none";
  /** Accessible name for the gallery (defaults to "Product images"). */
  label?: string;
}

/**
 * Product image viewer: main image with previous/next buttons and a thumbnail
 * strip. Thumbnails are one tab stop (arrow keys, Home/End, RTL-aware); the
 * current position is announced politely. Layout adapted from the
 * Storefront UI Gallery block (MIT).
 */
export const ProductGallery = forwardRef<HTMLElement, ProductGalleryProps>(function ProductGallery(
  {
    images,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    ratio = 1,
    thumbnails = "bottom",
    label,
    className,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const { dir } = useLocale();
  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const listRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = images[Math.min(index, count - 1)];
  const go = (i: number) => setIndex((i + count) % count);

  const onThumbKeyDown = (e: KeyboardEvent) => {
    const next = getNextIndex(e.key, index, count, {
      orientation: thumbnails === "start" ? "both" : "horizontal",
      dir,
      loop: true,
    });
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  if (!current) return null;
  const side = thumbnails === "start";

  return (
    <section
      ref={ref}
      aria-label={label ?? messages.productImages}
      className={cn("grid gap-3", side && "md:grid-cols-[4.5rem_1fr] md:items-start", className)}
      {...props}
    >
      <div className={cn("relative", side && "md:order-2")}>
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          ratio={ratio}
          radius="lg"
          className="bg-muted"
        />
        {count > 1 ? (
          <>
            <IconButton
              aria-label={messages.previous}
              variant="secondary"
              shape="circle"
              size="sm"
              className="absolute start-2 top-1/2 -translate-y-1/2 shadow-sm"
              onClick={() => go(index - 1)}
            >
              <ChevronLeftIcon className="rtl:rotate-180" />
            </IconButton>
            <IconButton
              aria-label={messages.next}
              variant="secondary"
              shape="circle"
              size="sm"
              className="absolute end-2 top-1/2 -translate-y-1/2 shadow-sm"
              onClick={() => go(index + 1)}
            >
              <ChevronRightIcon className="rtl:rotate-180" />
            </IconButton>
            <p aria-live="polite" className="sr-only">
              {messages.slideOf(index + 1, count)}
            </p>
          </>
        ) : null}
      </div>
      {count > 1 && thumbnails !== "none" ? (
        <div
          ref={listRef}
          role="group"
          aria-label={label ?? messages.productImages}
          onKeyDown={onThumbKeyDown}
          className={cn(
            "flex gap-2 overflow-x-auto p-1 [scrollbar-width:thin]",
            side &&
              "md:order-1 md:max-h-[32rem] md:flex-col md:overflow-x-visible md:overflow-y-auto",
          )}
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              tabIndex={i === index ? 0 : -1}
              aria-label={messages.showImage(i + 1, count)}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 border-transparent bg-muted outline-none transition-[border-color,opacity] duration-(--ui-duration-fast)",
                "opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "aria-[current=true]:border-primary aria-[current=true]:opacity-100",
              )}
            >
              {/* Decorative: the button's label names the image position. */}
              <img
                src={image.thumbnail ?? image.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
});
