import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeScript, UIProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/components/toast";
import "./globals.css";

export const metadata: Metadata = { title: "UX-STING starter (copied source)" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <UIProvider target="document" storageKey="ui-color-mode">
          {children}
          <Toaster />
        </UIProvider>
      </body>
    </html>
  );
}
