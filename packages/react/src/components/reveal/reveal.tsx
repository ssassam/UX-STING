"use client";
import { useMergedRefs, usePrefersReducedMotion } from "@ux-sting/hooks";
import { cn } from "@ux-sting/utils";
import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

const effectClass = {
  fade: "",
  "slide-up": "data-[reveal=hidden]:translate-y-6",
  "slide-start": "data-[reveal=hidden]:-translate-x-6 rtl:data-[reveal=hidden]:translate-x-6",
  scale: "data-[reveal=hidden]:scale-95",
} as const;

export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Entrance effect. Only transform and opacity animate. Default `"slide-up"`. */
  effect?: keyof typeof effectClass;
  /** Delay before the entrance, in ms. */
  delay?: number;
  /** Viewport margin; negative values wait until the element is further in view. */
  rootMargin?: string;
}

/**
 * Animates content in the first time it scrolls into view. Content that is
 * already visible on load, server-rendered pages without JS and users who
 * prefer reduced motion all see it immediately — nothing is ever stuck hidden.
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  {
    effect = "slide-up",
    delay = 0,
    rootMargin = "0px 0px -10% 0px",
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const local = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, local);
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = local.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    // Only hide what starts below the fold; on-screen content never flickers.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, rootMargin]);

  return (
    <div
      ref={mergedRef}
      data-reveal={state === "idle" ? undefined : state}
      className={cn(
        "transition-[opacity,translate,scale] duration-(--ui-duration-slower) ease-(--ui-ease-out)",
        "data-[reveal=hidden]:opacity-0",
        effectClass[effect],
        className,
      )}
      style={delay ? ({ transitionDelay: `${delay}ms`, ...style } as CSSProperties) : style}
      {...props}
    >
      {children}
    </div>
  );
});

export interface RevealGroupProps extends HTMLAttributes<HTMLDivElement> {
  effect?: RevealProps["effect"];
  /** Delay added per child, in ms. Default 80. */
  stagger?: number;
  /** Cap on the accumulated delay so long lists do not lag. Default 480. */
  maxDelay?: number;
}

/**
 * Wraps each child in a `Reveal` with an increasing delay — for card grids
 * and feature lists. The group itself stays a plain layout element, so pass
 * grid or flex classes through `className`.
 */
export const RevealGroup = forwardRef<HTMLDivElement, RevealGroupProps>(function RevealGroup(
  { effect, stagger = 80, maxDelay = 480, children, ...props },
  ref,
) {
  let index = 0;
  return (
    <div ref={ref} {...props}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const delay = Math.min(index++ * stagger, maxDelay);
        return (
          <Reveal effect={effect} delay={delay}>
            {child}
          </Reveal>
        );
      })}
    </div>
  );
});
