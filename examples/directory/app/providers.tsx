"use client";
import { UIProvider } from "@unified-ui/react/provider";
import { Toaster } from "@unified-ui/react/toast";
import { TooltipProvider } from "@unified-ui/react/tooltip";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider target="document" theme="default" storageKey="ui-color-mode">
      <TooltipProvider>
        {children}
        <Toaster position="top-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
