import { describe, expect, it } from "vitest";
import {
  article,
  breadcrumbList,
  compact,
  event,
  extractJsonLd,
  GOOGLE_FEATURES,
  hotel,
  jobPosting,
  jsonLd,
  jsonLdScriptProps,
  jsonLdScriptTag,
  localBusiness,
  organization,
  product,
  recipe,
  restaurant,
  serializeJsonLd,
  service,
  validateJsonLd,
  webSite,
  type ValidationResult,
} from "./index.js";

const feature = (r: ValidationResult, id: string) => r.features.find((f) => f.feature === id);
const codes = (r: ValidationResult, layer?: "schema" | "google") =>
  r.issues.filter((i) => !layer || i.layer === layer).map((i) => i.code);

describe("builders", () => {
  it("never emit empty or invented values", () => {
    const node = product({ name: "Linen throw", description: "", image: [], offers: undefined });
    expect(node).toEqual({ "@type": "Product", name: "Linen throw" });
    expect(node).not.toHaveProperty("aggregateRating");
    expect(compact({ a: { b: null, c: [] }, d: 0, e: false })).toEqual({ d: 0, e: false });
  });

  it("build a breadcrumb trail with positions from 1", () => {
    const node = breadcrumbList([
      { name: "Home", url: "https://shop.example.ma/" },
      { name: "Lamps", url: "https://shop.example.ma/lamps/" },
      { name: "Atlas lamp" },
    ]);
    expect(node.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://shop.example.ma/" },
      { "@type": "ListItem", position: 2, name: "Lamps", item: "https://shop.example.ma/lamps/" },
      { "@type": "ListItem", position: 3, name: "Atlas lamp" },
    ]);
  });

  it("expand enumerations to schema.org URLs and tag agents", () => {
    const node = product({
      name: "Atlas lamp",
      brand: "Maison Nord",
      offers: { price: 89, priceCurrency: "EUR", availability: "InStock" },
    });
    expect(node.brand).toEqual({ "@type": "Brand", name: "Maison Nord" });
    expect(node.offers).toMatchObject({
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    });

    const post = article({
      type: "BlogPosting",
      headline: "Best riads in Fes",
      author: [{ type: "Person", name: "Salma Idrissi" }],
    });
    expect(post["@type"]).toBe("BlogPosting");
    expect(post.author).toEqual({ "@type": "Person", name: "Salma Idrissi" });
  });

  it("wrap several nodes in one @graph with a single @context", () => {
    const doc = jsonLd([
      organization({
        "@id": "https://ember.example.be/#org",
        name: "Ember",
        url: "https://ember.example.be/",
      }),
      webSite({ name: "Ember", url: "https://ember.example.be/" }),
    ]);
    expect(doc["@context"]).toBe("https://schema.org");
    expect(doc["@graph"]).toHaveLength(2);
    expect(
      jsonLd([webSite({ name: "A", url: "https://a.example.ma/" })])["@graph"],
    ).toBeUndefined();
  });

  it("build hotels, services, recipes and remote jobs", () => {
    expect(hotel({ name: "Riad Zitoun", starRating: 4, amenities: ["Pool"] })).toMatchObject({
      starRating: { "@type": "Rating", ratingValue: 4 },
      amenityFeature: [{ "@type": "LocationFeatureSpecification", name: "Pool", value: true }],
    });
    expect(
      service({ name: "Airport transfer", provider: { type: "Organization", name: "Drivo" } })
        .provider,
    ).toEqual({
      "@type": "Organization",
      name: "Drivo",
    });
    expect(
      recipe({
        name: "Harira",
        image: "https://food.example.ma/harira.jpg",
        recipeInstructions: ["Soak", "Simmer"],
      }).recipeInstructions,
    ).toEqual([
      { "@type": "HowToStep", text: "Soak" },
      { "@type": "HowToStep", text: "Simmer" },
    ]);
    const job = jobPosting({
      title: "Frontend engineer",
      description: "<p>Build accessible interfaces.</p>",
      datePosted: "2026-10-01",
      hiringOrganization: { name: "UX-STING" },
      remote: true,
      applicantLocationRequirements: ["Morocco", "France"],
    });
    expect(job.jobLocationType).toBe("TELECOMMUTE");
    expect(job.hiringOrganization).toEqual({ "@type": "Organization", name: "UX-STING" });
  });
});

