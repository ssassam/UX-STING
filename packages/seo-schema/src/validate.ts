import {
  GOOGLE_FEATURES,
  LOCAL_BUSINESS_TYPES,
  NO_GOOGLE_FEATURE_TYPES,
  ORGANIZATION_TYPES,
  type GoogleFeatureRule,
} from "./google-rules.js";

export type Severity = "error" | "warning" | "info";

/**
 * One finding. `layer: "schema"` findings are deterministic checks of
 * schema.org/JSON-LD correctness; `layer: "google"` findings concern Google
 * rich-result eligibility and always cite their source.
 */
export interface Issue {
  layer: "schema" | "google";
  severity: Severity;
  code: string;
  message: string;
  /** JSON path of the offending value, e.g. `$["@graph"][1].offers.price`. */
  path: string;
  type?: string;
  feature?: string;
  source?: string;
}

export type FeatureStatus = "eligible" | "missing-required" | "retired" | "policy-blocked";

export interface FeatureResult {
  feature: string;
  name: string;
  path: string;
  type: string;
  status: FeatureStatus;
  missingRequired: string[];
  missingRecommended: string[];
  source: string;
  checkedAt: string;
  confidence: GoogleFeatureRule["confidence"];
  note?: string;
}

export interface ValidationResult {
  /** `true` when there are no schema-layer errors. Says nothing about rich results. */
  valid: boolean;
  issues: Issue[];
  /** Google features each node could qualify for. Eligible ≠ shown: Google decides. */
  features: FeatureResult[];
  /** Number of typed nodes found. */
  nodes: number;
}

export const ELIGIBILITY_DISCLAIMER =
  "Eligibility means the markup meets Google's documented requirements. It does not guarantee that a rich result, ranking or indexing will happen.";

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => !!v && typeof v === "object" && !Array.isArray(v);
const typesOf = (node: Json): string[] => {
  const t = node["@type"];
  return (Array.isArray(t) ? t : [t]).filter((x): x is string => typeof x === "string");
};

const URL_PROPS = new Set([
  "url",
  "logo",
  "sameAs",
  "menu",
  "hasMap",
  "contentUrl",
  "thumbnailUrl",
  "embedUrl",
  "mainEntityOfPage",
  "image",
  "item",
]);
const DATE_PROPS = new Set([
  "datePublished",
  "dateModified",
  "dateCreated",
  "startDate",
  "endDate",
  "previousStartDate",
  "datePosted",
  "validThrough",
  "validFrom",
  "priceValidUntil",
  "uploadDate",
  "foundingDate",
  "birthDate",
]);
const DURATION_PROPS = new Set(["prepTime", "cookTime", "totalTime", "duration", "timeRequired"]);
const PRICE_PROPS = new Set(["price", "lowPrice", "highPrice", "minValue", "maxValue"]);
const CURRENCY_PROPS = new Set(["priceCurrency", "currency"]);

const ENUMS: Record<string, string[]> = {
  availability: [
    "BackOrder",
    "Discontinued",
    "InStock",
    "InStoreOnly",
    "LimitedAvailability",
    "MadeToOrder",
    "OnlineOnly",
    "OutOfStock",
    "PreOrder",
    "PreSale",
    "Reserved",
    "SoldOut",
  ],
  itemCondition: ["NewCondition", "UsedCondition", "RefurbishedCondition", "DamagedCondition"],
  eventStatus: [
    "EventScheduled",
    "EventCancelled",
    "EventMovedOnline",
    "EventPostponed",
    "EventRescheduled",
  ],
  eventAttendanceMode: [
    "OfflineEventAttendanceMode",
    "OnlineEventAttendanceMode",
    "MixedEventAttendanceMode",
  ],
  dayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "PublicHolidays",
  ],
};

const ISO_DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const ISO_DURATION =
  /^P(?=\d|T\d)(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const LANGUAGE = /^[a-z]{2,3}(-[A-Za-z]{4})?(-([A-Za-z]{2}|\d{3}))?$/i;
const PLACEHOLDER =
  /\[[^\]\n]{2,40}\]|\{\{[^}]*\}\}|lorem ipsum|\b(TODO|TBD|FIXME)\b|\bXXX+\b|\bexample\.(com|org|net)\b|your (company|business) name/i;

function validIsoDate(value: string): "ok" | "no-tz" | "invalid" {
  const m = ISO_DATE.exec(value);
  if (!m) return "invalid";
  const [, y, mo, d, h, , , tz] = m;
  const month = Number(mo);
  const day = Number(d);
  const date = new Date(Date.UTC(Number(y), month - 1, day));
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "invalid";
  return h !== undefined && !tz ? "no-tz" : "ok";
}

