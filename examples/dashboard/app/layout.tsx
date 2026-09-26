import { ThemeScript } from "@ux-sting/react/provider";
import { SkipLink } from "@ux-sting/react/skip-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Shell } from "./shell";
import "./globals.css";

export const metadata: Metadata = { title: "Atlas Admin — UX-STING dashboard example" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SkipLink />
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
