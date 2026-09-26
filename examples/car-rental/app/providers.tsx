"use client";
import { palette } from "@ux-sting/tokens";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Drivo brand: racing red on true black, crisp radius, dark-first. */
const drivoTheme = {
  name: "drivo",
  primary: "red",
  neutral: "gray",
  radius: "small",
  fontFamily: { sans: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif' },
  colors: {
    light: {
      primary: palette.red[700],
      "primary-hover": palette.red[800],
      "primary-subtle": palette.red[50],
      "primary-subtle-foreground": palette.red[900],
      ring: palette.red[600],
      foreground: "oklch(0.15 0 0)",
    },
    dark: {
      background: "oklch(0.12 0 0)",
      foreground: "oklch(0.97 0 0)",
      card: "oklch(0.17 0 0)",
      "card-foreground": "oklch(0.97 0 0)",
      popover: "oklch(0.17 0 0)",
      "popover-foreground": "oklch(0.97 0 0)",
      muted: "oklch(0.2 0 0)",
      "muted-foreground": "oklch(0.74 0 0)",
      surface: "oklch(0.15 0 0)",
      accent: "oklch(0.23 0 0)",
      border: "oklch(0.28 0 0)",
      "border-strong": "oklch(0.4 0 0)",
      input: "oklch(0.45 0 0)",
      // Deep racing red for buttons (white text 5.7:1). Red text on black uses
      // a lighter step, see app/globals.css.
      primary: palette.red[600],
      "primary-hover": palette.red[700],
      "primary-foreground": "oklch(1 0 0)",
      "primary-subtle": "oklch(0.24 0.08 25)",
      "primary-subtle-foreground": palette.red[100],
      ring: palette.red[500],
    },
  },
} as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider
      target="document"
      theme={drivoTheme}
      defaultColorMode="dark"
      storageKey="drivo-color-mode"
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
