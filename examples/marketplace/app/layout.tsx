import { ThemeScript } from "@unified-ui/react/provider";
import { SkipLink } from "@unified-ui/react/skip-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Souk & Co — marketplace example", template: "%s · Souk & Co" } };
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
          <Header />
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 py-6 outline-none sm:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
