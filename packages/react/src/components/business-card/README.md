# BusinessCard

> Patterns · `@unified-ui/react/business-card`

Generic listing card for businesses and places, with PlaceCard, RestaurantCard, HotelCard and ServiceCard presets.

## When to use

Use in directories, local discovery and search results.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { BusinessCard, PlaceCard, RestaurantCard } from "@unified-ui/react/business-card";
```

Or copy the source into your project and own it:

```bash
npx unified-ui add business-card
```

## Accessibility

- One stretched link per card; rating, price level and status are announced as text.

## API

### BusinessCard

Generic listing card for local businesses and places. The entire card is clickable through one stretched link; secondary actions stay independently focusable. Presets: PlaceCard, RestaurantCard, HotelCard, ServiceCard.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — |  |
| `actions` | `ReactNode` | — | Actions (save/favorite button). Rendered above the card link. |
| `address` | `ReactNode` | — |  |
| `badges` | `ReactNode` | — | Badges over the image (e.g. `<PremiumBadge />`). |
| `category` | `ReactNode` | — | Category label, e.g. "Italian restaurant". |
| `className` | `string` | — |  |
| `distance` | `ReactNode` | — |  |
| `headingLevel` | `2 \| 3 \| 4` | `3` |  |
| `href` | `string` | — |  |
| `image` | `{ src: string; alt: string }` | — |  |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` |  |
| `meta` | `ReactNode` | — | Extra details slot (price per night, cuisine, response time…). |
| `priceLevel` | `number` | — |  |
| `priceLevelLabel` | `string` | — |  |
| `rating` | `number` | — |  |
| `renderLink` | `(props: { href: string; children: ReactNode; className: string }) => ReactNode` | — | Render the title link via a router component. |
| `reviewCount` | `number` | — |  |
| `status` | `ReactNode` | — | Open status element, e.g. `<OpenStatus periods={…} />`. |
| `tags` | `ReactNode` | — | Short highlights (tags). |

### PlaceCard

Generic place (park, museum, venue).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — |  |
| `actions` | `ReactNode` | — | Actions (save/favorite button). Rendered above the card link. |
| `address` | `ReactNode` | — |  |
| `badges` | `ReactNode` | — | Badges over the image (e.g. `<PremiumBadge />`). |
| `category` | `ReactNode` | — | Category label, e.g. "Italian restaurant". |
| `className` | `string` | — |  |
| `distance` | `ReactNode` | — |  |
| `headingLevel` | `2 \| 3 \| 4` | — |  |
| `href` | `string` | — |  |
| `image` | `{ src: string; alt: string }` | — |  |
| `layout` | `"vertical" \| "horizontal"` | — |  |
| `meta` | `ReactNode` | — | Extra details slot (price per night, cuisine, response time…). |
| `priceLevel` | `number` | — |  |
| `priceLevelLabel` | `string` | — |  |
| `rating` | `number` | — |  |
| `renderLink` | `(props: { href: string; children: ReactNode; className: string }) => ReactNode` | — | Render the title link via a router component. |
| `reviewCount` | `number` | — |  |
| `status` | `ReactNode` | — | Open status element, e.g. `<OpenStatus periods={…} />`. |
| `tags` | `ReactNode` | — | Short highlights (tags). |

### RestaurantCard

Restaurant preset: cuisine as category, price level emphasised.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — |  |
| `actions` | `ReactNode` | — | Actions (save/favorite button). Rendered above the card link. |
| `address` | `ReactNode` | — |  |
| `badges` | `ReactNode` | — | Badges over the image (e.g. `<PremiumBadge />`). |
| `category` | `ReactNode` | — | Category label, e.g. "Italian restaurant". |
| `className` | `string` | — |  |
| `cuisine` | `ReactNode` | — |  |
| `distance` | `ReactNode` | — |  |
| `headingLevel` | `2 \| 3 \| 4` | — |  |
| `href` | `string` | — |  |
| `image` | `{ src: string; alt: string }` | — |  |
| `layout` | `"vertical" \| "horizontal"` | — |  |
| `meta` | `ReactNode` | — | Extra details slot (price per night, cuisine, response time…). |
| `priceLevel` | `number` | — |  |
| `priceLevelLabel` | `string` | — |  |
| `rating` | `number` | — |  |
| `renderLink` | `(props: { href: string; children: ReactNode; className: string }) => ReactNode` | — | Render the title link via a router component. |
| `reviewCount` | `number` | — |  |
| `status` | `ReactNode` | — | Open status element, e.g. `<OpenStatus periods={…} />`. |
| `tags` | `ReactNode` | — | Short highlights (tags). |

### HotelCard

Hotel preset: nightly price and hotel class.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — |  |
| `actions` | `ReactNode` | — | Actions (save/favorite button). Rendered above the card link. |
| `address` | `ReactNode` | — |  |
| `badges` | `ReactNode` | — | Badges over the image (e.g. `<PremiumBadge />`). |
| `category` | `ReactNode` | — | Category label, e.g. "Italian restaurant". |
| `className` | `string` | — |  |
| `distance` | `ReactNode` | — |  |
| `headingLevel` | `2 \| 3 \| 4` | — |  |
| `href` | `string` | — |  |
| `image` | `{ src: string; alt: string }` | — |  |
| `layout` | `"vertical" \| "horizontal"` | — |  |
| `meta` | `ReactNode` | — | Extra details slot (price per night, cuisine, response time…). |
| `nightlyPrice` | `ReactNode` | — | e.g. `<Price amount={120} currency="EUR" period="/ night" />`. |
| `priceLevel` | `number` | — |  |
| `priceLevelLabel` | `string` | — |  |
| `rating` | `number` | — |  |
| `renderLink` | `(props: { href: string; children: ReactNode; className: string }) => ReactNode` | — | Render the title link via a router component. |
| `reviewCount` | `number` | — |  |
| `stars` | `number` | — | Hotel class, 1–5. |
| `status` | `ReactNode` | — | Open status element, e.g. `<OpenStatus periods={…} />`. |
| `tags` | `ReactNode` | — | Short highlights (tags). |

### ServiceCard

Service provider preset (plumber, tutor, salon).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — |  |
| `actions` | `ReactNode` | — | Actions (save/favorite button). Rendered above the card link. |
| `address` | `ReactNode` | — |  |
| `badges` | `ReactNode` | — | Badges over the image (e.g. `<PremiumBadge />`). |
| `category` | `ReactNode` | — | Category label, e.g. "Italian restaurant". |
| `className` | `string` | — |  |
| `distance` | `ReactNode` | — |  |
| `headingLevel` | `2 \| 3 \| 4` | — |  |
| `href` | `string` | — |  |
| `image` | `{ src: string; alt: string }` | — |  |
| `layout` | `"vertical" \| "horizontal"` | — |  |
| `meta` | `ReactNode` | — | Extra details slot (price per night, cuisine, response time…). |
| `priceLevel` | `number` | — |  |
| `priceLevelLabel` | `string` | — |  |
| `rating` | `number` | — |  |
| `renderLink` | `(props: { href: string; children: ReactNode; className: string }) => ReactNode` | — | Render the title link via a router component. |
| `responseTime` | `ReactNode` | — | e.g. "Responds within 1 hour". |
| `reviewCount` | `number` | — |  |
| `startingPrice` | `ReactNode` | — | e.g. "From €40". |
| `status` | `ReactNode` | — | Open status element, e.g. `<OpenStatus periods={…} />`. |
| `tags` | `ReactNode` | — | Short highlights (tags). |

---

Full documentation with live examples: `apps/docs` → `/components/business-card`. This file is generated by `pnpm readmes`.
