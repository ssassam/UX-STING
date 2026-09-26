import { SkipLink } from "@ux-sting/react/skip-link";
import { ThemeScript } from "@ux-sting/react/provider";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { components, guides } from "../site/nav";
import { Providers } from "../site/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UX-STING — accessible React design system", template: "%s · UX-STING" },
  description:
    "Accessible, themeable, tree-shakeable React components with design tokens, RTL, dark mode and a copy-into-your-project CLI.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const entries = [
  ...guides.map((g) => ({ href: `/docs/${g.slug}`, title: g.title, group: "Guides" })),
  ...components.map((c) => ({
    href: `/components/${c.name}`,
    title: c.title,
    group: "Components",
    keywords: [c.name, c.category, c.description],
  })),
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-ui-theme="default"
      data-density="comfortable"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <SkipLink href="#main" />
        <Providers entries={entries}>{children}</Providers>
      </body>
    </html>
  );
}
