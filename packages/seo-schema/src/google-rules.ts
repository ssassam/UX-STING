/**
 * Google Search rich-result requirements, kept apart from schema.org
 * validity. Valid schema.org markup can still be ineligible for a rich
 * result, and eligible markup is never a guarantee: Google decides whether
 * to show any rich result.
 *
 * Each rule names its official source and the date it was last checked.
 * `confidence: "verified"` means the required properties were confirmed
 * against that page on `checkedAt`; `"review"` means they follow the page
 * as previously documented and should be re-checked before relying on them.
 * Update `checkedAt` whenever you re-verify a rule.
 */

export type RuleStatus = "active" | "retired";

export interface GoogleFeatureRule {
  id: string;
  name: string;
  /** schema.org types this feature reads (subtypes listed explicitly). */
  types: string[];
  status: RuleStatus;
  source: string;
  checkedAt: string;
  confidence: "verified" | "review";
  /** Property paths that must be present (dot notation; arrays are checked per item). */
  required: string[];
  /** At least one path from each group must be present. */
  requiredOneOf?: string[][];
  recommended: string[];
  note?: string;
}

const SD = "https://developers.google.com/search/docs/appearance/structured-data";
const CHECKED = "2026-10-14";

/** Subtypes of LocalBusiness that UX-STING examples and common sites use. */
export const LOCAL_BUSINESS_TYPES = [
  "LocalBusiness",
  "Restaurant",
  "FoodEstablishment",
  "CafeOrCoffeeShop",
  "Bakery",
  "BarOrPub",
  "Hotel",
  "LodgingBusiness",
  "Store",
  "OnlineStore",
  "AutoRental",
  "TravelAgency",
  "Dentist",
  "MedicalBusiness",
  "HealthAndBeautyBusiness",
  "BeautySalon",
  "HairSalon",
  "ProfessionalService",
  "LegalService",
  "RealEstateAgent",
  "HomeAndConstructionBusiness",
  "AutomotiveBusiness",
  "SportsActivityLocation",
  "EntertainmentBusiness",
];

export const ORGANIZATION_TYPES = [
  "Organization",
  "Corporation",
  "NGO",
  "EducationalOrganization",
  "GovernmentOrganization",
  "OnlineStore",
  ...LOCAL_BUSINESS_TYPES.filter((t) => t !== "OnlineStore"),
];

