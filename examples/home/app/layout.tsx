import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  title: "UX-STING — accessible React design system with AI agent skills",
  description:
    "115 accessible React components, 17 theme presets and agent skills for 24 AI coding hosts. Your agent builds art-directed UI and verifies every page in a browser.",
  authors: [{ name: "Veltein", url: "https://veltein.com" }],
  generator: "UX-STING by Veltein",
  keywords: [
    "React design system",
    "accessible React components",
    "AI agent skills",
    "Claude Code skills",
    "Cursor UI components",
    "Next.js component library",
    "WCAG 2.2 AA components",
    "design tokens",
  ],
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f11" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${grotesk.variable} ${mono.variable}`}>
      <head>
        <ThemeScript theme="sting" storageKey="sting-color-mode" defaultColorMode="dark" />
      </head>
      <body className="min-h-dvh font-sans">
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
