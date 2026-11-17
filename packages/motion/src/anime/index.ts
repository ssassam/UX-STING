"use client";

/**
 * Optional anime.js tier (`@ux-sting/motion/anime`, beta). Needs the peer
 * dependency `animejs` 4.x. anime.js is MIT-licensed and tree-shakable; the
 * hooks and presets here are about 16 KB gzipped with animejs, against about
 * 28 KB for GSAP core. It has no equivalent of GSAP's pinned scroll scrub,
 * ScrollTrigger batching or Flip; use the GSAP tier for those.
 *
 * Every hook runs inside createScope(), so selectors stay inside the component
 * and every animation and text split is reverted on unmount. Reduced motion is
 * read from a scope media query: under `prefers-reduced-motion: reduce`
 * nothing is hidden or animated, so content is shown in its natural state.
 */
import {
  animate,
  createScope,
  createTimeline,
  cubicBezier,
  onScroll,
  set,
  splitText,
  stagger,
  type JSAnimation,
  type Scope as AnimeScope,
  type TargetsParam,
} from "animejs";
import { useEffect, useLayoutEffect, type RefObject } from "react";
import { prefersReducedMotion } from "../core.js";

const REDUCE = "(prefers-reduced-motion: reduce)";
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** UX-STING's expressive entrance curve, `cubic-bezier(0.22, 1, 0.36, 1)`. */
export const EASE = cubicBezier(0.22, 1, 0.36, 1);
/** Durations in milliseconds (anime.js units). Entrances default to 600ms. */
export const DURATION = { normal: 200, slow: 300, slower: 450, entrance: 600 } as const;

type Scope = RefObject<HTMLElement | null>;

export interface AnimeContext {
  /** True under prefers-reduced-motion: reduce. Build a still version then. */
  reduced: boolean;
  /** The anime.js scope. Animations created inside it revert on unmount. */
  scope: AnimeScope;
}

export interface UseAnimeMotionOptions {
  scope: Scope;
  /** Rebuild (revert, then build again) when these change. Default: build once on mount. */
  dependencies?: unknown[];
}

/**
 * The base hook: runs `build` inside createScope() on the scope element. It may
 * return a cleanup function, for example to revert a text split. Everything is
 * reverted when the dependencies change or the component unmounts.
 */
export function useAnimeMotion(
  build: (ctx: AnimeContext) => void | (() => void),
  options: UseAnimeMotionOptions,
) {
  const { scope: ref, dependencies = [] } = options;
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const scope = createScope({ root, mediaQueries: { reduce: REDUCE } });
    scope.add((self) => {
      const current = self ?? scope;
      return build({ reduced: Boolean(current.matches.reduce), scope: current }) ?? undefined;
    });
    return () => scope.revert();
    // The caller's dependencies decide when to rebuild.
  }, [ref, ...dependencies]);
}

export interface ScrollRevealOptions {
  /** Targets inside the scope. Default `[data-reveal]`. */
  selector?: string;
  /** Rise distance in px. Default 24. */
  y?: number;
  /** Delay between targets in ms. Default 80. Keep groups short. */
  stagger?: number;
  /** Duration in ms. Default 600. */
  duration?: number;
  /**
   * When to start, in anime.js threshold form `container target`. The default
   * `85% top` starts when the target's top edge reaches 85% of the viewport.
   */
  enter?: string;
}

/**
 * Reveals `[data-reveal]` elements as they scroll into view. Each one reveals
 * once. Content is hidden only once JavaScript runs and motion is allowed, and
 * is never hidden under reduced motion.
 */
export function useScrollReveal(scope: Scope, options: ScrollRevealOptions = {}) {
  const {
    selector = "[data-reveal]",
    y = 24,
    stagger: step = 80,
    duration = DURATION.entrance,
    enter = "85% top",
  } = options;
  useAnimeMotion(
    ({ reduced }) => {
      if (reduced || !scope.current) return;
      const targets = Array.from(scope.current.querySelectorAll<HTMLElement>(selector));
      targets.forEach((el, i) => {
        set(el, { opacity: 0, translateY: y });
        animate(el, {
          opacity: 1,
          translateY: 0,
          duration,
          delay: i * step,
          ease: EASE,
          autoplay: onScroll({ target: el, enter }),
        });
      });
    },
    { scope },
  );
}

export interface SplitHeadingOptions {
  /** Unit to animate. Default "words". */
  type?: "lines" | "words" | "chars";
  /** Delay between units in ms. Default 60 (20 for chars). */
  stagger?: number;
  /** Duration in ms. Default 800. */
  duration?: number;
  /** Start when the heading scrolls into view instead of on mount. */
  onScroll?: boolean;
}

/**
 * Animates a heading by lines, words or characters with anime.js's text
 * splitter, in accessible mode so screen readers still read the heading as
 * one piece of text. Under reduced motion the heading is left untouched. The
 * split is reverted on unmount. Use it for static heading text only: a heading
 * whose text React re-renders will fight the split.
 */
export function useSplitHeading(ref: Scope, options: SplitHeadingOptions = {}) {
  const {
    type = "words",
    stagger: step = type === "chars" ? 20 : 60,
    duration = 800,
    onScroll: startOnScroll = false,
  } = options;
  useAnimeMotion(
    ({ reduced }) => {
      const el = ref.current;
      if (reduced || !el) return;
      const split = splitText(el, {
        lines: type === "lines",
        words: type === "words",
        chars: type === "chars",
        accessible: true,
      });
      const parts = type === "lines" ? split.lines : type === "chars" ? split.chars : split.words;
      animate(parts, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration,
        delay: stagger(step),
        ease: EASE,
        ...(startOnScroll ? { autoplay: onScroll({ target: el, enter: "85% top" }) } : {}),
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [type, step, duration, startOnScroll] },
  );
}

export interface FadeUpOptions {
  /** Rise distance in px. Default 24. */
  y?: number;
  /** Duration in ms. Default 600. */
  duration?: number;
  /** Delay between targets in ms. Default 80. */
  stagger?: number;
  /** Delay before the first target in ms. Default 0. */
  delay?: number;
}

/**
 * Fades and rises targets in, one after another. Under reduced motion the
 * targets jump straight to their final state. Returns the animation so you can
 * add it to a timeline or cancel it.
 */
export function fadeUp(targets: TargetsParam, options: FadeUpOptions = {}): JSAnimation {
  const { y = 24, duration = DURATION.entrance, stagger: step = 80, delay = 0 } = options;
  if (prefersReducedMotion()) return set(targets, { opacity: 1, translateY: 0 });
  set(targets, { opacity: 0, translateY: y });
  return animate(targets, {
    opacity: 1,
    translateY: 0,
    duration,
    delay: stagger(step, { start: delay }),
    ease: EASE,
  });
}

export { animate, createTimeline, onScroll, set, splitText, stagger };
