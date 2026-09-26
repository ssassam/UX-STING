"use client";
import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";

/** Returns a stable function that always calls the latest `callback`. */
export function useCallbackRef<Args extends unknown[], R>(
  callback: ((...args: Args) => R) | undefined,
): (...args: Args) => R | undefined {
  const ref = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  });
  return useCallback((...args: Args) => ref.current?.(...args), []);
}
