"use client";
import { palette } from "@ux-sting/tokens";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Ember's brand theme: ember amber on near-black, large radius, dark-first. */
const emberTheme = {
  name: "ember",
  primary: "amber",
  neutral: "slate",
  radius: "large",
  colors: {
    dark: {
      // amber-500 is 4.2:1 as text on the slate cards; 400 clears AA there.
      primary: palette.amber[400],
      "primary-hover": palette.amber[300],
      ring: palette.amber[400],
    },
  },
} as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider
      target="document"
      theme={emberTheme}
      defaultColorMode="dark"
      storageKey="ember-color-mode"
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
