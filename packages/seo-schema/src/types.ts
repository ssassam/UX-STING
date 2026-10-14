/**
 * Typed subset of the schema.org vocabulary used by the builders. Types
 * describe what schema.org allows, not what Google requires: Google's
 * rich-result requirements are checked separately by `validate()`.
 *
 * Every value must come from your real data. The builders never fill in
 * missing ratings, prices, authors, addresses or availability.
 */

/** An absolute http(s) URL. */
export type Url = string;
/** ISO 8601 date or date-time, e.g. `2026-10-14` or `2026-10-14T19:30:00+02:00`. */
export type IsoDate = string;
/** ISO 8601 duration, e.g. `PT1H30M`. */
export type IsoDuration = string;
/** Three-letter ISO 4217 code, e.g. `EUR`. */
export type CurrencyCode = string;
/** BCP 47 language tag, e.g. `fr`, `en-GB`, `ar`. */
export type LanguageTag = string;

export type DayOfWeek =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type ItemAvailability =
  | "BackOrder"
  | "Discontinued"
  | "InStock"
  | "InStoreOnly"
  | "LimitedAvailability"
  | "MadeToOrder"
  | "OnlineOnly"
  | "OutOfStock"
  | "PreOrder"
  | "PreSale"
  | "Reserved"
  | "SoldOut";

export type OfferItemCondition =
  "NewCondition" | "UsedCondition" | "RefurbishedCondition" | "DamagedCondition";

export type EventStatus =
  "EventScheduled" | "EventCancelled" | "EventMovedOnline" | "EventPostponed" | "EventRescheduled";

export type EventAttendanceMode =
  "OfflineEventAttendanceMode" | "OnlineEventAttendanceMode" | "MixedEventAttendanceMode";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

/** Any JSON-LD node: an object with an `@type`. */
export interface SchemaNode {
  "@type": string | string[];
  "@id"?: string;
  [property: string]: unknown;
}

/** A JSON-LD document ready to serialize. */
export interface JsonLdDocument {
  "@context": "https://schema.org";
  "@type"?: string | string[];
  "@graph"?: SchemaNode[];
  [property: string]: unknown;
}

export interface ImageObjectInput {
  url: Url;
  width?: number;
  height?: number;
  caption?: string;
}
export type ImageInput = Url | ImageObjectInput | Array<Url | ImageObjectInput>;

export interface PersonInput {
  name: string;
  url?: Url;
  sameAs?: Url[];
  jobTitle?: string;
  "@id"?: string;
}

export interface OrganizationRefInput {
  name: string;
  url?: Url;
  logo?: Url;
  sameAs?: Url[];
  "@id"?: string;
}

/** A person or organization, tagged so the right `@type` is emitted. */
export type AgentInput =
  ({ type: "Person" } & PersonInput) | ({ type: "Organization" } & OrganizationRefInput);

export interface PostalAddressInput {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  /** ISO 3166-1 alpha-2, e.g. `MA`, `FR`. */
  addressCountry?: string;
}

