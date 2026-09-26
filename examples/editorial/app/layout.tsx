import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Masthead } from "../components/masthead";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Medina Review — editorial example", template: "%s · The Medina Review" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <Providers>
          <Masthead />
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl px-4 py-8 outline-none sm:px-6"
          >
            {children}
          </main>
          <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
            Built with UX-STING
          </footer>
        </Providers>
      </body>
    </html>
  );
}
