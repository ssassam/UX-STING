"use client";
import { useCallback, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { getNextIndex, type NavigationOptions } from "@unified-ui/utils";

export interface UseRovingFocusOptions extends NavigationOptions {
  /** CSS selector for the focusable items inside the container. */
  itemSelector?: string;
}

/**
 * Keyboard navigation between items inside a container (arrow keys,
 * Home/End, RTL-aware). Returns an `onKeyDown` handler for the container.
 */
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  { itemSelector = "[data-roving-item]:not([disabled]):not([aria-disabled=true])", ...options }: UseRovingFocusOptions = {},
) {
  return useCallback(
    (event: ReactKeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next = getNextIndex(event.key, current === -1 ? 0 : current, items.length, options);
      if (next === null) return;
      event.preventDefault();
      items[next]?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRef, itemSelector, options.dir, options.loop, options.orientation],
  );
}
