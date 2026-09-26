"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Chainlens brand: indigo accents on slate, compact density for data, dark-first. */
const lensTheme = {
  name: "lens",
  primary: "indigo",
  neutral: "slate",
  radius: "medium",
  density: "compact",
} as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider
      target="document"
      theme={lensTheme}
      defaultColorMode="dark"
      storageKey="lens-color-mode"
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
