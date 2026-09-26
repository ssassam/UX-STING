export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Backspace: "Backspace",
  Delete: "Delete",
} as const;

export type Orientation = "horizontal" | "vertical" | "both";
export type Direction = "ltr" | "rtl";

export function isActivationKey(key: string): boolean {
  return key === Keys.Enter || key === Keys.Space;
}

export interface NavigationOptions {
  orientation?: Orientation;
  dir?: Direction;
  loop?: boolean;
}

/**
 * Resolves the next index for roving-focus style navigation. Returns `null`
 * when the key is not a navigation key for the given orientation. Horizontal
 * arrows are mirrored in RTL.
 */
export function getNextIndex(
  key: string,
  current: number,
  count: number,
  { orientation = "vertical", dir = "ltr", loop = true }: NavigationOptions = {},
): number | null {
  if (count <= 0) return null;
  const horizontal = orientation !== "vertical";
  const vertical = orientation !== "horizontal";
  const forwardKey = dir === "rtl" ? Keys.ArrowLeft : Keys.ArrowRight;
  const backwardKey = dir === "rtl" ? Keys.ArrowRight : Keys.ArrowLeft;

  let delta = 0;
  if ((vertical && key === Keys.ArrowDown) || (horizontal && key === forwardKey)) delta = 1;
  else if ((vertical && key === Keys.ArrowUp) || (horizontal && key === backwardKey)) delta = -1;
  else if (key === Keys.Home) return 0;
  else if (key === Keys.End) return count - 1;
  else return null;

  const next = current + delta;
  if (loop) return (next + count) % count;
  return Math.min(count - 1, Math.max(0, next));
}

export interface Shortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  /** `mod` is Cmd on Apple platforms and Ctrl elsewhere. */
  mod?: boolean;
}

export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

/** Parses strings such as `"mod+k"`, `"shift+?"` or `"ctrl+alt+Delete"`. */
export function parseShortcut(shortcut: string): Shortcut {
  const parts = shortcut.split("+").map((p) => p.trim());
  const key = parts.pop() ?? "";
  const mods = new Set(parts.map((p) => p.toLowerCase()));
  return {
    key,
    meta: mods.has("meta") || mods.has("cmd"),
    ctrl: mods.has("ctrl") || mods.has("control"),
    alt: mods.has("alt") || mods.has("option"),
    shift: mods.has("shift"),
    mod: mods.has("mod"),
  };
}

export function matchesShortcut(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">,
  shortcut: string | Shortcut,
  apple = isApplePlatform(),
): boolean {
  const s = typeof shortcut === "string" ? parseShortcut(shortcut) : shortcut;
  const wantMeta = Boolean(s.meta || (s.mod && apple));
  const wantCtrl = Boolean(s.ctrl || (s.mod && !apple));
  return (
    event.key.toLowerCase() === s.key.toLowerCase() &&
    event.metaKey === wantMeta &&
    event.ctrlKey === wantCtrl &&
    event.altKey === Boolean(s.alt) &&
    (s.key.length > 1 || /[a-z0-9]/i.test(s.key) ? event.shiftKey === Boolean(s.shift) : true)
  );
}

/** Formats a shortcut for display, e.g. `"mod+k"` → `"⌘K"` or `"Ctrl+K"`. */
export function formatShortcut(shortcut: string, apple = isApplePlatform()): string {
  const s = parseShortcut(shortcut);
  const key = s.key.length === 1 ? s.key.toUpperCase() : s.key;
  if (apple) {
    return [s.ctrl && "⌃", s.alt && "⌥", s.shift && "⇧", (s.meta || s.mod) && "⌘", key]
      .filter(Boolean)
      .join("");
  }
  return [(s.ctrl || s.mod) && "Ctrl", s.alt && "Alt", s.shift && "Shift", s.meta && "Win", key]
    .filter(Boolean)
    .join("+");
}
