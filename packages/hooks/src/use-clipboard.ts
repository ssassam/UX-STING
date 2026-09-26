"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Copies text to the clipboard and exposes a temporary `copied` flag. */
export function useClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Copy failed"));
      }
    },
    [timeout],
  );

  return { copy, copied, error };
}
