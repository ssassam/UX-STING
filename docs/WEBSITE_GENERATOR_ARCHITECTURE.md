# Website generator architecture (Engine 4)

The generator turns a **project specification** — Design DNA + content model + page inventory + integration contracts — into an editable codebase. It composes pages from section compositions and UX-STING components; there is no catalogue of whole-page templates.

## Project specification (`ux-sting.project.json`, planned)

```jsonc
{
  "dna": "./design/dna.json",                 // Design DNA (DESIGN_DNA_SPEC.md)
  "locales": ["fr", "en", "ar"],              // first = default; ar renders dir="rtl"
  "framework": "nextjs-app",                  // adapter id
  "pages": [
    { "id": "home", "route": "/", "sections": ["hero", "services", "ritual", "reviews", "hours", "book"] },
    { "id": "service", "route": "/soins/[slug]", "collection": "services", "sections": ["hero", "details", "related", "book"] }
  ],
  "collections": {                             // content models, typed
    "services": { "fields": { "name": "string", "durationMin": "number", "priceMad": "number", "summary": "markdown" } }
  },
  "integrations": [                            // contracts, never fake implementations
    { "id": "booking", "kind": "form-endpoint", "status": "placeholder", "contract": "POST /api/bookings {service, slot, name, phone}" }
  ],
  "seo": { "siteUrl": "https://…", "indexing": { "service": "index", "search": "noindex" } }
}
```

## Pipeline

1. **Plan** — the UX Architect agent (or a person) writes the page inventory from the brief/requirements; each page lists sections by role and content.
2. **Compose** — for each section: role + composition + item count → a section component built from UX-STING primitives:
   | Composition | Built with |
   | --- | --- |
   | stack / centered | `Container`, `Stack`, `Heading`, `Text` |
   | split / asymmetric | `Grid columns={{ base: 1, md: "7fr 5fr" }}` |
   | grid | `Grid minChildWidth`, `Card` |
   | index | ordered `List` with rules and counters |
   | full-bleed | band with `Image`/`AspectRatio` and inverse surface |
   Interactive patterns map to components: forms → `Form`/`Field`, tabs → `Tabs`, FAQ → `Accordion`, hours → `OpeningHours`, maps → `MapPlaceholder`, galleries → `Carousel`/`ImageGallery`.
3. **Theme** — `dnaToUxStingTheme(dna)` → `createTheme()`; DNA variables become `--ui-*` tokens, so every component follows the DNA.
4. **Emit** — the framework adapter writes routes, layouts, components and content files.
5. **Verify** — Visual QA (`VISUAL_QA_SYSTEM.md`) on the built output, then the fix loop.

The prototype implements steps 2–5 for a single page as standalone HTML (`generatePage`), to validate DNA → layout without framework noise.

## Adapters

| Adapter | Output | Status |
| --- | --- | --- |
| `html` | One static HTML file with inline tokens | ✔ prototype |
| `nextjs-app` | App Router routes, server components by default, `generateMetadata`, `sitemap.ts`, `robots.ts`, JSON-LD via `@ux-sting/seo-schema`, UX-STING components | Phase 5 |
| `vite-react` | SPA routes with React Router; prerender for SEO | Phase 8 |
| `astro` | `.astro` pages using UX-STING React islands only where interactive | Phase 8 |

Adapter contract: `emit(spec, dna, content) → FileTree`; files are written through a path guard (no writes outside the project root, no overwrite of user-edited files — the CLI lockfile already tracks hashes).

## Rules
- **Never fabricate integrations.** A booking form without a backend renders with `status: "placeholder"`, a visible notice in development, and a typed contract. Working implementations only when the user provides the endpoint or service.
- **States are part of the page:** loading (`Skeleton`), empty (`EmptyState`), error (`ErrorState`), success; forms use `FormErrorSummary`.
- **Content is data.** Copy lives in typed content files per locale, never inline in components, so translation and editing do not touch code.
- **Server first.** Interactive islands only where behaviour requires it.
- **Editable output.** Generated code is ordinary UX-STING code: readable component names, no generated class soup, no runtime dependency on the generator.

## Multi-page and shared architecture
Page types share one DNA and one component set; per-type overrides live in DNA v2 `templates`. Navigation, footer and breadcrumbs come from the page inventory, so internal links are consistent and crawlable (`Pagination getHref`, `Breadcrumb`).
