import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: "UX-STING toolkit — measure before you draw",
  description:
    "Browser QA, design extraction, credited open images, an art-direction pipeline and a motion system for AI coding agents. Every result on this page is real tool output.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "./",
    title: "UX-STING toolkit — measure before you draw",
    description:
      "QA, extraction, images, taste and motion for AI coding agents, shown with real output.",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <ThemeScript theme="editorial" storageKey="toolkit-color-mode" />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
