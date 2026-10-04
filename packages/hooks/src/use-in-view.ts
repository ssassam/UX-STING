"use client";
import { useEffect, useState, type RefObject } from "react";

export interface UseInViewOptions {
  /** Margin around the viewport, e.g. `"0px 0px -10% 0px"` to trigger a bit later. */
  rootMargin?: string;
  /** Fraction of the element that must be visible. Default 0. */
  threshold?: number;
  /** Stop observing after the first time the element enters. Default `true`. */
  once?: boolean;
}

/**
 * `true` while the element intersects the viewport. Without
 * `IntersectionObserver` (old browsers, tests) it reports `true` so content
 * that waits on it is never stuck hidden.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin, threshold = 0, once = true }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}
