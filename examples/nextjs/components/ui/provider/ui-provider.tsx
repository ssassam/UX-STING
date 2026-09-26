"use client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { createTheme, themeToCss, type ThemeConfig } from "@ux-sting/themes";
import { getDirection, resolveColorMode, type ColorMode, type DensityMode } from "@ux-sting/utils";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { UIContext, type UIContextValue } from "./context";
import { getMessages, type Messages } from "./messages";

export type RadiusOption = "none" | "small" | "medium" | "large";

export interface UIProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  children?: ReactNode;
  /** Preset name (`default`, `neutral`, `modern`, `compact`, `soft`, `high-contrast`) or a theme config. */
  theme?: string | (Omit<ThemeConfig, "name"> & { name?: string });
  /** Controlled color mode. */
  colorMode?: ColorMode;
  /** Initial color mode when uncontrolled. */
  defaultColorMode?: ColorMode;
  onColorModeChange?: (mode: ColorMode) => void;
  /** Persist the color mode in localStorage under this key (`false` disables). */
  storageKey?: string | false;
  density?: DensityMode;
  /** BCP 47 locale for formatting and built-in messages (en, fr, ar). */
  locale?: string;
  /** Writing direction; inferred from `locale` when omitted. */
  dir?: "ltr" | "rtl";
  /** Override any built-in localized strings. */
  messages?: Partial<Messages>;
  /**
   * Where attributes are applied. `scope` (default) wraps children in a div so
   * several providers can coexist; `document` applies them to `<html>`.
   */
  target?: "scope" | "document";
}

const subscribeSystem = (cb: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

function readStored(key: string | false): ColorMode | null {
  if (!key || typeof window === "undefined") return null;
  try {
    return (window.localStorage.getItem(key) as ColorMode | null) ?? null;
  } catch {
    return null;
  }
}

/**
 * Root provider: theme, color mode, density, locale/direction and portal
 * container. Light mode is the default.
 *
 * ```tsx
 * <UIProvider theme="modern" density="compact" locale="fr">
 *   <App />
 * </UIProvider>
 * ```
 */
export function UIProvider({
  children,
  theme = "default",
  colorMode: colorModeProp,
  defaultColorMode = "light",
  onColorModeChange,
  storageKey = false,
  density = "comfortable",
  locale = "en",
  dir: dirProp,
  messages: messageOverrides,
  target = "scope",
  className,
  style,
  ...props
}: UIProviderProps) {
  const [internalMode, setInternalMode] = useState<ColorMode>(defaultColorMode);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const colorMode = colorModeProp ?? internalMode;

  useEffect(() => {
    const stored = readStored(storageKey);
    if (stored && colorModeProp === undefined) setInternalMode(stored);
  }, [storageKey, colorModeProp]);

  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => resolveColorMode("system") === "dark",
    () => false,
  );
  const resolvedColorMode = colorMode === "system" ? (systemDark ? "dark" : "light") : colorMode;

  const dir = dirProp ?? getDirection(locale);
  const themeName = typeof theme === "string" ? theme : (theme.name ?? "custom");
  const customCss = useMemo(
    () =>
      typeof theme === "string" ? null : themeToCss(createTheme({ ...theme, name: themeName })),
    [theme, themeName],
  );

  const messages = useMemo(
    () => ({ ...getMessages(locale), ...messageOverrides }),
    [locale, messageOverrides],
  );

  const value = useMemo<UIContextValue>(
    () => ({
      locale,
      dir,
      messages,
      colorMode,
      resolvedColorMode,
      setColorMode: (mode) => {
        if (colorModeProp === undefined) setInternalMode(mode);
        if (storageKey) {
          try {
            window.localStorage.setItem(storageKey, mode);
          } catch {
            /* storage unavailable */
          }
        }
        onColorModeChange?.(mode);
      },
      density,
      theme: themeName,
      portalContainer,
    }),
    [
      locale,
      dir,
      messages,
      colorMode,
      resolvedColorMode,
      colorModeProp,
      storageKey,
      onColorModeChange,
      density,
      themeName,
      portalContainer,
    ],
  );

  const attrs = {
    "data-ui-theme": themeName,
    "data-theme": colorMode,
    "data-density": density,
    dir,
    lang: locale,
  };

  // Disable transitions for one frame while the mode/theme changes (prevents color flashes).
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const el = target === "document" ? document.documentElement : scopeRef.current;
    if (!el) return;
    el.setAttribute("data-ui-switching", "");
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => el.removeAttribute("data-ui-switching"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      el.removeAttribute("data-ui-switching");
    };
  }, [colorMode, themeName, target]);

  useEffect(() => {
    if (target !== "document") return;
    const el = document.documentElement;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.style.colorScheme = resolvedColorMode === "dark" ? "dark" : "light";
  });

  const content = (
    <DirectionProvider dir={dir}>
      {customCss ? <style data-ui-custom-theme={themeName}>{customCss}</style> : null}
      {children}
      <div data-ui-portal-root="" ref={setPortalContainer} />
    </DirectionProvider>
  );

  return (
    <UIContext.Provider value={value}>
      {target === "document" ? (
        content
      ) : (
        <div
          ref={scopeRef}
          {...attrs}
          className={className ? `ui-root ${className}` : "ui-root"}
          style={style}
          {...props}
        >
          {content}
        </div>
      )}
    </UIContext.Provider>
  );
}
