export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds a value to the nearest step, anchored at `min`, avoiding float drift. */
export function snapToStep(value: number, step: number, min = 0): number {
  const decimals = (String(step).split(".")[1] ?? "").length;
  const snapped = Math.round((value - min) / step) * step + min;
  return Number(snapped.toFixed(decimals));
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}

let idCounter = 0;
/** Non-React unique id helper (prefer `React.useId` inside components). */
export function uniqueId(prefix = "ui"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function callAll<Args extends unknown[]>(
  ...fns: Array<((...args: Args) => void) | undefined>
): (...args: Args) => void {
  return (...args) => fns.forEach((fn) => fn?.(...args));
}

export function getInitials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => Array.from(part)[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Builds a compact page list with ellipses for pagination, e.g.
 * `[1, "ellipsis", 4, 5, 6, "ellipsis", 20]`.
 */
export function getPaginationRange(
  page: number,
  total: number,
  siblings = 1,
  boundaries = 1,
): Array<number | "ellipsis"> {
  const totalNumbers = siblings * 2 + 3 + boundaries * 2;
  if (totalNumbers >= total) return range(1, total);

  const leftSibling = Math.max(page - siblings, boundaries + 2);
  const rightSibling = Math.min(page + siblings, total - boundaries - 1);
  const showLeft = leftSibling > boundaries + 2;
  const showRight = rightSibling < total - boundaries - 1;

  const start = range(1, boundaries);
  const end = range(total - boundaries + 1, total);

  if (!showLeft && showRight) {
    return [...range(1, siblings * 2 + boundaries + 2), "ellipsis", ...end];
  }
  if (showLeft && !showRight) {
    return [...start, "ellipsis", ...range(total - (siblings * 2 + boundaries + 1), total)];
  }
  return [...start, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", ...end];
}
