"use client";
import { palette } from "@ux-sting/tokens";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Drivo brand: energetic orange on slate, crisp medium radius. */
const drivoTheme = {
  name: "drivo",
  primary: "orange",
  neutral: "slate",
  radius: "medium",
  colors: {
    light: {
      primary: palette.orange[700],
      "primary-hover": palette.orange[800],
      ring: palette.orange[600],
    },
  },
} as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider target="document" theme={drivoTheme} storageKey="drivo-color-mode">
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
