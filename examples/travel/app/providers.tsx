"use client";
import { palette } from "@ux-sting/tokens";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Wayfare's own brand theme: ocean teal, slate neutrals, generous radius. */
const wayfareTheme = {
  name: "wayfare",
  primary: "teal",
  neutral: "slate",
  radius: "large",
  colors: {
    light: {
      primary: palette.teal[700],
      "primary-hover": palette.teal[800],
      ring: palette.teal[600],
    },
  },
} as const;

export const THEMES = [
  "wayfare",
  "default",
  "modern",
  "soft",
  "material",
  "fluent",
  "carbon",
  "polaris",
  "apple",
  "baseweb",
  "stripe",
  "high-contrast",
] as const;
export type ThemeName = (typeof THEMES)[number];

const ThemeContext = createContext<{ theme: ThemeName; setTheme: (t: ThemeName) => void }>({
  theme: "wayfare",
  setTheme: () => {},
});
export const useSiteTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "wayfare-theme";

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("wayfare");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (saved && THEMES.includes(saved)) setThemeState(saved);
    } catch {
      // Storage unavailable (private mode): keep the default theme.
    }
  }, []);
  const setTheme = (next: ThemeName) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice still applies for this visit.
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UIProvider
        target="document"
        theme={theme === "wayfare" ? wayfareTheme : theme}
        storageKey="wayfare-color-mode"
      >
        <TooltipProvider>
          {children}
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </UIProvider>
    </ThemeContext.Provider>
  );
}
