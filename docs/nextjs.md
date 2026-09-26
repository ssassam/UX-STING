# Next.js & React Server Components

UX-STING is designed for the App Router.

## Server vs client components

Files that need state, effects or browser APIs start with `"use client"`. Everything else is a server component and ships no JavaScript:

| Server-safe | Client |
| --- | --- |
| Box, Stack, Grid, Container, Separator, AspectRatio, Typography, Card, Badge, Alert, Progress, Skeleton, Spinner, States, Stat, List, Timeline, Table, Breadcrumb, Stepper, Button, SkipLink, NavigationRail, MobileNavigation, BusinessCard/ProductCard/ArticleCard/ProfileCard/CategoryCard, Location, SearchResult, Highlight, Icons | Provider, overlays, menus, forms, Tabs, Accordion, Toast, DataTable, Calendar/pickers, Carousel, Command, Sidebar, Navbar, Rating, Price (locale), OpeningHours, MapPlaceholder |

Server components can render client components freely, so a server `page.tsx` can compose `<Card>` (server) around `<Dialog>` (client).

## Root layout

```tsx
// app/layout.tsx
import { ThemeScript, UIProvider } from "@ux-sting/react/provider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <UIProvider target="document" storageKey="ui-color-mode">
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
```

`ThemeScript` applies the persisted color mode before paint (no flash). `target="document"` puts `data-theme`, `data-density`, `dir` and `lang` on `<html>`.

## Streaming and static generation

Components do not read browser APIs during render; values that depend on the client (media queries, current time in `OpenStatus`) render a stable server fallback and update after hydration. All example apps are statically generated.

## Links

Components that render links accept `asChild` (or `renderLink`) so you can pass `next/link`:

```tsx
import NextLink from "next/link";

<Button asChild>
  <NextLink href="/pricing">Pricing</NextLink>
</Button>
```
