# UX-STING

An accessible, themeable, tree-shakeable design system and React component library for Next.js and any React app.

- **~100 component families** — layout, typography, buttons, a complete form system, date/time, navigation, overlays, feedback, data table/grid, media, command palette, commerce / local-discovery / editorial patterns, and zero-dependency motion & effects (text effects, scroll reveal, counters, marquee, backgrounds); `@ux-sting/motion` adds a CSS transition catalog (resize, reorder, tabs, toast, skeleton…) and an optional GSAP adapter
- **Accessible by default** — WCAG 2.2 AA, keyboard support, focus management, axe-tested, contrast-tested tokens
- **Design tokens & themes** — OKLCH semantic tokens as CSS variables, 17 presets (Material, Fluent, Carbon, Polaris, Apple, Base Web and Stripe styles plus editorial, luxury, brutalist and terminal design directions), custom themes, light/dark/high-contrast, 3 densities
- **Global** — RTL via logical properties, localized labels (en/fr/ar), `Intl` formatting everywhere
- **Next.js-first** — App Router, RSC-friendly (server components by default), per-component entry points
- **Own your code** — `npx ux-sting add dialog` copies source into your project, with a lockfile that protects your edits
- **Agent skills** — `.claude/skills/` teaches coding agents to build with UX-STING (`ux-sting`), art-direct pages from the client's specifics with real, credited images and browser self-critique — or take the quiet route for dashboards (`ux-sting-taste`), review with evidence (`ux-sting-review`), run browser QA and fix the top 3 findings in up to three rounds (`ux-sting-qa`), explore several directions side by side (`ux-sting-explore`) run the reference → Design DNA → page → browser QA pipeline (`ux-sting-universal`), add accessible three.js 3D and shader scenes (`ux-sting-3d`) and draw on-theme diagrams with [diagram-design](https://github.com/cathrynlavery/diagram-design) (`ux-sting-diagrams`; Claude Code offers to install the plugin when you trust the repo, other agents use `npx skills add cathrynlavery/diagram-design`)
- **Tailwind v4 native, Tailwind optional** — use `tailwind.css` or the precompiled `styles.css`

## Quick start

> **Status:** the `@ux-sting/*` packages are not published to npm yet, so `pnpm add` and `npx ux-sting` won't work until the first release. Today you can browse the [live demos](#showcase) or run everything from source.

Run it locally (Node 20.9+ — `.nvmrc` pins 22 — and pnpm 10):

```bash
git clone https://github.com/ssassam/UX-STING.git
cd UX-STING
corepack enable            # provides the pinned pnpm version
pnpm install
pnpm build                 # builds the packages
pnpm --filter @ux-sting/example-travel dev   # or example-car-rental, -shop, -watch, -crypto
```

Other useful commands: `pnpm --filter @ux-sting/docs dev` (documentation site), `pnpm test`, `pnpm check` (build + typecheck + lint + test).

### Using the packages (after the first npm release)

```bash
pnpm add @ux-sting/react
```

```css
@import "tailwindcss";
@import "@ux-sting/react/tailwind.css";
```

```tsx
import { UIProvider } from "@ux-sting/react/provider";
import { Button } from "@ux-sting/react/button";

<UIProvider theme="default">
  <Button loading>Save</Button>
</UIProvider>
```

Until then, copy components from `packages/react/src/components/<name>` or add the repo as a Git dependency in a pnpm workspace.

## Repository

| Path | Description |
| --- | --- |
| `packages/react` | `@ux-sting/react` — components, provider, styles |
| `packages/tokens` | `@ux-sting/tokens` — design tokens |
| `packages/themes` | `@ux-sting/themes` — theme engine + presets |
| `packages/primitives` | `@ux-sting/primitives` — headless building blocks |
| `packages/hooks` | `@ux-sting/hooks` |
| `packages/utils` | `@ux-sting/utils` |
| `packages/icons` | `@ux-sting/icons` |
| `packages/core` | `@ux-sting/core` — framework-agnostic entry |
| `packages/cli` | `ux-sting` CLI |
| `packages/design-dna` | `@ux-sting/design-dna` — prototype: Design DNA analysis, planning, generation and visual QA (see `docs/UNIVERSAL_VISION.md`) |
| `packages/qa` | `@ux-sting/qa` — browser QA for agents (`ux-sting qa <url\|path>`): axe, contrast, layout checks, console, LCP/CLS, ranked top-3 fixes |
| `packages/extract` | `@ux-sting/extract` — `ux-sting extract <url>` → W3C DTCG tokens, `ux-sting theme import` → OKLCH theme, `ux-sting dna` → nearest preset |
| `packages/images` | `@ux-sting/images` — `ux-sting images <query>`: openly licensed images (Commons, Met, Openverse) with automatic credits |
| `packages/motion` | `@ux-sting/motion` — CSS transition catalog (resize, number pop, stack, reorder, accordion, tabs, toast, skeleton) + helpers, optional GSAP adapter (`/gsap`) |
| `packages/seo-schema` | `@ux-sting/seo-schema` — typed JSON-LD builders and validation (schema.org vs Google eligibility) |
| `apps/docs` | Documentation site (Next.js) with live, themeable examples |
| `apps/playground` | Component laboratory (Vite) |
| `apps/storybook` | Storybook + visual regression |
| `examples/*` | Travel booking site, SaaS dashboard, marketplace, local directory, editorial site, restaurant reservations, CLI starter |
| `docs/` | Guides (also rendered by the docs site) |
| `registry/` | Component metadata and extracted API |