describe("serialization", () => {
  it("cannot be broken out of a script element", () => {
    const html = serializeJsonLd(
      product({ name: "</script><script>alert(1)</script> & co\u2028" }),
    );
    expect(html).not.toMatch(/<|>|&|\u2028/);
    expect(JSON.parse(html).name).toBe("</script><script>alert(1)</script> & co\u2028");
  });

  it("adds @context to bare nodes and keeps documents as they are", () => {
    const node = webSite({ name: "Wayfare", url: "https://wayfare.example.ma/" });
    expect(JSON.parse(serializeJsonLd(node))["@context"]).toBe("https://schema.org");
    expect(jsonLdScriptProps(node).type).toBe("application/ld+json");
    expect(jsonLdScriptTag(jsonLd(node))).toMatch(/^<script type="application\/ld\+json">\{/);
  });
});

describe("extraction", () => {
  it("finds JSON-LD blocks and reports invalid JSON", () => {
    const html = `<html><head>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"A","url":"https://a.example.ma/"}</script>
      <script type='application/ld+json'>{ broken </script>
      <script>var x = 1</script>
      <script type="application/json">{"a":1}</script>
    </head></html>`;
    const blocks = extractJsonLd(html);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]!.data).toMatchObject({ "@type": "WebSite" });
    expect(blocks[1]!.error).toBeTruthy();
  });

  it("stays bounded on huge or hostile input", () => {
    const hostile = "<script type=application/ld+json>".repeat(20_000);
    const start = performance.now();
    expect(extractJsonLd(hostile)).toEqual([]);
    expect(performance.now() - start).toBeLessThan(1000);
    const turkish = `<p>İİİ</p><SCRIPT TYPE="application/ld+json">{"@type":"Thing"}</SCRIPT>`;
    expect(extractJsonLd(turkish)[0]?.data).toEqual({ "@type": "Thing" });
    expect(
      extractJsonLd(`${"x".repeat(50)}<script type="application/ld+json">{}</script>`, {
        maxBytes: 10,
      }),
    ).toEqual([]);
  });
});

describe("schema.org layer", () => {
  it("passes well-formed markup", () => {
    const r = validateJsonLd(
      jsonLd(
        restaurant({
          name: "Ember",
          url: "https://ember.example.be/",
          telephone: "+32 9 123 45 67",
          address: {
            streetAddress: "Jan Breydelstraat 4",
            addressLocality: "Ghent",
            addressCountry: "BE",
          },
          openingHours: [{ dayOfWeek: "Friday", opens: "18:30", closes: "23:00" }],
          servesCuisine: "Tasting menu",
        }),
      ),
    );
    expect(r.valid).toBe(true);
    expect(codes(r, "schema")).toEqual([]);
  });

  it("flags missing context and type", () => {
    expect(codes(validateJsonLd({ "@type": "Product", name: "A" }))).toContain("missing-context");
    expect(codes(validateJsonLd({ "@context": "https://schema.org", name: "A" }))).toContain(
      "missing-type",
    );
    expect(codes(validateJsonLd({ "@context": "http://schema.org", "@type": "Thing" }))).toContain(
      "insecure-context",
    );
    expect(codes(validateJsonLd("nope"))).toContain("not-an-object");
  });

  it("flags wrong formats", () => {
    const r = validateJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Lamp",
      url: "/lamp",
      offers: {
        "@type": "Offer",
        price: "€89,00",
        priceCurrency: "euro",
        availability: "Available",
        priceValidUntil: "2026-13-01",
      },
    });
    expect(r.valid).toBe(false);
    expect(codes(r, "schema")).toEqual(
      expect.arrayContaining([
        "relative-url",
        "invalid-price",
        "invalid-currency",
        "invalid-enum",
        "invalid-date",
      ]),
    );
  });

  it("refuses placeholders and impossible ratings", () => {
    const r = validateJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "[Product Name]",
      aggregateRating: { "@type": "AggregateRating", ratingValue: 6, reviewCount: 0 },
    });
    expect(codes(r, "schema")).toEqual(
      expect.arrayContaining(["placeholder", "rating-out-of-range", "invalid-count"]),
    );
  });

  it("checks durations, times, coordinates, countries and languages", () => {
    const r = validateJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Recipe",
          name: "Tagine",
          image: "https://f.example.ma/t.jpg",
          totalTime: "45 minutes",
        },
        {
          "@type": "LocalBusiness",
          name: "Café",
          geo: { "@type": "GeoCoordinates", latitude: 120, longitude: 7 },
          address: { "@type": "PostalAddress", addressCountry: "Morocco" },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            opens: "9am",
            closes: "18:00",
          },
        },
        {
          "@type": "Article",
          headline: "Hi",
          inLanguage: "english",
          datePublished: "2026-10-14T10:00",
        },
      ],
    });
    expect(codes(r, "schema")).toEqual(
      expect.arrayContaining([
        "invalid-duration",
        "invalid-latitude",
        "country-code",
        "invalid-time",
        "language-tag",
        "date-without-timezone",
      ]),
    );
  });
});

