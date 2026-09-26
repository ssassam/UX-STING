"use client";
import { useCallback, type Ref, type RefCallback } from "react";
import { mergeRefs } from "@ux-sting/utils";

/** Combines multiple refs into one stable callback ref. */
export function useMergedRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  // Refs are compared by identity, so the spread list is the correct dependency array.
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
