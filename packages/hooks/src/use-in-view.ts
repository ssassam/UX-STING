"use client";
import { useEffect, useState, type RefObject } from "react";

export interface UseInViewOptions {
  /** Stop observing after the element first enters the viewport. Default `true`. */
  once?: boolean;
  /** Fraction of the element that must be visible (0–1). Default `0.15`. */
  amount?: number;
  /** Grows or shrinks the viewport, e.g. `"0px 0px -10% 0px"`. */
  rootMargin?: string;
}

/**
 * `true` while the element intersects the viewport. Without
 * IntersectionObserver (old browsers, SSR) it reports `true`, so content is
 * never left hidden.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, amount = 0.15, rootMargin }: UseInViewOptions = {},
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
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, amount, rootMargin]);
  return inView;
}
