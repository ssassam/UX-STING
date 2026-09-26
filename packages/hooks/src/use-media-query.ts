"use client";
import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Returns `defaultValue` during SSR, so
 * prefer CSS for layout and use this only for behavior.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : defaultValue),
    () => defaultValue,
  );
}

const BREAKPOINT_QUERIES = {
  sm: "(min-width: 40rem)",
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
  xl: "(min-width: 80rem)",
  "2xl": "(min-width: 96rem)",
} as const;

/** `true` when the viewport is at least the given breakpoint. */
export function useBreakpoint(bp: keyof typeof BREAKPOINT_QUERIES, defaultValue = false): boolean {
  return useMediaQuery(BREAKPOINT_QUERIES[bp], defaultValue);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** `true` on touch-first devices; used to enlarge hit areas and adapt overlays. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
