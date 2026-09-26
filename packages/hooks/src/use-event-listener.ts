"use client";
import { useEffect } from "react";
import { useCallbackRef } from "./use-callback-ref.js";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target: Window | Document | HTMLElement | null | undefined = typeof window !== "undefined"
    ? window
    : undefined,
  options?: AddEventListenerOptions,
): void {
  const stable = useCallbackRef(handler);
  useEffect(() => {
    if (!target) return;
    const listener = (e: Event) => stable(e as WindowEventMap[K]);
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, target, stable, options?.capture, options?.passive]);
}
