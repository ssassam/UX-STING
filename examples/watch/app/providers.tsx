"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Pulse brand: electric violet on deep slate, generous radius, dark-first. */
const pulseTheme = { name: "pulse", primary: "violet", neutral: "slate", radius: "large" } as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider
      target="document"
      theme={pulseTheme}
      defaultColorMode="dark"
      storageKey="pulse-color-mode"
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
