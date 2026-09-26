"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import { useEffect, useState, type ReactNode } from "react";
import { SiteHeader, type SearchEntry } from "./site-header";

function usePersisted(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(stored);
    } catch {
      /* ignore */
    }
  }, [key]);
  const update = (v: string) => {
    setValue(v);
    try {
      localStorage.setItem(key, v);
    } catch {
      /* ignore */
    }
  };
  return [value, update] as const;
}

export function Providers({ children, entries }: { children: ReactNode; entries: SearchEntry[] }) {
  const [theme, setTheme] = usePersisted("docs-theme", "default");
  const [density, setDensity] = usePersisted("docs-density", "comfortable");
  const [locale, setLocale] = usePersisted("docs-locale", "en");
  return (
    <UIProvider
      target="document"
      theme={theme}
      density={density as "compact" | "comfortable" | "spacious"}
      locale={locale}
      storageKey="ui-color-mode"
    >
      <TooltipProvider delayDuration={300}>
        <SiteHeader
          entries={entries}
          controls={{
            theme,
            density,
            locale,
            onThemeChange: setTheme,
            onDensityChange: setDensity,
            onLocaleChange: setLocale,
          }}
        />
        {children}
        <Toaster />
      </TooltipProvider>
    </UIProvider>
  );
}
