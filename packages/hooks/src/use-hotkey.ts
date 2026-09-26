"use client";
import { useEffect } from "react";
import { matchesShortcut } from "@unified-ui/utils";
import { useCallbackRef } from "./use-callback-ref.js";

export interface UseHotkeyOptions {
  enabled?: boolean;
  /** Also fire while focus is in an input, textarea or contenteditable. */
  enableInInputs?: boolean;
  preventDefault?: boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/** Binds a keyboard shortcut such as `"mod+k"` on the document. */
export function useHotkey(
  shortcut: string | string[],
  handler: (event: KeyboardEvent) => void,
  { enabled = true, enableInInputs = false, preventDefault = true }: UseHotkeyOptions = {},
): void {
  const stable = useCallbackRef(handler);
  const key = Array.isArray(shortcut) ? shortcut.join("|") : shortcut;
  useEffect(() => {
    if (!enabled) return;
    const shortcuts = key.split("|");
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enableInInputs && isEditable(event.target)) return;
      if (shortcuts.some((s) => matchesShortcut(event, s))) {
        if (preventDefault) event.preventDefault();
        stable(event);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, enabled, enableInInputs, preventDefault, stable]);
}
