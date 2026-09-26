/** Shared focus-visible ring. Uses tokens, so it adapts to every theme. */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Focus ring for elements that receive focus inside a container (inset). */
export const focusRingInset =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "summary",
  "[contenteditable=true]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true",
  );
}

export function focusFirst(container: ParentNode): boolean {
  const [first] = getFocusableElements(container);
  first?.focus();
  return Boolean(first);
}
