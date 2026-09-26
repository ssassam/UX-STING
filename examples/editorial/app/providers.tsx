"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider target="document" theme="neutral" density="spacious" storageKey="ui-color-mode">
      {children}
      <Toaster />
    </UIProvider>
  );
}
