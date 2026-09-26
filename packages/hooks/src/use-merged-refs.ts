import { useCallback, type Ref, type RefCallback } from "react";

export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (value) => refs.forEach((ref) => setRef(ref, value));
}

/** Combines multiple refs into one stable callback ref. */
export function useMergedRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  // Refs are compared by identity, so the spread list is the correct dependency array.
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
