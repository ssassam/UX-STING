import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BottomNav, SiteHeader } from "../components/site-chrome";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Citywise — local directory example", template: "%s · Citywise" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <Providers>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="pb-24 outline-none md:pb-0">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
