"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { flushSync } from "react-dom";
import {
  animateSize,
  popNumber,
  reorder,
  trackIndicator,
  type IndicatorOptions,
  type MotionOptions,
  type ReorderOptions,
} from "./core.js";

/** Glides `.us-tab-indicator` under the selected tab of the tablist in `ref`. */
export function useTabIndicator(ref: RefObject<HTMLElement | null>, options?: IndicatorOptions) {
  const selected = options?.selected;
  useEffect(() => {
    if (!ref.current) return;
    return trackIndicator(ref.current, selected ? { selected } : {});
  }, [ref, selected]);
}

/**
 * Returns `run(update)`: applies a React state update synchronously inside
 * a View Transition / FLIP so the list in `ref` animates to its new order.
 */
export function useReorder(ref: RefObject<HTMLElement | null>, options?: ReorderOptions) {
  const opts = useRef(options);
  opts.current = options;
  return useCallback(
    (update: () => void) => {
      if (!ref.current) return update();
      void reorder(ref.current, () => flushSync(update), opts.current);
    },
    [ref],
  );
}

/** Returns `run(update)`: animates the size of the element in `ref` across a state update. */
export function useAnimateSize(ref: RefObject<HTMLElement | null>, options?: MotionOptions) {
  const opts = useRef(options);
  opts.current = options;
  return useCallback(
    (update: () => void) => {
      if (!ref.current) return update();
      void animateSize(ref.current, () => flushSync(update), opts.current);
    },
    [ref],
  );
}

/** Replays the number pop-in on the element in `ref` whenever `value` changes (not on mount). */
export function useNumberPop(ref: RefObject<HTMLElement | null>, value: unknown) {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (ref.current) popNumber(ref.current);
  }, [ref, value]);
}
