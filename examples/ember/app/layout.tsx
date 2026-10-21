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
  title: "Ember — a nine-course tasting menu in Ghent",
  description:
    "Ember is a sixteen-seat tasting-menu restaurant in Ghent. One seating a night, nine courses built around what arrives that morning. A UX-STING restaurant reservation template.",
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
        <ThemeScript storageKey="ember-color-mode" defaultColorMode="dark" />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
