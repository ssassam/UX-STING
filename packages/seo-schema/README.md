# @ux-sting/seo-schema

Typed schema.org JSON-LD for any JavaScript framework: builders that never invent data, a serializer that is safe inside `<script>`, an HTML extractor, and a validator that keeps **schema.org validity** separate from **Google rich-result eligibility**.

- Zero dependencies, tree-shakeable, works on the server (React Server Components, Node, edge).
- Builders: `organization`, `webSite`, `breadcrumbList`, `article`, `blogPosting`, `product` (with `Offer`, `AggregateOffer`, `AggregateRating`, `Review`), `localBusiness` (any subtype), `restaurant`, `hotel`, `service`, `event`, `recipe`, `jobPosting`, plus `jsonLd()` to wrap nodes in one `@graph`.
- `validateJsonLd()` returns schema-layer issues (formats, enums, placeholders, impossible ratings) and Google-layer results per feature (`eligible`, `missing-required`, `policy-blocked`, `retired`), each citing the official Google page and the date the rule was last checked.

```tsx
import { jsonLd, jsonLdScriptProps, product, breadcrumbList } from "@ux-sting/seo-schema";

// `item` is your product record.
const schema = jsonLd([
  breadcrumbList([
    { name: "Home", url: "https://shop.example/" },
    { name: "Lamps", url: "https://shop.example/lamps/" },
    { name: item.name },
  ]),
  product({
    name: item.name,
    image: item.imageUrl,
    offers: { price: item.price, priceCurrency: "EUR", availability: item.inStock ? "InStock" : "OutOfStock" },
  }),
]);

<script {...jsonLdScriptProps(schema)} />;
```

```ts
import { extractJsonLd, validateJsonLd } from "@ux-sting/seo-schema";

const result = validateJsonLd(extractJsonLd(html).map((b) => b.data));
result.valid; // no schema.org errors
result.features; // [{ feature: "product-snippet", status: "eligible", source: "https://developers.google.com/…", checkedAt: "2026-10-14" }]
```

## Rules

- **Truthful data only.** Builders only emit what you pass. Pass ratings, reviews, prices, availability, authors and business details from your real data, and only when they are visible on the page.
- **No self-serving stars.** Ratings on your own `LocalBusiness` or `Organization` pages are reported as `policy-blocked`: Google does not show them.
- **Eligible is not guaranteed.** Meeting Google's documented requirements never guarantees a rich result, ranking or indexing (`ELIGIBILITY_DISCLAIMER`).
- **Rules age.** Google changes its requirements. Every rule in `GOOGLE_FEATURES` has a `source`, a `checkedAt` date and a `confidence` (`verified` or `review`). Re-check the source before relying on a `review` rule, and update `checkedAt` when you do.

See `docs/SEO_ENGINE_ARCHITECTURE.md` for how this package fits the wider SEO engine.