export const GOOGLE_FEATURES: GoogleFeatureRule[] = [
  {
    id: "article",
    name: "Article",
    types: ["Article", "NewsArticle", "BlogPosting"],
    status: "active",
    source: `${SD}/article`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: [],
    recommended: ["author", "author.name", "headline", "image", "datePublished", "dateModified"],
    note: "No required properties. Dates should include a time zone.",
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    types: ["BreadcrumbList"],
    status: "active",
    source: `${SD}/breadcrumb`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: ["itemListElement", "itemListElement.position", "itemListElement.name"],
    recommended: [],
    note: "Needs at least two ListItems; every item except the last needs `item` (a URL).",
  },
  {
    id: "product-snippet",
    name: "Product snippet",
    types: ["Product"],
    status: "active",
    source: `${SD}/product-snippet`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: ["name"],
    requiredOneOf: [["offers", "review", "aggregateRating"]],
    recommended: ["image", "description", "offers.price", "offers.priceCurrency", "brand"],
  },
  {
    id: "merchant-listing",
    name: "Merchant listing",
    types: ["Product"],
    status: "active",
    source: `${SD}/merchant-listing`,
    checkedAt: CHECKED,
    confidence: "review",
    required: ["name", "image", "offers", "offers.price", "offers.priceCurrency"],
    recommended: ["offers.availability", "offers.itemCondition", "gtin", "brand", "description"],
    note: "Only for pages where people can buy the product. AggregateOffer is not used for merchant listings.",
  },
  {
    id: "review-snippet",
    name: "Review snippet",
    types: ["AggregateRating", "Review"],
    status: "active",
    source: `${SD}/review-snippet`,
    checkedAt: CHECKED,
    confidence: "review",
    required: [],
    recommended: ["bestRating", "worstRating"],
    note: "Not shown for self-serving reviews on LocalBusiness or Organization pages.",
  },
  {
    id: "local-business",
    name: "Local business",
    types: LOCAL_BUSINESS_TYPES,
    status: "active",
    source: `${SD}/local-business`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: ["name"],
    recommended: [
      "address",
      "address.streetAddress",
      "address.addressLocality",
      "address.addressCountry",
      "geo",
      "openingHoursSpecification",
      "telephone",
      "url",
      "image",
      "priceRange",
    ],
    note: "Use the most specific LocalBusiness subtype. Give the address as fully as possible.",
  },
  {
    id: "event",
    name: "Event",
    types: ["Event", "MusicEvent", "SportsEvent", "TheaterEvent", "Festival", "BusinessEvent"],
    status: "active",
    source: `${SD}/event`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: ["name", "startDate", "location"],
    recommended: [
      "description",
      "endDate",
      "eventStatus",
      "image",
      "offers",
      "organizer",
      "performer",
    ],
    note: "A Place location needs `name` and `address`; online events use a VirtualLocation with `url`.",
  },
  {
    id: "recipe",
    name: "Recipe",
    types: ["Recipe"],
    status: "active",
    source: `${SD}/recipe`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: ["name", "image"],
    recommended: [
      "author",
      "datePublished",
      "description",
      "recipeIngredient",
      "recipeInstructions",
      "totalTime",
      "recipeYield",
      "recipeCategory",
      "recipeCuisine",
      "keywords",
      "nutrition.calories",
    ],
  },
  {
    id: "job-posting",
    name: "Job posting",
    types: ["JobPosting"],
    status: "active",
    source: `${SD}/job-posting`,
    checkedAt: CHECKED,
    confidence: "review",
    required: [
      "title",
      "description",
      "datePosted",
      "hiringOrganization",
      "hiringOrganization.name",
    ],
    requiredOneOf: [["jobLocation", "applicantLocationRequirements"]],
    recommended: ["validThrough", "employmentType", "baseSalary", "identifier", "directApply"],
    note: "`jobLocation` needs `addressCountry`. Fully remote jobs use jobLocationType TELECOMMUTE plus applicantLocationRequirements.",
  },
  {
    id: "organization",
    name: "Organization",
    // LocalBusiness subtypes are covered by the local-business rule instead.
    types: [
      "Organization",
      "Corporation",
      "NGO",
      "EducationalOrganization",
      "GovernmentOrganization",
      "OnlineStore",
    ],
    status: "active",
    source: `${SD}/organization`,
    checkedAt: CHECKED,
    confidence: "verified",
    required: [],
    recommended: ["name", "url", "logo", "sameAs", "address", "telephone", "email"],
    note: "No required properties. Put it on the home page or an about page.",
  },
  {
    id: "site-name",
    name: "Site name",
    types: ["WebSite"],
    status: "active",
    source: "https://developers.google.com/search/docs/appearance/site-names",
    checkedAt: CHECKED,
    confidence: "review",
    required: ["name", "url"],
    recommended: ["alternateName"],
    note: "Place on the home page only. The sitelinks search box was retired, so `potentialAction` is not needed.",
  },
  {
    id: "faq",
    name: "FAQ",
    types: ["FAQPage"],
    status: "retired",
    source: "https://developers.google.com/search/updates",
    checkedAt: CHECKED,
    confidence: "verified",
    required: [],
    recommended: [],
    note: "FAQ rich results stopped appearing in Google Search on 2026-05-07. The markup is still valid schema.org and harmless.",
  },
  {
    id: "how-to",
    name: "How-to",
    types: ["HowTo"],
    status: "retired",
    source: "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
    checkedAt: CHECKED,
    confidence: "verified",
    required: [],
    recommended: [],
    note: "How-to rich results were removed in September 2023.",
  },
  {
    id: "retired-2025",
    name: "Retired 2025 features",
    types: [
      "ClaimReview",
      "SpecialAnnouncement",
      "EstimatedSalary",
      "LearningVideo",
      "VehicleListing",
    ],
    status: "retired",
    source: "https://developers.google.com/search/blog/2025/06/simplifying-search-results",
    checkedAt: CHECKED,
    confidence: "review",
    required: [],
    recommended: [],
    note: "Google stopped showing these rich results in 2025. Markup may still be used by other consumers. (Course info, which also uses `Course`, was retired too; it is not flagged here because `Course` is used by other features.)",
  },
];

/** Types that are valid schema.org but have no Google rich result of their own. */
export const NO_GOOGLE_FEATURE_TYPES = ["Service", "Person", "WebPage", "ItemList", "Place"];