const enumName = (value: string) => value.replace(/^https?:\/\/schema\.org\//, "");

const join = (path: string, key: string | number) =>
  typeof key === "number"
    ? `${path}[${key}]`
    : /^[A-Za-z_]\w*$/.test(key)
      ? `${path}.${key}`
      : `${path}[${JSON.stringify(key)}]`;

interface Visit {
  node: Json;
  path: string;
  types: string[];
  parentTypes: string[];
  property?: string;
}

/**
 * Validates JSON-LD: a document object, an array of documents, or the parsed
 * blocks of a page. Runs deterministic schema.org checks, then evaluates
 * Google rich-result eligibility for every typed node.
 */
export function validateJsonLd(input: unknown): ValidationResult {
  const issues: Issue[] = [];
  const visits: Visit[] = [];
  const schema = (severity: Severity, code: string, message: string, path: string, type?: string) =>
    issues.push({ layer: "schema", severity, code, message, path, ...(type ? { type } : {}) });

  const docs = Array.isArray(input) ? input : [input];
  docs.forEach((doc, i) => {
    const docPath = Array.isArray(input) ? `$[${i}]` : "$";
    if (!isObject(doc)) {
      schema("error", "not-an-object", "A JSON-LD block must be an object.", docPath);
      return;
    }
    const context = doc["@context"];
    const contextText =
      typeof context === "string" ? context : isObject(context) ? context["@vocab"] : undefined;
    if (context === undefined) {
      schema("error", "missing-context", 'Missing "@context": "https://schema.org".', docPath);
    } else if (typeof contextText === "string" && /^http:\/\/schema\.org\/?$/.test(contextText)) {
      schema("warning", "insecure-context", 'Use "https://schema.org" as the @context.', docPath);
    } else if (typeof contextText !== "string" || !/^https:\/\/schema\.org\/?$/.test(contextText)) {
      schema(
        "warning",
        "unknown-context",
        "The @context is not schema.org; the vocabulary was not checked.",
        docPath,
      );
    }
    const graph = doc["@graph"];
    if (Array.isArray(graph)) {
      graph.forEach((node, j) => walk(node, join(join(docPath, "@graph"), j), [], undefined, true));
    } else {
      walk(doc, docPath, [], undefined, true);
    }
  });

  function walk(
    value: unknown,
    path: string,
    parentTypes: string[],
    property: string | undefined,
    topLevel: boolean,
  ) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, join(path, i), parentTypes, property, topLevel));
      return;
    }
    if (!isObject(value)) return;
    const types = typesOf(value);
    if (types.length === 0) {
      if (topLevel) schema("error", "missing-type", 'Top-level node has no "@type".', path);
    } else {
      visits.push({ node: value, path, types, parentTypes, ...(property ? { property } : {}) });
    }
    for (const [key, v] of Object.entries(value)) {
      if (key === "@context" || key === "@graph") continue;
      const childPath = join(path, key);
      checkProperty(key, v, childPath, types[0]);
      if (isObject(v) || Array.isArray(v)) walk(v, childPath, types, key, false);
    }
  }

  function checkProperty(key: string, value: unknown, path: string, type: string | undefined) {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v, i) => {
      const p = Array.isArray(value) ? join(path, i) : path;
      if (typeof v === "string") checkString(key, v, p, type);
      else if (typeof v === "number") checkNumber(key, v, p, type);
    });
  }

  function checkString(key: string, v: string, path: string, type?: string) {
    if (v.trim() === "") schema("warning", "empty-value", `"${key}" is empty.`, path, type);
    if (PLACEHOLDER.test(v))
      schema(
        "error",
        "placeholder",
        `"${key}" looks like placeholder text: "${v.slice(0, 60)}". Use real data or remove it.`,
        path,
        type,
      );
    if (URL_PROPS.has(key) && !/^https?:\/\/[^\s/$.?#][^\s]*$/i.test(v))
      schema("error", "relative-url", `"${key}" must be an absolute http(s) URL.`, path, type);
    if (DATE_PROPS.has(key)) {
      const r = validIsoDate(v);
      if (r === "invalid")
        schema("error", "invalid-date", `"${key}" must be an ISO 8601 date: "${v}".`, path, type);
      else if (r === "no-tz")
        schema(
          "info",
          "date-without-timezone",
          `"${key}" has a time but no time zone; Google will assume one.`,
          path,
          type,
        );
    }
    if (DURATION_PROPS.has(key) && !ISO_DURATION.test(v))
      schema(
        "error",
        "invalid-duration",
        `"${key}" must be an ISO 8601 duration such as "PT45M".`,
        path,
        type,
      );
    if (PRICE_PROPS.has(key) && !/^\d+(\.\d+)?$/.test(v))
      schema(
        "error",
        "invalid-price",
        `"${key}" must be a plain number without currency symbols or separators: "${v}".`,
        path,
        type,
      );
    if (CURRENCY_PROPS.has(key) && !/^[A-Z]{3}$/.test(v))
      schema(
        "error",
        "invalid-currency",
        `"${key}" must be a three-letter ISO 4217 code such as "EUR".`,
        path,
        type,
      );
    if (key === "addressCountry" && !/^[A-Z]{2}$/.test(v))
      schema(
        "warning",
        "country-code",
        `"addressCountry" should be an ISO 3166-1 alpha-2 code such as "MA": "${v}".`,
        path,
        type,
      );
    if ((key === "opens" || key === "closes") && !TIME.test(v))
      schema(
        "error",
        "invalid-time",
        `"${key}" must be a 24-hour time such as "09:00".`,
        path,
        type,
      );
    if (key === "inLanguage" && !LANGUAGE.test(v))
      schema(
        "warning",
        "language-tag",
        `"inLanguage" should be a BCP 47 tag such as "fr" or "en-GB".`,
        path,
        type,
      );
    const allowed = ENUMS[key];
    if (allowed) {
      const name = enumName(v);
      if (!allowed.includes(name))
        schema(
          "error",
          "invalid-enum",
          `"${key}" has an unknown value "${v}". Allowed: ${allowed.join(", ")}.`,
          path,
          type,
        );
      else if (!v.startsWith("https://schema.org/") && key !== "dayOfWeek")
        schema(
          "warning",
          "enum-url",
          `Use the full URL "https://schema.org/${name}" for "${key}".`,
          path,
          type,
        );
    }
  }

  function checkNumber(key: string, v: number, path: string, type?: string) {
    if (!Number.isFinite(v))
      schema("error", "invalid-number", `"${key}" is not a finite number.`, path, type);
    if (PRICE_PROPS.has(key) && v < 0)
      schema("error", "negative-price", `"${key}" cannot be negative.`, path, type);
    if (key === "latitude" && (v < -90 || v > 90))
      schema("error", "invalid-latitude", "Latitude must be between -90 and 90.", path, type);
    if (key === "longitude" && (v < -180 || v > 180))
      schema("error", "invalid-longitude", "Longitude must be between -180 and 180.", path, type);
    if ((key === "reviewCount" || key === "ratingCount") && (!Number.isInteger(v) || v < 1))
      schema(
        "error",
        "invalid-count",
        `"${key}" must be a whole number of at least 1. Do not publish ratings without reviews.`,
        path,
        type,
      );
  }

  // Rating ranges need the sibling best/worst values.
  for (const { node, path, types } of visits) {
    if (!types.some((t) => t === "Rating" || t === "AggregateRating")) continue;
    const value = Number(node.ratingValue);
    const best = node.bestRating === undefined ? 5 : Number(node.bestRating);
    const worst = node.worstRating === undefined ? 1 : Number(node.worstRating);
    if (node.ratingValue === undefined) continue;
    if (!Number.isFinite(value) || value < worst || value > best)
      schema(
        "error",
        "rating-out-of-range",
        `ratingValue ${String(node.ratingValue)} is outside ${worst}–${best}.`,
        join(path, "ratingValue"),
        types[0],
      );
  }

  const features = visits.flatMap((visit) => evaluateFeatures(visit, issues));
  return {
    valid: !issues.some((i) => i.layer === "schema" && i.severity === "error"),
    issues,
    features,
    nodes: visits.length,
  };
}

/** Returns the paths in `paths` that are missing on `node`. Arrays must satisfy the path in every item. */
function missing(node: Json, paths: string[]): string[] {
  return paths.filter((p) => !has(node, p.split(".")));
}

function has(value: unknown, segments: string[]): boolean {
  if (segments.length === 0) {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
  if (Array.isArray(value)) return value.length > 0 && value.every((v) => has(v, segments));
  if (!isObject(value)) return false;
  const [head, ...rest] = segments;
  return has(value[head!], rest);
}

const asArray = (v: unknown): unknown[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function evaluateFeatures(visit: Visit, issues: Issue[]): FeatureResult[] {
  const { node, path, types, parentTypes, property } = visit;
  const results: FeatureResult[] = [];
  const google = (
    severity: Severity,
    code: string,
    message: string,
    rule: GoogleFeatureRule,
    at = path,
  ) =>
    issues.push({
      layer: "google",
      severity,
      code,
      message,
      path: at,
      type: types[0],
      feature: rule.id,
      source: rule.source,
    });

  for (const rule of GOOGLE_FEATURES) {
    if (!types.some((t) => rule.types.includes(t))) continue;
    // Ratings are evaluated only when attached to something.
    if (rule.id === "review-snippet" && !property) continue;
    if (rule.id === "merchant-listing" && node.offers === undefined) continue;

    const result: FeatureResult = {
      feature: rule.id,
      name: rule.name,
      path,
      type: types[0]!,
      status: "eligible",
      missingRequired: missing(node, rule.required),
      missingRecommended: missing(node, rule.recommended),
      source: rule.source,
      checkedAt: rule.checkedAt,
      confidence: rule.confidence,
      ...(rule.note ? { note: rule.note } : {}),
    };
    for (const group of rule.requiredOneOf ?? []) {
      if (!group.some((p) => has(node, p.split("."))))
        result.missingRequired.push(group.join(" | "));
    }

    if (rule.status === "retired") {
      result.status = "retired";
      google(
        "info",
        "retired-feature",
        `${rule.name} rich results are no longer shown in Google Search. ${rule.note ?? ""}`.trim(),
        rule,
      );
      results.push(result);
      continue;
    }

    switch (rule.id) {
      case "breadcrumb": {
        const items = asArray(node.itemListElement).filter(isObject);
        if (items.length < 2) result.missingRequired.push("itemListElement (at least 2 items)");
        items.forEach((item, i) => {
          if (Number(item.position) !== i + 1)
            google(
              "warning",
              "breadcrumb-position",
              `ListItem ${i + 1} should have position ${i + 1}.`,
              rule,
              `${path}.itemListElement[${i}]`,
            );
          if (i < items.length - 1 && !item.item)
            result.missingRequired.push(`itemListElement[${i}].item`);
        });
        break;
      }
      case "event": {
        for (const loc of asArray(node.location).filter(isObject)) {
          const lt = typesOf(loc);
          if (lt.includes("VirtualLocation")) {
            if (!loc.url) result.missingRequired.push("location.url (VirtualLocation)");
          } else {
            if (!loc.name) result.missingRequired.push("location.name");
            if (!loc.address) result.missingRequired.push("location.address");
          }
        }
        break;
      }
      case "merchant-listing": {
        if (asArray(node.offers).some((o) => isObject(o) && typesOf(o).includes("AggregateOffer")))
          result.missingRequired.push("offers (an Offer, not AggregateOffer)");
        break;
      }
      case "review-snippet": {
        if (types.includes("AggregateRating")) {
          if (node.ratingValue === undefined) result.missingRequired.push("ratingValue");
          if (node.reviewCount === undefined && node.ratingCount === undefined)
            result.missingRequired.push("reviewCount | ratingCount");
        } else {
          if (!has(node, ["author", "name"])) result.missingRequired.push("author.name");
          if (!has(node, ["reviewRating", "ratingValue"]))
            result.missingRequired.push("reviewRating.ratingValue");
        }
        if (
          parentTypes.some(
            (t) => ORGANIZATION_TYPES.includes(t) || LOCAL_BUSINESS_TYPES.includes(t),
          )
        ) {
          result.status = "policy-blocked";
          google(
            "warning",
            "self-serving-review",
            "Google does not show review stars for reviews of a business or organization on its own site. Keep this only if the reviews are about another business and collected on your site.",
            rule,
          );
        }
        break;
      }
      case "job-posting": {
        for (const loc of asArray(node.jobLocation).filter(isObject))
          if (!has(loc, ["address", "addressCountry"]))
            result.missingRequired.push("jobLocation.address.addressCountry");
        if (node.jobLocationType === "TELECOMMUTE" && !node.applicantLocationRequirements)
          result.missingRequired.push("applicantLocationRequirements (remote job)");
        break;
      }
      case "local-business": {
        if (!node.address)
          google(
            "warning",
            "missing-address",
            "Add the full address: Google uses it to place the business.",
            rule,
          );
        break;
      }
    }

    result.missingRequired = [...new Set(result.missingRequired)];
    if (result.status === "eligible" && result.missingRequired.length)
      result.status = "missing-required";
    for (const p of result.missingRequired)
      google(
        "error",
        "missing-required",
        `${rule.name}: required property "${p}" is missing.`,
        rule,
      );
    for (const p of result.missingRecommended)
      google(
        "info",
        "missing-recommended",
        `${rule.name}: recommended property "${p}" is missing.`,
        rule,
      );
    results.push(result);
  }

  if (!property && types.some((t) => NO_GOOGLE_FEATURE_TYPES.includes(t)) && results.length === 0) {
    issues.push({
      layer: "google",
      severity: "info",
      code: "no-rich-result",
      message: `${types[0]} is valid schema.org but has no Google rich result of its own.`,
      path,
      type: types[0],
    });
  }
  return results;
}
