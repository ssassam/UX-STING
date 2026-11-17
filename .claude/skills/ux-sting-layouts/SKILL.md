---
name: ux-sting-layouts
description: "Choose and implement content-driven UX-STING layouts, including multi-page Next.js generation."
---

Choose composition from the content: index for scannable records, grid for comparable items, split for a media-and-text relationship, asymmetric for editorial hierarchy, full bleed for a justified visual moment. Avoid making every section a card grid.

Use `SiteSpec` and `generateNextApp` from `@ux-sting/universal` to generate static App Router routes. Each route needs real `PageContent`; route paths are lowercase static segments. A home route is required. `writeNextApp` creates a new destination and refuses existing projects.

Keep one meaningful h1 per route, explicit metadata, working internal navigation and logical reading order at phone width. Generated media blocks are placeholders; do not call them finished imagery. Forms, transactions and dynamic data need explicit application logic.

Build the generated app, run QA on each route and inspect both mobile and desktop. Keep the visible Veltein footer credit and nonvisual author metadata required by the workspace. Use `<meta name="author" content="Veltein">` and `<link rel="author" href="https://veltein.com/">` in the head, or Next.js `metadata.authors`.