## Showcase

Six complete demo sites, built only with UX-STING and deployed to GitHub Pages:

| Demo | What it shows | Live |
| --- | --- | --- |
| [**Wayfare**](examples/travel) — travel booking | Hero search, destinations, stay search with filters and map, booking, checkout | [open](https://ssassam.github.io/UX-STING/) |
| [**Drivo**](examples/car-rental) — car rental | Pick-up search, fleet filters, car details, protection and extras, checkout | [open](https://ssassam.github.io/UX-STING/cars/) |
| [**Maison Nord**](examples/shop) — e-commerce | Catalogue with filters and pagination, product variants, cart drawer, checkout | [open](https://ssassam.github.io/UX-STING/shop/) |
| [**Pulse One**](examples/watch) — product launch | Landing page with a recolourable product illustration, specs comparison, pre-order | [open](https://ssassam.github.io/UX-STING/watch/) |
| [**Chainlens**](examples/crypto) — crypto analytics | Market stats, interactive price charts, sortable asset table, news feed (sample data) | [open](https://ssassam.github.io/UX-STING/crypto/) |
| [**Ember**](examples/ember) — restaurant reservations | Tasting menu with dietary tags, dining-experience tabs, full reservation form, opening hours with live status, map, reviews | [open](https://ssassam.github.io/UX-STING/ember/) |

### Screenshots

#### Wayfare — travel booking · [live demo](https://ssassam.github.io/UX-STING/)

<table>
<tr><td width="50%" align="center"><a href="examples/travel/screenshots/1-home.webp"><img src="examples/travel/screenshots/1-home.webp" alt="Home" width="100%"></a><br><sub>Home</sub></td><td width="50%" align="center"><a href="examples/travel/screenshots/2-destinations.webp"><img src="examples/travel/screenshots/2-destinations.webp" alt="Popular destinations" width="100%"></a><br><sub>Popular destinations</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/travel/screenshots/3-search.webp"><img src="examples/travel/screenshots/3-search.webp" alt="Stay search with filters" width="100%"></a><br><sub>Stay search with filters</sub></td><td width="50%" align="center"><a href="examples/travel/screenshots/4-destination.webp"><img src="examples/travel/screenshots/4-destination.webp" alt="Destination guide" width="100%"></a><br><sub>Destination guide</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/travel/screenshots/5-stay.webp"><img src="examples/travel/screenshots/5-stay.webp" alt="Stay details and booking" width="100%"></a><br><sub>Stay details and booking</sub></td><td width="50%" align="center"><a href="examples/travel/screenshots/6-checkout.webp"><img src="examples/travel/screenshots/6-checkout.webp" alt="Checkout" width="100%"></a><br><sub>Checkout</sub></td></tr>
</table>

#### Drivo — car rental · [live demo](https://ssassam.github.io/UX-STING/cars/)

<table>
<tr><td width="50%" align="center"><a href="examples/car-rental/screenshots/1-home.webp"><img src="examples/car-rental/screenshots/1-home.webp" alt="Home" width="100%"></a><br><sub>Home</sub></td><td width="50%" align="center"><a href="examples/car-rental/screenshots/2-popular.webp"><img src="examples/car-rental/screenshots/2-popular.webp" alt="Most booked cars" width="100%"></a><br><sub>Most booked cars</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/car-rental/screenshots/3-fleet.webp"><img src="examples/car-rental/screenshots/3-fleet.webp" alt="Fleet with filters" width="100%"></a><br><sub>Fleet with filters</sub></td><td width="50%" align="center"><a href="examples/car-rental/screenshots/4-car.webp"><img src="examples/car-rental/screenshots/4-car.webp" alt="Car details" width="100%"></a><br><sub>Car details</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/car-rental/screenshots/5-booking.webp"><img src="examples/car-rental/screenshots/5-booking.webp" alt="Specs, protection and extras" width="100%"></a><br><sub>Specs, protection and extras</sub></td><td width="50%" align="center"><a href="examples/car-rental/screenshots/6-checkout.webp"><img src="examples/car-rental/screenshots/6-checkout.webp" alt="Checkout" width="100%"></a><br><sub>Checkout</sub></td></tr>
</table>

#### Maison Nord — e-commerce · [live demo](https://ssassam.github.io/UX-STING/shop/)

<table>
<tr><td width="50%" align="center"><a href="examples/shop/screenshots/1-home.webp"><img src="examples/shop/screenshots/1-home.webp" alt="Home" width="100%"></a><br><sub>Home</sub></td><td width="50%" align="center"><a href="examples/shop/screenshots/2-bestsellers.webp"><img src="examples/shop/screenshots/2-bestsellers.webp" alt="Bestsellers" width="100%"></a><br><sub>Bestsellers</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/shop/screenshots/3-catalogue.webp"><img src="examples/shop/screenshots/3-catalogue.webp" alt="Catalogue with filters" width="100%"></a><br><sub>Catalogue with filters</sub></td><td width="50%" align="center"><a href="examples/shop/screenshots/4-product.webp"><img src="examples/shop/screenshots/4-product.webp" alt="Product page" width="100%"></a><br><sub>Product page</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/shop/screenshots/5-cart.webp"><img src="examples/shop/screenshots/5-cart.webp" alt="Cart drawer" width="100%"></a><br><sub>Cart drawer</sub></td><td width="50%" align="center"><a href="examples/shop/screenshots/6-checkout.webp"><img src="examples/shop/screenshots/6-checkout.webp" alt="Checkout" width="100%"></a><br><sub>Checkout</sub></td></tr>
</table>

#### Pulse One — product launch · [live demo](https://ssassam.github.io/UX-STING/watch/)

<table>
<tr><td width="50%" align="center"><a href="examples/watch/screenshots/1-hero.webp"><img src="examples/watch/screenshots/1-hero.webp" alt="Hero with finish picker" width="100%"></a><br><sub>Hero with finish picker</sub></td><td width="50%" align="center"><a href="examples/watch/screenshots/2-features.webp"><img src="examples/watch/screenshots/2-features.webp" alt="Features" width="100%"></a><br><sub>Features</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/watch/screenshots/3-showcase.webp"><img src="examples/watch/screenshots/3-showcase.webp" alt="Feature showcase" width="100%"></a><br><sub>Feature showcase</sub></td><td width="50%" align="center"><a href="examples/watch/screenshots/4-specs.webp"><img src="examples/watch/screenshots/4-specs.webp" alt="Specs comparison" width="100%"></a><br><sub>Specs comparison</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/watch/screenshots/5-preorder.webp"><img src="examples/watch/screenshots/5-preorder.webp" alt="Pre-order configurator" width="100%"></a><br><sub>Pre-order configurator</sub></td><td width="50%" align="center"><a href="examples/watch/screenshots/6-reviews.webp"><img src="examples/watch/screenshots/6-reviews.webp" alt="Reviews and FAQ" width="100%"></a><br><sub>Reviews and FAQ</sub></td></tr>
</table>

#### Chainlens — crypto analytics & news · [live demo](https://ssassam.github.io/UX-STING/crypto/)

<table>
<tr><td width="50%" align="center"><a href="examples/crypto/screenshots/1-markets.webp"><img src="examples/crypto/screenshots/1-markets.webp" alt="Market overview" width="100%"></a><br><sub>Market overview</sub></td><td width="50%" align="center"><a href="examples/crypto/screenshots/2-chart.webp"><img src="examples/crypto/screenshots/2-chart.webp" alt="Interactive price chart" width="100%"></a><br><sub>Interactive price chart</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/crypto/screenshots/3-assets.webp"><img src="examples/crypto/screenshots/3-assets.webp" alt="Sortable asset table" width="100%"></a><br><sub>Sortable asset table</sub></td><td width="50%" align="center"><a href="examples/crypto/screenshots/4-coin.webp"><img src="examples/crypto/screenshots/4-coin.webp" alt="Coin page" width="100%"></a><br><sub>Coin page</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/crypto/screenshots/5-news.webp"><img src="examples/crypto/screenshots/5-news.webp" alt="News with images" width="100%"></a><br><sub>News with images</sub></td><td width="50%" align="center"><a href="examples/crypto/screenshots/6-light-mode.webp"><img src="examples/crypto/screenshots/6-light-mode.webp" alt="Light mode" width="100%"></a><br><sub>Light mode</sub></td></tr>
</table>

#### Ember — restaurant reservations · [live demo](https://ssassam.github.io/UX-STING/ember/)

<table>
<tr><td width="50%" align="center"><a href="examples/ember/screenshots/1-hero.webp"><img src="examples/ember/screenshots/1-hero.webp" alt="Hero with tonight's menu preview" width="100%"></a><br><sub>Hero with tonight's menu preview</sub></td><td width="50%" align="center"><a href="examples/ember/screenshots/2-menu.webp"><img src="examples/ember/screenshots/2-menu.webp" alt="Tasting menu with dietary tags" width="100%"></a><br><sub>Tasting menu with dietary tags</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/ember/screenshots/3-experience.webp"><img src="examples/ember/screenshots/3-experience.webp" alt="Dining-experience tabs" width="100%"></a><br><sub>Dining-experience tabs</sub></td><td width="50%" align="center"><a href="examples/ember/screenshots/4-reserve.webp"><img src="examples/ember/screenshots/4-reserve.webp" alt="Reservation form" width="100%"></a><br><sub>Reservation form</sub></td></tr>
<tr><td width="50%" align="center"><a href="examples/ember/screenshots/5-hours.webp"><img src="examples/ember/screenshots/5-hours.webp" alt="Opening hours and map" width="100%"></a><br><sub>Opening hours and map</sub></td><td width="50%" align="center"><a href="examples/ember/screenshots/6-reviews.webp"><img src="examples/ember/screenshots/6-reviews.webp" alt="Reviews and FAQ" width="100%"></a><br><sub>Reviews and FAQ</sub></td></tr>
</table>

Build all of them as one static site with `scripts/build-pages.sh` (output in `pages-dist/`).

### SEO

Every demo page ships a unique title and description, a canonical URL, Open Graph and Twitter preview images, and schema.org structured data (`WebSite`, `TravelAgency`, `AutoRental`, `OnlineStore`, `Hotel`, `Product` + `Offer`, `Restaurant`). Checkout and account pages are `noindex`. Each demo has a `sitemap.xml`, and one index covers all six:

**https://ssassam.github.io/UX-STING/sitemap-index.xml**

To speed up indexing, add `https://ssassam.github.io/UX-STING/` as a URL-prefix property in [Google Search Console](https://search.google.com/search-console) (and [Bing Webmaster Tools](https://www.bing.com/webmasters)), then submit the sitemap index above.

## Documentation

Guides live in [`docs/`](docs/introduction.md) and in the docs app (`pnpm --filter @ux-sting/docs dev`):
[Installation](docs/installation.md) · [Next.js](docs/nextjs.md) · [Theming](docs/theming.md) · [Tokens](docs/tokens.md) · [Accessibility](docs/accessibility.md) · [UX quality rules](docs/ux-quality.md) · [RTL & i18n](docs/internationalization.md) · [CLI](docs/cli.md) · [API conventions](docs/api-consistency.md) · [Patterns](docs/patterns.md) · [Migration](docs/migration.md)

Each component folder also has a generated `README.md` (when to use, accessibility, keyboard, API).

**UX-STING Universal (prototype)** — turning UX-STING into a system that analyzes references, plans original designs, generates pages and verifies them in a browser: [Vision](docs/UNIVERSAL_VISION.md) · [Reference audit](docs/REFERENCE_REPOSITORY_AUDIT.md) · [Capability matrix](docs/COMPETITIVE_CAPABILITY_MATRIX.md) · [Design DNA](docs/DESIGN_DNA_SPEC.md) · [Analyzer](docs/REFERENCE_ANALYZER_SPEC.md) · [Generator](docs/WEBSITE_GENERATOR_ARCHITECTURE.md) · [Agents](docs/MULTI_AGENT_ORCHESTRATION.md) · [Visual QA](docs/VISUAL_QA_SYSTEM.md) · [SEO engine](docs/SEO_ENGINE_ARCHITECTURE.md) · [Security & licensing](docs/SECURITY_AND_LICENSING.md) · [Benchmark](docs/BENCHMARK_PLAN.md) · [Roadmap](docs/IMPLEMENTATION_ROADMAP.md) · [Prototype evidence](docs/universal/prototype/)

## Development

```bash
pnpm install
pnpm check        # build + typecheck + lint + test
pnpm ux-audit
```

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. Third-party licenses and attributions: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
