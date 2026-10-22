"use client";

/**
 * Optional GSAP tier (`@ux-sting/motion/gsap`). Needs the peer dependencies
 * `gsap` (3.13+, which ships ScrollTrigger, SplitText and Flip) and
 * `@gsap/react`. Every hook is built on useGSAP() with a scope ref, so
 * selectors stay inside the component and everything — tweens,
 * ScrollTriggers, SplitText — is reverted on unmount. Reduced motion is
 * handled with gsap.matchMedia(): under `prefers-reduced-motion: reduce` the
 * content is simply shown in its final, natural state.
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";

let registered = false;
/** Registers useGSAP, ScrollTrigger, SplitText and Flip once (browser only). */
export function registerMotionPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);
  registered = true;
}

const REDUCE = "(prefers-reduced-motion: reduce)";
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Scope = RefObject<HTMLElement | null>;
type ContextSafe = <T extends (...args: never[]) => unknown>(fn: T) => T;

export interface MotionContext {
  /** True under prefers-reduced-motion: reduce. Build a still version then. */
  reduced: boolean;
  /** Wrap event handlers / callbacks so they no-op after unmount. */
  contextSafe: ContextSafe;
}

export interface UseMotionOptions {
  scope: Scope;
  dependencies?: unknown[];
  /** Revert and rebuild when dependencies change (default true when dependencies are given). */
  revertOnUpdate?: boolean;
}

/**
 * The base hook: useGSAP + gsap.matchMedia for reduced motion. Your callback
 * runs once per motion preference and is reverted when it changes or the
 * component unmounts.
 */
export function useMotion(
  build: (ctx: MotionContext) => void | (() => void),
  options: UseMotionOptions,
) {
  registerMotionPlugins();
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      // "all" always matches, so the callback runs even where the
      // reduced-motion query is unknown; `reduce` tells the two apart.
      mm.add({ reduce: REDUCE, all: "all" }, (c) =>
        build({ reduced: Boolean(c.conditions?.reduce), contextSafe: contextSafe as ContextSafe }),
      );
      return () => mm.revert();
    },
    {
      scope: options.scope,
      dependencies: options.dependencies ?? [],
      revertOnUpdate: options.revertOnUpdate ?? Boolean(options.dependencies?.length),
    },
  );
}

export interface ScrollRevealOptions {
  /** Targets inside the scope. Default `[data-reveal]`. */
  selector?: string;
  /** Rise distance in px. */
  y?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start. Default "top 85%". */
  start?: string;
  /** Reveal once (default) or reverse when scrolling back. */
  once?: boolean;
}

/**
 * Reveals `[data-reveal]` children as they scroll into view, batched so rows
 * stagger together. Content is hidden only once JavaScript runs and motion is
 * allowed, and is never hidden under reduced motion.
 */
export function useScrollReveal(scope: Scope, options: ScrollRevealOptions = {}) {
  const {
    selector = "[data-reveal]",
    y = 24,
    stagger = 0.08,
    duration = 0.6,
    start = "top 85%",
    once = true,
  } = options;
  useMotion(
    ({ reduced }) => {
      if (reduced) return;
      const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current);
      if (!targets.length) return;
      gsap.set(targets, { autoAlpha: 0, y });
      ScrollTrigger.batch(targets, {
        start,
        once,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration,
            stagger,
            ease: "power2.out",
            overwrite: true,
          }),
        ...(once
          ? {}
          : { onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y, overwrite: true }) }),
      });
    },
    { scope },
  );
}

export interface PinnedScrubOptions {
  /** Element (inside the scope) to pin. Default: the scope itself. */
  pin?: string;
  /** Scroll distance of the sequence. Default "+=100%". */
  end?: string;
  /** Smoothing in seconds, or true for direct scrub. Default 1. */
  scrub?: number | true;
  /** Adds tweens to the scrubbed timeline. Animate children of the pinned element, not the element itself. */
  build: (tl: gsap.core.Timeline) => void;
  /** Optional still state for reduced motion (e.g. show the last step). */
  reduced?: () => void;
}

