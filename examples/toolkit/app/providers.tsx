"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** The editorial preset: warm paper, ink text, one vermillion accent. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider target="document" theme="editorial" storageKey="toolkit-color-mode">
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