export interface GeoInput {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursInput {
  dayOfWeek: DayOfWeek | DayOfWeek[];
  /** `HH:MM` or `HH:MM:SS`, local time. */
  opens: string;
  closes: string;
  validFrom?: IsoDate;
  validThrough?: IsoDate;
}

export interface ContactPointInput {
  contactType: string;
  telephone?: string;
  email?: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

export interface OfferInput {
  /** Numeric price without currency symbols or thousands separators. */
  price?: number | string;
  priceCurrency?: CurrencyCode;
  availability?: ItemAvailability;
  itemCondition?: OfferItemCondition;
  url?: Url;
  priceValidUntil?: IsoDate;
  validFrom?: IsoDate;
  seller?: AgentInput;
  sku?: string;
}

export interface AggregateOfferInput {
  lowPrice: number | string;
  highPrice?: number | string;
  priceCurrency: CurrencyCode;
  offerCount?: number;
}

/**
 * Ratings must summarise real reviews that are visible on the page. Never
 * add ratings to your own business or organization pages (Google treats
 * them as self-serving and ignores them).
 */
export interface AggregateRatingInput {
  ratingValue: number;
  reviewCount?: number;
  ratingCount?: number;
  bestRating?: number;
  worstRating?: number;
}

export interface ReviewInput {
  author: AgentInput;
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  reviewBody?: string;
  datePublished?: IsoDate;
}

interface ThingInput {
  "@id"?: string;
  name: string;
  url?: Url;
  description?: string;
  image?: ImageInput;
  sameAs?: Url[];
}

export interface OrganizationInput extends ThingInput {
  /** A more specific type, e.g. `OnlineStore`, `NGO`, `Corporation`. */
  type?: string;
  legalName?: string;
  logo?: Url;
  email?: string;
  telephone?: string;
  address?: PostalAddressInput;
  contactPoint?: ContactPointInput | ContactPointInput[];
  foundingDate?: IsoDate;
  vatID?: string;
  taxID?: string;
}

export interface WebSiteInput {
  "@id"?: string;
  name: string;
  url: Url;
  alternateName?: string | string[];
  inLanguage?: LanguageTag | LanguageTag[];
  publisher?: AgentInput;
}

export interface BreadcrumbItemInput {
  name: string;
  /** Absolute URL. May be omitted for the last item (the current page). */
  url?: Url;
}

export interface ArticleInput {
  "@id"?: string;
  /** `Article` (default), `NewsArticle` or `BlogPosting`. */
  type?: "Article" | "NewsArticle" | "BlogPosting";
  headline: string;
  description?: string;
  url?: Url;
  image?: ImageInput;
  author?: AgentInput | AgentInput[];
  publisher?: AgentInput;
  datePublished?: IsoDate;
  dateModified?: IsoDate;
  inLanguage?: LanguageTag;
  articleSection?: string;
  keywords?: string | string[];
  wordCount?: number;
}

export interface ProductInput extends ThingInput {
  sku?: string;
  gtin?: string;
  mpn?: string;
  /** Brand name or organization. */
  brand?: string;
  color?: string;
  material?: string;
  category?: string;
  offers?: OfferInput | OfferInput[] | ({ aggregate: true } & AggregateOfferInput);
  aggregateRating?: AggregateRatingInput;
  review?: ReviewInput | ReviewInput[];
}

export interface LocalBusinessInput extends ThingInput {
  /** Most specific LocalBusiness subtype, e.g. `Dentist`, `AutoRental`. Default `LocalBusiness`. */
  type?: string;
  address?: PostalAddressInput;
  geo?: GeoInput;
  telephone?: string;
  email?: string;
  priceRange?: string;
  openingHours?: OpeningHoursInput[];
  areaServed?: string | string[];
  hasMap?: Url;
  /** Only for sites that collect reviews about *other* businesses. */
  aggregateRating?: AggregateRatingInput;
  review?: ReviewInput | ReviewInput[];
}

export interface RestaurantInput extends Omit<LocalBusinessInput, "type"> {
  servesCuisine?: string | string[];
  menu?: Url;
  acceptsReservations?: boolean | Url;
}

export interface HotelInput extends Omit<LocalBusinessInput, "type"> {
  /** Official classification only (e.g. a national star rating), not a review score. */
  starRating?: number;
  checkinTime?: string;
  checkoutTime?: string;
  amenities?: string[];
  petsAllowed?: boolean;
}

export interface ServiceInput {
  "@id"?: string;
  name: string;
  serviceType?: string;
  description?: string;
  url?: Url;
  provider?: AgentInput;
  areaServed?: string | string[];
  offers?: OfferInput | OfferInput[];
}

export interface PlaceInput {
  name: string;
  address: PostalAddressInput;
  geo?: GeoInput;
}

export interface VirtualLocationInput {
  url: Url;
}

export interface EventInput {
  "@id"?: string;
  name: string;
  startDate: IsoDate;
  endDate?: IsoDate;
  /** A venue, an online URL, or both for mixed events. */
  location:
    | PlaceInput
    | { virtual: VirtualLocationInput }
    | Array<PlaceInput | { virtual: VirtualLocationInput }>;
  description?: string;
  image?: ImageInput;
  url?: Url;
  eventStatus?: EventStatus;
  eventAttendanceMode?: EventAttendanceMode;
  previousStartDate?: IsoDate;
  organizer?: AgentInput;
  performer?: AgentInput | AgentInput[];
  offers?: OfferInput | OfferInput[];
}

export interface RecipeInput {
  "@id"?: string;
  name: string;
  image: ImageInput;
  description?: string;
  author?: AgentInput | AgentInput[];
  datePublished?: IsoDate;
  prepTime?: IsoDuration;
  cookTime?: IsoDuration;
  totalTime?: IsoDuration;
  recipeYield?: string | number;
  recipeCategory?: string;
  recipeCuisine?: string;
  keywords?: string | string[];
  recipeIngredient?: string[];
  /** Steps in order. Each string becomes a HowToStep. */
  recipeInstructions?: string[];
  calories?: string;
  aggregateRating?: AggregateRatingInput;
}

export interface JobPostingInput {
  "@id"?: string;
  title: string;
  /** Full HTML description: responsibilities, qualifications, hours. */
  description: string;
  datePosted: IsoDate;
  validThrough?: IsoDate;
  hiringOrganization: OrganizationRefInput;
  /** Physical workplace(s). Omit only for fully remote jobs. */
  jobLocation?: { address: PostalAddressInput } | Array<{ address: PostalAddressInput }>;
  /** Set for fully remote jobs, together with `applicantLocationRequirements`. */
  remote?: boolean;
  /** Countries or regions where remote applicants may live. */
  applicantLocationRequirements?: string[];
  employmentType?: EmploymentType | EmploymentType[];
  baseSalary?: {
    currency: CurrencyCode;
    value?: number;
    minValue?: number;
    maxValue?: number;
    unitText: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  };
  identifier?: { name: string; value: string };
  directApply?: boolean;
}
