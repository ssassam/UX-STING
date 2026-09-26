"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider target="document" theme="default" density="compact" storageKey="ui-color-mode">
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster position="bottom-end" />
      </TooltipProvider>
    </UIProvider>
  );
}
