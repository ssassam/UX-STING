/**
 * Framework-agnostic helpers behind the CSS catalog. Nothing touches the DOM
 * at import time, so they are safe to import from server components; call
 * them only in the browser (event handlers, effects).
 */

export interface MotionOptions {
  /** Milliseconds. Defaults to the token `--ui-duration-slow` (300ms). */
  duration?: number;
  /** CSS easing. Defaults to the token `--ui-ease-standard`. */
  easing?: string;
}

const STANDARD = "cubic-bezier(0.2, 0, 0, 1)";

/** True when the user asked for reduced motion (false on the server). */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

const canAnimate = (el: Element) => typeof (el as HTMLElement).animate === "function";

/** Reads a duration token (e.g. `--ui-duration-slow`) from an element, in ms. */
export function tokenDuration(el: Element, name = "--ui-duration-slow", fallback = 300): number {
  if (typeof getComputedStyle !== "function") return fallback;
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const ms = raw.endsWith("ms")
    ? parseFloat(raw)
    : raw.endsWith("s")
      ? parseFloat(raw) * 1000
      : NaN;
  return Number.isFinite(ms) ? ms : fallback;
}

type Rect = Pick<DOMRect, "left" | "top" | "width" | "height">;
const measure = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/**
 * FLIP: records where `elements` are, runs `mutate`, then animates each one
 * from its old place and size to the new one with the Web Animations API.
 * Elements that appear during `mutate` fade in. Under reduced motion it only
 * runs `mutate`.
 */
export async function flip(
  elements: Iterable<Element> | (() => Iterable<Element>),
  mutate: () => void | Promise<void>,
  options: MotionOptions = {},
): Promise<void> {
  const list = () => Array.from(typeof elements === "function" ? elements() : elements);
  if (prefersReducedMotion()) {
    await mutate();
    return;
  }
  const first = new Map(list().map((el) => [el, measure(el)]));
  await mutate();
  const animations: Animation[] = [];
  for (const el of list()) {
    if (!canAnimate(el)) continue;
    const duration = options.duration ?? tokenDuration(el);
    const easing = options.easing ?? STANDARD;
    const before = first.get(el);
    if (!before) {
      animations.push(
        (el as HTMLElement).animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing }),
      );
      continue;
    }
    const after = measure(el);
    const dx = before.left - after.left;
    const dy = before.top - after.top;
    const sx = after.width ? before.width / after.width : 1;
    const sy = after.height ? before.height / after.height : 1;
    if (
      Math.abs(dx) < 0.5 &&
      Math.abs(dy) < 0.5 &&
      Math.abs(sx - 1) < 0.01 &&
      Math.abs(sy - 1) < 0.01
    )
      continue;
    animations.push(
      (el as HTMLElement).animate(
        [
          { transformOrigin: "0 0", transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transformOrigin: "0 0", transform: "none" },
        ],
        { duration, easing },
      ),
    );
  }
  await Promise.all(animations.map((a) => a.finished.catch(() => undefined)));
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> };
};

/**
 * Runs `mutate` inside a View Transition when the browser supports it and
 * motion is allowed; otherwise runs `fallback` (or just `mutate`).
 */
export async function withViewTransition(
  mutate: () => void | Promise<void>,
  fallback?: () => Promise<void>,
): Promise<void> {
  const doc = typeof document !== "undefined" ? (document as ViewTransitionDocument) : undefined;
  if (doc?.startViewTransition && !prefersReducedMotion()) {
    await doc.startViewTransition(mutate).finished.catch(() => undefined);
    return;
  }
  await (fallback ? fallback() : mutate());
}

export interface ReorderOptions extends MotionOptions {
  /** Selects the items inside the container. Default: direct children. */
  items?: string;
  /** Attribute holding a stable key per item. Default `data-key`, then `id`. */
  key?: string;
}

const cssIdent = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "_");

/**
 * Animates a list reorder (sort, filter, drag-drop result). Uses the View
 * Transitions API with a unique `view-transition-name` per item, falling back
 * to `flip()`. Pair with `css/list-reorder.css`.
 */
