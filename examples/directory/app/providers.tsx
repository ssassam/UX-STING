"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
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
