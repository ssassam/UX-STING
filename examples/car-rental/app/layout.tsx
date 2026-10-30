import { ThemeScript } from "@ux-sting/react/provider";
import { ScrollProgress } from "@ux-sting/react/scroll-progress";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { Providers } from "./providers";
import "./globals.css";

/** Display (Archivo) / body (Manrope) / data (JetBrains Mono) — the Drivo trio. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  title: { default: "Drivo — pick up where you land", template: "%s · Drivo" },
  description:
    "Car rental at the arrival hall: six desks across France, two open around the clock, unlimited kilometres on every car and keys in the app.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#130e0d" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${manrope.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Every fleet photograph is served from this host; warming the
            connection before the CSS arrives is the difference between a
            cold and a warm LCP on the car pages. */}
        <link rel="preconnect" href="https://thumb.wikimedia.org" />
        <link rel="dns-prefetch" href="https://thumb.wikimedia.org" />
        <ThemeScript theme="drivo" storageKey="drivo-color-mode" defaultColorMode="dark" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Providers>
          <ScrollProgress />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
