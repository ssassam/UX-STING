"use client";
import { palette } from "@ux-sting/tokens";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/**
 * Drivo brand: the "route note" identity — asphalt dark ground, bone text, one
 * signal red spent only on the action and the route line. Type comes from
 * next/font in app/layout.tsx and reaches the tokens as CSS variables.
 */
const drivoTheme = {
  name: "drivo",
  primary: "red",
  neutral: "gray",
  radius: "small",
  fontFamily: {
    sans: "var(--font-manrope), Manrope, 'Helvetica Neue', Helvetica, system-ui, sans-serif",
    mono: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
  },
  colors: {
    light: {
      background: "oklch(0.982 0.004 85)",
      foreground: "oklch(0.21 0.008 60)",
      card: "oklch(1 0 0)",
      muted: "oklch(0.945 0.005 85)",
      "muted-foreground": "oklch(0.46 0.01 60)",
      surface: "oklch(0.965 0.004 85)",
      border: "oklch(0.885 0.006 85)",
      "border-strong": "oklch(0.76 0.008 75)",
      primary: palette.red[700],
      "primary-hover": palette.red[800],
      "primary-subtle": palette.red[50],
      "primary-subtle-foreground": palette.red[900],
      ring: palette.red[600],
    },
    dark: {
      // Asphalt, warmed a hair so the black never reads as a plain #000 site.
      background: "oklch(0.17 0.008 40)",
      foreground: "oklch(0.965 0.006 85)",
      card: "oklch(0.215 0.009 40)",
      "card-foreground": "oklch(0.965 0.006 85)",
      popover: "oklch(0.215 0.009 40)",
      "popover-foreground": "oklch(0.965 0.006 85)",
      muted: "oklch(0.255 0.009 40)",
      "muted-foreground": "oklch(0.76 0.008 70)",
      surface: "oklch(0.19 0.008 40)",
      accent: "oklch(0.27 0.01 40)",
      border: "oklch(0.32 0.01 40)",
      "border-strong": "oklch(0.44 0.012 40)",
      input: "oklch(0.47 0.012 40)",
      // Deep racing red for buttons (white text 5.7:1). Red *text* on asphalt
      // uses a lighter step — see app/globals.css.
      primary: palette.red[600],
      "primary-hover": palette.red[700],
      "primary-foreground": "oklch(1 0 0)",
      "primary-subtle": "oklch(0.25 0.075 25)",
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
