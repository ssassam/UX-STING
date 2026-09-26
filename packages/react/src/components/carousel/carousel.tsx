"use client";
import { useInterval, usePrefersReducedMotion } from "@unified-ui/hooks";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { useMessages } from "../../provider/context.js";

interface CarouselContextValue {
  index: number;
  count: number;
  setCount: (n: number) => void;
  scrollTo: (i: number) => void;
  trackRef: RefObject<HTMLDivElement | null>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  autoplay: boolean;
  loop: boolean;
  setIndex: (i: number) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel parts must be used inside <Carousel>.");
  return ctx;
}

export interface CarouselProps extends HTMLAttributes<HTMLElement> {
  /** Auto-advance interval in ms. Pauses on hover, focus and reduced motion. */
  autoplay?: number | false;
  loop?: boolean;
  /** Accessible name of the carousel. */
  label?: string;
}

/**
 * Scroll-snap carousel: native touch scrolling, keyboard arrows, visible
 * previous/next controls (swipe is never required) and pausable autoplay.
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  { autoplay = false, loop = true, label, className, children, onKeyDown, ...props },
  ref,
) {
  const messages = useMessages();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(Boolean(autoplay) && !reducedMotion);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  const scrollTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const target = loop ? (i + count) % count : Math.max(0, Math.min(count - 1, i));
      const slide = track.children[target] as HTMLElement | undefined;
      if (slide) {
        const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
        track.scrollBy({ left: delta, behavior: reducedMotion ? "auto" : "smooth" });
      }
      setIndex(target);
    },
    [count, loop, reducedMotion],
  );

  useInterval(() => scrollTo(index + 1), autoplay && playing && !hovered ? autoplay : null);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
      e.preventDefault();
      scrollTo(index + 1);
    } else if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
      e.preventDefault();
      scrollTo(index - 1);
    }
  };

  return (
    <CarouselContext.Provider value={{ index, count, setCount, scrollTo, trackRef, playing, setPlaying, autoplay: Boolean(autoplay), loop, setIndex }}>
      <section
        ref={ref}
        aria-roledescription="carousel"
        aria-label={label ?? messages.carousel}
        onKeyDown={handleKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHovered(false)}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
});

export const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { itemsPerView?: 1 | 2 | 3 | 4 }>(
  function CarouselContent({ itemsPerView = 1, className, children, ...props }, ref) {
    const { trackRef, setCount, setIndex, playing, autoplay } = useCarousel();
    const count = Children.toArray(children).filter(isValidElement).length;
    useEffect(() => setCount(count), [count, setCount]);

    useEffect(() => {
      const track = trackRef.current;
      if (!track || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setIndex(Array.from(track.children).indexOf(entry.target));
          }
        },
        { root: track, threshold: 0.6 },
      );
      Array.from(track.children).forEach((c) => observer.observe(c));
      return () => observer.disconnect();
    }, [trackRef, setIndex, count]);

    return (
      <div
        ref={(node) => {
          trackRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        aria-live={autoplay && playing ? "off" : "polite"}
        // The scroll container must be keyboard-reachable (WCAG 2.1.1); arrows are handled by Carousel.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          "ui-scroll-snap flex gap-4 overflow-x-auto rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          itemsPerView === 2 && "[&>*]:basis-[calc((100%-1rem)/2)]",
          itemsPerView === 3 && "[&>*]:basis-[calc((100%-2rem)/3)]",
          itemsPerView === 4 && "[&>*]:basis-[calc((100%-3rem)/4)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { index?: number }>(function CarouselItem(
  { index, className, ...props },
  ref,
) {
  const { count } = useCarousel();
  const messages = useMessages();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={index !== undefined ? messages.slideOf(index + 1, count) : undefined}
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
});

const navClass =
  "ui-hit-area absolute top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md outline-none backdrop-blur transition-opacity hover:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-0 [&_svg]:size-4 rtl:[&_svg]:rotate-180";

export function CarouselPrevious({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { index, scrollTo, loop } = useCarousel();
  const messages = useMessages();
  return (
    <button type="button" aria-label={messages.previous} disabled={!loop && index === 0} onClick={() => scrollTo(index - 1)} className={cn(navClass, "start-2", className)} {...props}>
      <ChevronLeftIcon />
    </button>
  );
}

export function CarouselNext({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { index, count, scrollTo, loop } = useCarousel();
  const messages = useMessages();
  return (
    <button type="button" aria-label={messages.next} disabled={!loop && index >= count - 1} onClick={() => scrollTo(index + 1)} className={cn(navClass, "end-2", className)} {...props}>
      <ChevronRightIcon />
    </button>
  );
}

/** Slide picker dots; each dot is a labelled button. */
export function CarouselDots({ className }: { className?: string }) {
  const { index, count, scrollTo } = useCarousel();
  const messages = useMessages();
  return (
    <div className={cn("mt-3 flex justify-center gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={messages.slideOf(i + 1, count)}
          aria-current={i === index ? "true" : undefined}
          onClick={() => scrollTo(i)}
          className="ui-hit-area h-2 w-2 rounded-full bg-border-strong outline-none transition-[width,background-color] focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:w-5 aria-[current=true]:bg-primary"
        />
      ))}
    </div>
  );
}

/** Play/pause control required for auto-advancing content (WCAG 2.2.2). */
export function CarouselPlayToggle({ className }: { className?: string }) {
  const { playing, setPlaying, autoplay } = useCarousel();
  const messages = useMessages();
  if (!autoplay) return null;
  return (
    <button
      type="button"
      aria-label={playing ? messages.pauseAutoplay : messages.playAutoplay}
      onClick={() => setPlaying(!playing)}
      className={cn("ui-hit-area inline-flex size-8 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5", className)}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}
