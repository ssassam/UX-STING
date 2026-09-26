import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  title: "Pulse One — the smartwatch that lasts two weeks",
  description:
    "Meet Pulse One: 14-day battery, dual-band GPS and all-day health tracking. A UX-STING product landing page template.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript storageKey="pulse-color-mode" defaultColorMode="dark" />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
