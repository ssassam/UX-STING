"use client";
import { useEffect } from "react";
import { useCallbackRef } from "./use-callback-ref.js";

/** Runs `callback` every `delay` ms; pass `null` to pause. */
export function useInterval(callback: () => void, delay: number | null): void {
  const stable = useCallbackRef(callback);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(stable, delay);
    return () => clearInterval(id);
  }, [delay, stable]);
}
