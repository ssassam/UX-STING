"use client";
import { UIProvider } from "@unified-ui/react/provider";
import { Toaster } from "@unified-ui/react/toast";
import { TooltipProvider } from "@unified-ui/react/tooltip";
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