export async function reorder(
  container: Element,
  mutate: () => void | Promise<void>,
  options: ReorderOptions = {},
): Promise<void> {
  const select = () =>
    Array.from(container.querySelectorAll(options.items ?? ":scope > *")) as HTMLElement[];
  const name = () =>
    select().forEach((el, i) => {
      const key = el.getAttribute(options.key ?? "data-key") ?? el.id ?? "";
      el.style.setProperty("view-transition-name", `us-${cssIdent(key || `i${i}`)}`);
    });
  const clear = () => select().forEach((el) => el.style.removeProperty("view-transition-name"));
  const doc = typeof document !== "undefined" ? (document as ViewTransitionDocument) : undefined;
  if (doc?.startViewTransition && !prefersReducedMotion()) {
    name();
    try {
      await withViewTransition(async () => {
        await mutate();
        name();
      });
    } finally {
      clear();
    }
    return;
  }
  await flip(select, mutate, options);
}

/**
 * Animates an element's size across a content change (card resize).
 * Pair with `css/card-resize.css` for the CSS-only toggle.
 */
export async function animateSize(
  el: HTMLElement,
  mutate: () => void | Promise<void>,
  options: MotionOptions = {},
): Promise<void> {
  if (prefersReducedMotion() || !canAnimate(el)) {
    await mutate();
    return;
  }
  const before = measure(el);
  await mutate();
  const after = measure(el);
  if (Math.abs(before.height - after.height) < 0.5 && Math.abs(before.width - after.width) < 0.5)
    return;
  const overflow = el.style.overflow;
  el.style.overflow = "clip";
  const anim = el.animate(
    [
      { height: `${before.height}px`, width: `${before.width}px` },
      { height: `${after.height}px`, width: `${after.width}px` },
    ],
    { duration: options.duration ?? tokenDuration(el), easing: options.easing ?? STANDARD },
  );
  await anim.finished.catch(() => undefined);
  el.style.overflow = overflow;
}

/**
 * Sets a number's text (optional) and replays the pop-in from
 * `css/number-pop.css`. Format the value yourself (e.g. Intl.NumberFormat).
 */
export function popNumber(el: HTMLElement, text?: string): void {
  if (text !== undefined) el.textContent = text;
  el.removeAttribute("data-pop");
  // Reading layout restarts the CSS animation on the next attribute change.
  void el.offsetWidth;
  el.setAttribute("data-pop", "");
}

export interface IndicatorOptions {
  /** Selector of the selected tab. Default `[role="tab"][aria-selected="true"]`. */
  selected?: string;
}

/**
 * Keeps `--us-indicator-start` / `--us-indicator-size` on a tablist in sync
 * with the selected tab (inline-start offset, so it mirrors in RTL). Pair
 * with `css/tab-indicator.css`. Returns a cleanup function.
 */
export function trackIndicator(tablist: HTMLElement, options: IndicatorOptions = {}): () => void {
  const selector = options.selected ?? '[role="tab"][aria-selected="true"]';
  const update = () => {
    const tab = tablist.querySelector<HTMLElement>(selector);
    if (!tab) return;
    const list = tablist.getBoundingClientRect();
    const r = tab.getBoundingClientRect();
    const rtl = getComputedStyle(tablist).direction === "rtl";
    const start = rtl ? list.right - r.right : r.left - list.left;
    tablist.style.setProperty(
      "--us-indicator-start",
      `${start + (rtl ? 0 : tablist.scrollLeft)}px`,
    );
    tablist.style.setProperty("--us-indicator-size", `${r.width}px`);
  };
  tablist.setAttribute("data-us-indicator", "");
  update();
  const mo = typeof MutationObserver === "function" ? new MutationObserver(update) : undefined;
  mo?.observe(tablist, {
    attributes: true,
    subtree: true,
    attributeFilter: ["aria-selected", "data-state"],
  });
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(update) : undefined;
  ro?.observe(tablist);
  return () => {
    mo?.disconnect();
    ro?.disconnect();
    tablist.removeAttribute("data-us-indicator");
  };
}
