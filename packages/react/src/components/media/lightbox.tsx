"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useControllableState } from "@unified-ui/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import type { KeyboardEvent } from "react";
import { CloseButton } from "../../lib/overlay.js";
import { useLocale, useMessages, usePortalContainer } from "../../provider/context.js";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  srcSet?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
}

/** Full-screen image viewer with keyboard navigation (←/→, Esc). */
export function Lightbox({ images, open, onOpenChange, index: indexProp, defaultIndex = 0, onIndexChange }: LightboxProps) {
  const [index, setIndex] = useControllableState({ value: indexProp, defaultValue: defaultIndex, onChange: onIndexChange });
  const container = usePortalContainer();
  const messages = useMessages();
  const { dir } = useLocale();
  const image = images[index];
  const go = (delta: number) => setIndex((index + delta + images.length) % images.length);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight")) go(1);
    if (e.key === (dir === "rtl" ? "ArrowRight" : "ArrowLeft")) go(-1);
  };
  const nav = "ui-hit-area absolute top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white outline-none hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white [&_svg]:size-5 rtl:[&_svg]:rotate-180";
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className="ui-anim-overlay fixed inset-0 z-(--ui-z-modal) bg-black/90" />
        <DialogPrimitive.Content onKeyDown={onKeyDown} aria-describedby={undefined} className="ui-anim-pop fixed inset-0 z-(--ui-z-modal) flex flex-col items-center justify-center p-4 outline-none sm:p-12">
          <DialogPrimitive.Title className="sr-only">{image?.alt}</DialogPrimitive.Title>
          {image ? (
            <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
              <img src={image.src} srcSet={image.srcSet} alt={image.alt} className="max-h-[80dvh] max-w-full rounded-md object-contain" />
              <figcaption className="text-center text-sm text-white/80">
                {image.caption}
                <span className="ms-2 tabular-nums text-white/60">{messages.slideOf(index + 1, images.length)}</span>
              </figcaption>
            </figure>
          ) : null}
          {images.length > 1 ? (
            <>
              <button type="button" aria-label={messages.previous} className={cn(nav, "start-3")} onClick={() => go(-1)}>
                <ChevronLeftIcon />
              </button>
              <button type="button" aria-label={messages.next} className={cn(nav, "end-3")} onClick={() => go(1)}>
                <ChevronRightIcon />
              </button>
            </>
          ) : null}
          <DialogPrimitive.Close asChild>
            <CloseButton className="absolute end-3 top-3 bg-black/50 text-white hover:bg-black/70 hover:text-white" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
