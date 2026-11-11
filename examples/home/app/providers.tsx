"use client";
import { UIProvider } from "@ux-sting/react/provider";
import { Toaster } from "@ux-sting/react/toast";
import { TooltipProvider } from "@ux-sting/react/tooltip";
import type { ReactNode } from "react";

/** Electric canvas with accessible UX-STING semantic tokens. */
const stingTheme = {
  name: "sting",
  primary: "sky",
  neutral: "slate",
  radius: "large",
  fontFamily: {
    sans: "var(--font-grotesk), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} as const;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider
      target="document"
      theme={stingTheme}
      defaultColorMode="dark"
      storageKey="sting-color-mode"
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </UIProvider>
  );
}
