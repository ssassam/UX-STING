import type {
  AgentInput,
  AggregateOfferInput,
  AggregateRatingInput,
  ArticleInput,
  BreadcrumbItemInput,
  ContactPointInput,
  EventInput,
  GeoInput,
  HotelInput,
  ImageInput,
  JobPostingInput,
  JsonLdDocument,
  LocalBusinessInput,
  OfferInput,
  OpeningHoursInput,
  OrganizationInput,
  PostalAddressInput,
  ProductInput,
  RecipeInput,
  RestaurantInput,
  ReviewInput,
  SchemaNode,
  ServiceInput,
  WebSiteInput,
} from "./types.js";

export const SCHEMA_CONTEXT = "https://schema.org" as const;

/**
 * Removes `undefined`, `null`, empty strings, empty arrays and empty objects
 * so builders never emit blank properties. Values are otherwise passed
 * through unchanged: nothing is invented or defaulted.
 */
export function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    const items = value.map(compact).filter((v) => !isEmpty(v));
    return items as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      const c = compact(v);
      if (!isEmpty(c)) out[key] = c;
    }
    return out as T;
  }
  return value;
}

function isEmpty(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

const enumUrl = (value: string | undefined) =>
  value === undefined ? undefined : `https://schema.org/${value}`;

const one = <T>(v: T | T[] | undefined): T[] | undefined =>
  v === undefined ? undefined : Array.isArray(v) ? v : [v];

/** Emits a single value as itself and several as an array. */
const many = <T, R>(v: T | T[] | undefined, map: (x: T) => R): R | R[] | undefined => {
  const list = one(v);
  if (!list) return undefined;
  const mapped = list.map(map);
  return mapped.length === 1 ? mapped[0] : mapped;
};

function image(input: ImageInput | undefined) {
  return many(input, (img) => (typeof img === "string" ? img : { "@type": "ImageObject", ...img }));
}

export function agent(input: AgentInput): SchemaNode {
  const { type, ...rest } = input;
  return compact({ "@type": type, ...rest });
}

export function postalAddress(input: PostalAddressInput): SchemaNode {
  return compact({ "@type": "PostalAddress", ...input });
}

export function geo(input: GeoInput): SchemaNode {
  return { "@type": "GeoCoordinates", latitude: input.latitude, longitude: input.longitude };
}

export function openingHours(input: OpeningHoursInput): SchemaNode {
  return compact({ "@type": "OpeningHoursSpecification", ...input });
}

function contactPoint(input: ContactPointInput): SchemaNode {
  return compact({ "@type": "ContactPoint", ...input });
}

export function offer(input: OfferInput): SchemaNode {
  return compact({
    "@type": "Offer",
    ...input,
    availability: enumUrl(input.availability),
    itemCondition: enumUrl(input.itemCondition),
    seller: input.seller && agent(input.seller),
  });
}

export function aggregateOffer(input: AggregateOfferInput): SchemaNode {
  return compact({ "@type": "AggregateOffer", ...input });
}

export function aggregateRating(input: AggregateRatingInput): SchemaNode {
  return compact({ "@type": "AggregateRating", ...input });
}

export function review(input: ReviewInput): SchemaNode {
  const { author, ratingValue, bestRating, worstRating, ...rest } = input;
  return compact({
    "@type": "Review",
    author: agent(author),
    reviewRating: { "@type": "Rating", ratingValue, bestRating, worstRating },
    ...rest,
  });
}

export function organization(input: OrganizationInput): SchemaNode {
  const { type = "Organization", image: img, address, contactPoint: cp, ...rest } = input;
  return compact({
    "@type": type,
    ...rest,
    image: image(img),
    address: address && postalAddress(address),
    contactPoint: many(cp, contactPoint),
  });
}

export function webSite(input: WebSiteInput): SchemaNode {
  const { publisher, ...rest } = input;
  return compact({ "@type": "WebSite", ...rest, publisher: publisher && agent(publisher) });
}

/**
 * Breadcrumb trail in order, starting at the top level. Positions are
 * assigned from 1. Every item except the last (the current page) needs a URL.
 */
export function breadcrumbList(items: BreadcrumbItemInput[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) =>
      compact({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url }),
    ),
  };
}

export function article(input: ArticleInput): SchemaNode {
  const { type = "Article", image: img, author, publisher, ...rest } = input;
  return compact({
    "@type": type,
    ...rest,
    image: image(img),
    author: many(author, agent),
    publisher: publisher && agent(publisher),
  });
}

/** `BlogPosting` shorthand for `article({ type: "BlogPosting", ... })`. */
export const blogPosting = (input: Omit<ArticleInput, "type">) =>
  article({ ...input, type: "BlogPosting" });

