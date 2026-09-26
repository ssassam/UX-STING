"use client";
import { useCallback, useRef, useState, type SetStateAction } from "react";
import { useCallbackRef } from "./use-callback-ref.js";

export interface UseControllableStateOptions<T> {
  /** Controlled value. When defined, the component is controlled. */
  value?: T | undefined;
  /** Initial value for uncontrolled usage. */
  defaultValue: T;
  /** Called whenever the value changes (controlled or uncontrolled). */
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Unifies controlled and uncontrolled state. Every stateful unified-ui
 * component uses this so `value`/`defaultValue`/`onChange` behave identically.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: SetStateAction<T>) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const handleChange = useCallbackRef(onChange);
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      currentRef.current = resolved;
      if (!isControlled) setInternal(resolved);
      handleChange(resolved);
    },
    [isControlled, handleChange],
  );

  return [current, setValue];
}