/**
 * Pins a section and scrubs a timeline with scroll (one storytelling
 * sequence per page). ScrollTrigger lives on the timeline, never on child
 * tweens. Under reduced motion nothing is pinned.
 */
export function usePinnedScrub(scope: Scope, options: PinnedScrubOptions) {
  useMotion(
    ({ reduced }) => {
      if (reduced) {
        options.reduced?.();
        return;
      }
      const pinned = options.pin
        ? scope.current?.querySelector<HTMLElement>(options.pin)
        : scope.current;
      if (!pinned) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: options.end ?? "+=100%",
          pin: true,
          scrub: options.scrub ?? 1,
        },
      });
      options.build(tl);
    },
    { scope },
  );
}

export interface SplitHeadingOptions {
  /** Unit to animate. Default "words" (lines need a stable layout; chars only for short display text). */
  type?: "lines" | "words" | "chars";
  stagger?: number;
  duration?: number;
  /** Start when the heading scrolls into view instead of on mount. */
  onScroll?: boolean;
}

/**
 * Animates a heading by lines, words or characters with SplitText. Screen
 * readers keep reading the whole heading (SplitText's `aria: "auto"` labels
 * the element and hides the fragments). Re-splits after fonts load and on
 * resize (`autoSplit`), and restores the original markup on unmount. Under
 * reduced motion the heading is left untouched.
 */
export function useSplitHeading(ref: Scope, options: SplitHeadingOptions = {}) {
  const {
    type = "words",
    stagger = type === "chars" ? 0.02 : 0.06,
    duration = 0.8,
    onScroll = false,
  } = options;
  useMotion(
    ({ reduced }) => {
      if (reduced || !ref.current) return;
      SplitText.create(ref.current, {
        type,
        aria: "auto",
        autoSplit: true,
        ...(type === "lines" ? { mask: "lines" as const } : {}),
        onSplit(self: SplitText) {
          const parts = type === "lines" ? self.lines : type === "chars" ? self.chars : self.words;
          return gsap.from(parts, {
            yPercent: 100,
            autoAlpha: 0,
            duration,
            stagger,
            ease: "power3.out",
            ...(onScroll
              ? { scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } }
              : {}),
          });
        },
      });
    },
    { scope: ref },
  );
}

export interface FlipLayoutOptions {
  /** Elements to track, inside the scope. Default `[data-flip-id]` (give each a stable id). */
  targets?: string;
  duration?: number;
  ease?: string;
  /** Use absolute positioning during the flip (for flex/grid reflow jumps). */
  absolute?: boolean;
}

/**
 * Flip layouts: call `capture()` right before a state change that moves
 * things (filter, sort, expand); after React commits, elements animate from
 * their old layout. Entering items fade in, leaving ones are not animated
 * (they are already gone). Reduced motion: no animation.
 */
export function useFlipLayout(scope: Scope, options: FlipLayoutOptions = {}) {
  registerMotionPlugins();
  const {
    targets = "[data-flip-id]",
    duration = 0.5,
    ease = "power2.inOut",
    absolute = false,
  } = options;
  const state = useRef<Flip.FlipState | null>(null);
  const capture = useCallback(() => {
    if (!scope.current) return;
    state.current = Flip.getState(scope.current.querySelectorAll(targets));
  }, [scope, targets]);
  useIsoLayoutEffect(() => {
    const captured = state.current;
    state.current = null;
    if (!captured || !scope.current || window.matchMedia?.(REDUCE).matches) return;
    const tween = Flip.from(captured, {
      targets: scope.current.querySelectorAll(targets),
      duration,
      ease,
      absolute,
      nested: true,
      prune: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration }),
    });
    return () => {
      tween.progress(1).kill();
    };
  });
  return { capture };
}

export * from "./presets.js";
export { gsap, ScrollTrigger, SplitText, Flip };