export function product(input: ProductInput): SchemaNode {
  const { image: img, brand, offers, aggregateRating: rating, review: reviews, ...rest } = input;
  let offerNode: unknown;
  if (offers && !Array.isArray(offers) && "aggregate" in offers) {
    const { aggregate: _aggregate, ...agg } = offers;
    offerNode = aggregateOffer(agg);
  } else {
    offerNode = many(offers as OfferInput | OfferInput[] | undefined, offer);
  }
  return compact({
    "@type": "Product",
    ...rest,
    image: image(img),
    brand: brand && { "@type": "Brand", name: brand },
    offers: offerNode,
    aggregateRating: rating && aggregateRating(rating),
    review: many(reviews, review),
  });
}

function businessFields(input: Omit<LocalBusinessInput, "type">) {
  const {
    image: img,
    address,
    geo: g,
    openingHours: hours,
    aggregateRating: rating,
    review: reviews,
    ...rest
  } = input;
  return {
    ...rest,
    image: image(img),
    address: address && postalAddress(address),
    geo: g && geo(g),
    openingHoursSpecification: hours?.map(openingHours),
    aggregateRating: rating && aggregateRating(rating),
    review: many(reviews, review),
  };
}

export function localBusiness(input: LocalBusinessInput): SchemaNode {
  const { type = "LocalBusiness", ...rest } = input;
  return compact({ "@type": type, ...businessFields(rest) });
}

export function restaurant(input: RestaurantInput): SchemaNode {
  const { servesCuisine, menu, acceptsReservations, ...rest } = input;
  return compact({
    "@type": "Restaurant",
    ...businessFields(rest),
    servesCuisine,
    menu,
    acceptsReservations,
  });
}

export function hotel(input: HotelInput): SchemaNode {
  const { starRating, amenities, checkinTime, checkoutTime, petsAllowed, ...rest } = input;
  return compact({
    "@type": "Hotel",
    ...businessFields(rest),
    starRating:
      starRating === undefined ? undefined : { "@type": "Rating", ratingValue: starRating },
    amenityFeature: amenities?.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    checkinTime,
    checkoutTime,
    petsAllowed,
  });
}

export function service(input: ServiceInput): SchemaNode {
  const { provider, offers, ...rest } = input;
  return compact({
    "@type": "Service",
    ...rest,
    provider: provider && agent(provider),
    offers: many(offers, offer),
  });
}

export function event(input: EventInput): SchemaNode {
  const {
    location,
    image: img,
    organizer,
    performer,
    offers,
    eventStatus,
    eventAttendanceMode,
    ...rest
  } = input;
  return compact({
    "@type": "Event",
    ...rest,
    location: many(location, (loc) =>
      "virtual" in loc
        ? { "@type": "VirtualLocation", url: loc.virtual.url }
        : compact({
            "@type": "Place",
            name: loc.name,
            address: postalAddress(loc.address),
            geo: loc.geo && geo(loc.geo),
          }),
    ),
    image: image(img),
    eventStatus: enumUrl(eventStatus),
    eventAttendanceMode: enumUrl(eventAttendanceMode),
    organizer: organizer && agent(organizer),
    performer: many(performer, agent),
    offers: many(offers, offer),
  });
}

export function recipe(input: RecipeInput): SchemaNode {
  const {
    image: img,
    author,
    recipeInstructions,
    calories,
    aggregateRating: rating,
    ...rest
  } = input;
  return compact({
    "@type": "Recipe",
    ...rest,
    image: image(img),
    author: many(author, agent),
    recipeInstructions: recipeInstructions?.map((text) => ({ "@type": "HowToStep", text })),
    nutrition: calories ? { "@type": "NutritionInformation", calories } : undefined,
    aggregateRating: rating && aggregateRating(rating),
  });
}

export function jobPosting(input: JobPostingInput): SchemaNode {
  const {
    hiringOrganization,
    jobLocation,
    remote,
    applicantLocationRequirements,
    baseSalary,
    identifier,
    ...rest
  } = input;
  return compact({
    "@type": "JobPosting",
    ...rest,
    hiringOrganization: agent({ type: "Organization", ...hiringOrganization }),
    jobLocation: many(jobLocation, (loc) => ({
      "@type": "Place",
      address: postalAddress(loc.address),
    })),
    jobLocationType: remote ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: applicantLocationRequirements?.map((name) => ({
      "@type": "Country",
      name,
    })),
    baseSalary: baseSalary && {
      "@type": "MonetaryAmount",
      currency: baseSalary.currency,
      value: compact({
        "@type": "QuantitativeValue",
        value: baseSalary.value,
        minValue: baseSalary.minValue,
        maxValue: baseSalary.maxValue,
        unitText: baseSalary.unitText,
      }),
    },
    identifier: identifier && { "@type": "PropertyValue", ...identifier },
  });
}

/**
 * Wraps one node, or several as an `@graph`, in a document with a single
 * `@context`. Use one document per page and link nodes with `@id`.
 */
export function jsonLd(nodes: SchemaNode | SchemaNode[]): JsonLdDocument {
  if (Array.isArray(nodes)) {
    if (nodes.length === 1) return { "@context": SCHEMA_CONTEXT, ...nodes[0]! };
    return { "@context": SCHEMA_CONTEXT, "@graph": nodes };
  }
  return { "@context": SCHEMA_CONTEXT, ...nodes };
}
