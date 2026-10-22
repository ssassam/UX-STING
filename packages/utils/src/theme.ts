export type ColorMode = "light" | "dark" | "high-contrast" | "system";
export type DensityMode = "compact" | "comfortable" | "spacious";

export interface ThemeAttributes {
  mode?: ColorMode;
  density?: DensityMode;
  theme?: string;
}

/** Applies theme attributes to an element (defaults to `<html>`). */
export function applyThemeAttributes(attrs: ThemeAttributes, el?: HTMLElement): void {
  const target = el ?? (typeof document !== "undefined" ? document.documentElement : undefined);
  if (!target) return;
  if (attrs.mode) {
    target.dataset.theme = attrs.mode;
    target.style.colorScheme = resolveColorMode(attrs.mode) === "dark" ? "dark" : "light";
  }
  if (attrs.density) target.dataset.density = attrs.density;
  if (attrs.theme) target.dataset.uiTheme = attrs.theme;
}

/** Resolves `system` to a concrete mode using `prefers-color-scheme`. */
export function resolveColorMode(mode: ColorMode): Exclude<ColorMode, "system"> {
  if (mode !== "system") return mode;
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Inline script (as a string) that applies the persisted color mode before
 * first paint, preventing a flash of the wrong theme in SSR apps. With `theme`,
 * it also sets `data-ui-theme`, so a named or custom theme's colors apply
 * before hydration instead of the default theme's.
 */
export function getThemeScript(
  storageKey = "ui-color-mode",
  fallback: ColorMode = "light",
  theme?: string,
): string {
  // Escape "<" so a value can never close the surrounding <script> element.
  const js = (v: string) => JSON.stringify(v).replace(/</g, "\\u003c");
  const name = theme ? `d.setAttribute("data-ui-theme",${js(theme)});` : "";
  return `(function(){var d=document.documentElement;${name}try{var m=localStorage.getItem(${js(storageKey)})||${js(fallback)};d.dataset.theme=m;var dark=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);d.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;
}