describe("Google layer", () => {
  it("keeps rich-result eligibility separate from validity", () => {
    const r = validateJsonLd(jsonLd(product({ name: "Lamp" })));
    expect(r.valid).toBe(true);
    expect(feature(r, "product-snippet")).toMatchObject({
      status: "missing-required",
      missingRequired: ["offers | review | aggregateRating"],
    });
    expect(r.issues.find((i) => i.code === "missing-required")?.source).toMatch(
      /^https:\/\/developers\.google\.com\//,
    );
  });

  it("marks a complete product eligible for snippets and merchant listings", () => {
    const r = validateJsonLd(
      jsonLd(
        product({
          name: "Atlas lamp",
          image: "https://shop.example.ma/atlas.jpg",
          offers: { price: "89.00", priceCurrency: "EUR", availability: "InStock" },
        }),
      ),
    );
    expect(feature(r, "product-snippet")?.status).toBe("eligible");
    expect(feature(r, "merchant-listing")?.status).toBe("eligible");
  });

  it("rejects AggregateOffer for merchant listings", () => {
    const r = validateJsonLd(
      jsonLd(
        product({
          name: "Pulse watch",
          image: "https://w.example.ma/p.jpg",
          offers: { aggregate: true, lowPrice: 199, priceCurrency: "EUR" },
        }),
      ),
    );
    expect(feature(r, "product-snippet")?.status).toBe("eligible");
    expect(feature(r, "merchant-listing")?.status).toBe("missing-required");
  });

  it("checks breadcrumb rules", () => {
    const one = validateJsonLd(
      jsonLd(breadcrumbList([{ name: "Home", url: "https://a.example.ma/" }])),
    );
    expect(feature(one, "breadcrumb")?.status).toBe("missing-required");
    const noUrl = validateJsonLd(jsonLd(breadcrumbList([{ name: "Home" }, { name: "Page" }])));
    expect(feature(noUrl, "breadcrumb")?.missingRequired).toContain("itemListElement[0].item");
    const ok = validateJsonLd(
      jsonLd(breadcrumbList([{ name: "Home", url: "https://a.example.ma/" }, { name: "Page" }])),
    );
    expect(feature(ok, "breadcrumb")?.status).toBe("eligible");
  });

  it("blocks self-serving review stars on a business's own page", () => {
    const r = validateJsonLd(
      jsonLd(
        localBusiness({
          type: "Dentist",
          name: "Cabinet Amal",
          address: { addressLocality: "Rabat", addressCountry: "MA" },
          aggregateRating: { ratingValue: 4.8, reviewCount: 120 },
        }),
      ),
    );
    expect(feature(r, "local-business")?.status).toBe("eligible");
    expect(feature(r, "review-snippet")?.status).toBe("policy-blocked");
    expect(codes(r, "google")).toContain("self-serving-review");
  });

  it("checks event locations, physical and virtual", () => {
    const venueless = validateJsonLd(
      jsonLd(
        event({
          name: "Gnaoua night",
          startDate: "2026-11-20T21:00+01:00",
          location: { virtual: { url: "" } },
        }),
      ),
    );
    expect(feature(venueless, "event")?.missingRequired).toContain(
      "location.url (VirtualLocation)",
    );
    const ok = validateJsonLd(
      jsonLd(
        event({
          name: "Gnaoua night",
          startDate: "2026-11-20T21:00+01:00",
          eventStatus: "EventScheduled",
          location: {
            name: "Dar Souiri",
            address: { addressLocality: "Essaouira", addressCountry: "MA" },
          },
        }),
      ),
    );
    expect(feature(ok, "event")?.status).toBe("eligible");
  });

  it("requires a location or remote eligibility for jobs", () => {
    const base = {
      title: "Designer",
      description: "<p>Design systems.</p>",
      datePosted: "2026-10-01",
      hiringOrganization: { name: "UX-STING" },
    };
    expect(feature(validateJsonLd(jsonLd(jobPosting(base))), "job-posting")?.status).toBe(
      "missing-required",
    );
    const onsite = validateJsonLd(
      jsonLd(
        jobPosting({
          ...base,
          jobLocation: { address: { addressLocality: "Casablanca", addressCountry: "MA" } },
        }),
      ),
    );
    expect(feature(onsite, "job-posting")?.status).toBe("eligible");
  });

  it("reports retired features as info, not errors", () => {
    const r = validateJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Open on Sunday?" }],
    });
    expect(r.valid).toBe(true);
    expect(feature(r, "faq")?.status).toBe("retired");
    expect(r.issues.find((i) => i.code === "retired-feature")?.severity).toBe("info");
  });

  it("says when a type has no Google rich result", () => {
    const r = validateJsonLd(jsonLd(service({ name: "Airport transfer" })));
    expect(codes(r, "google")).toContain("no-rich-result");
    expect(r.features).toEqual([]);
  });

  it("every rule cites an official source and a check date", () => {
    for (const rule of GOOGLE_FEATURES) {
      expect(rule.source).toMatch(/^https:\/\/developers\.google\.com\//);
      expect(rule.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("validates the blocks extracted from a page", () => {
    const html = `<script type="application/ld+json">${serializeJsonLd(
      breadcrumbList([{ name: "Home", url: "https://a.example.ma/" }, { name: "Stays" }]),
    )}</script>`;
    const r = validateJsonLd(extractJsonLd(html).map((b) => b.data));
    expect(feature(r, "breadcrumb")?.status).toBe("eligible");
    expect(r.issues.find((i) => i.layer === "google")?.path ?? "$[0]").toMatch(/^\$\[0\]/);
  });
});
