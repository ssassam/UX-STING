/**
 * Image search across open collections, normalised to one shape and
 * filtered to licenses a website may use without asking: public domain,
 * CC0, CC BY and CC BY-SA. Anything NonCommercial, NoDerivatives, GFDL-only,
 * fair-use or unknown is dropped — never "probably fine".
 */

export type LicenseCode = "cc0" | "pdm" | "by" | "by-sa";
export type SourceName = "openverse" | "commons" | "met";

export interface ImageResult {
  id: string;
  source: SourceName;
  title: string;
  creator: string | null;
  license: LicenseCode;
  /** e.g. "4.0"; null for public domain. */
  licenseVersion: string | null;
  licenseUrl: string | null;
  /** Page that documents the image and its license. */
  landingUrl: string;
  /** Direct image URL (a large rendition when the source offers one). */
  url: string;
  width: number | null;
  height: number | null;
}

export const ALL_LICENSES: LicenseCode[] = ["cc0", "pdm", "by", "by-sa"];
export const USER_AGENT = "ux-sting-images/0.1 (+https://github.com/ssassam/UX-STING)";

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Normalises license labels from any source; null when not allowed or unknown. */
export function normalizeLicense(
  raw: string | undefined | null,
): { code: LicenseCode; version: string | null } | null {
  if (!raw) return null;
  const s = raw.toLowerCase().replace(/[_\s]+/g, "-");
  if (/(^|-)(nc|nd|arr)(-|$)|noncommercial|noderiv|gfdl|fair-use|copyright|all-rights/.test(s))
    return null;
  if (/^(cc0|cc-zero)/.test(s)) return { code: "cc0", version: null };
  if (/^(pd|pdm|public-domain|publicdomain)/.test(s)) return { code: "pdm", version: null };
  const v = /(\d\.\d)/.exec(s)?.[1] ?? null;
  if (/^(cc-)?by-sa\b/.test(s)) return { code: "by-sa", version: v };
  if (/^(cc-)?by\b/.test(s)) return { code: "by", version: v };
  return null;
}

const LICENSE_URL: Record<LicenseCode, (v: string | null) => string> = {
  cc0: () => "https://creativecommons.org/publicdomain/zero/1.0/",
  pdm: () => "https://creativecommons.org/publicdomain/mark/1.0/",
  by: (v) => `https://creativecommons.org/licenses/by/${v ?? "4.0"}/`,
  "by-sa": (v) => `https://creativecommons.org/licenses/by-sa/${v ?? "4.0"}/`,
};

// ── Openverse (api.openverse.org) ───────────────────────────────────────────

interface OpenverseResponse {
  results?: Array<{
    id: string;
    title?: string | null;
    url: string;
    creator?: string | null;
    license: string;
    license_version?: string | null;
    license_url?: string | null;
    foreign_landing_url?: string | null;
    width?: number | null;
    height?: number | null;
  }>;
}

export function fromOpenverse(json: OpenverseResponse): ImageResult[] {
  return (json.results ?? []).flatMap((r) => {
    const lic = normalizeLicense(
      r.license === "by-sa" || r.license === "by"
        ? `${r.license}-${r.license_version ?? ""}`
        : r.license,
    );
    if (!lic || !r.url) return [];
    return [
      {
        id: `openverse:${r.id}`,
        source: "openverse" as const,
        title: r.title?.trim() || "Untitled",
        creator: r.creator?.trim() || null,
        license: lic.code,
        licenseVersion: r.license_version ?? lic.version,
        licenseUrl: r.license_url ?? LICENSE_URL[lic.code](r.license_version ?? lic.version),
        landingUrl: r.foreign_landing_url ?? r.url,
        url: r.url,
        width: r.width ?? null,
        height: r.height ?? null,
      },
    ];
  });
}

export function openverseUrl(query: string, licenses: LicenseCode[], count: number) {
  const u = new URL("https://api.openverse.org/v1/images/");
  u.searchParams.set("q", query);
  u.searchParams.set("license", licenses.join(","));
  u.searchParams.set("page_size", String(Math.min(count * 2, 40)));
  u.searchParams.set("mature", "false");
  return u.toString();
}

// ── Wikimedia Commons (MediaWiki API) ───────────────────────────────────────

interface CommonsResponse {
  query?: {
    pages?: Record<
      string,
      {
        title: string;
        index?: number;
        imageinfo?: Array<{
          url: string;
          thumburl?: string;
          descriptionurl: string;
          width: number;
          height: number;
          thumbwidth?: number;
          thumbheight?: number;
          mime?: string;
          extmetadata?: Record<string, { value: string } | undefined>;
        }>;
      }
    >;
  };
}

export function fromCommons(json: CommonsResponse): ImageResult[] {
  const pages = Object.values(json.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0),
  );
  return pages.flatMap((p) => {
    const ii = p.imageinfo?.[0];
    if (!ii || !/^image\/(jpeg|png|webp|gif|svg)/.test(ii.mime ?? "image/jpeg")) return [];
    const m = ii.extmetadata ?? {};
    const lic = normalizeLicense(m.License?.value ?? m.LicenseShortName?.value);
    if (!lic) return [];
    const artist = stripHtml(m.Artist?.value ?? "");
    const title =
      stripHtml(m.ObjectName?.value ?? "") ||
      p.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "");
    return [
      {
        id: `commons:${p.title}`,
        source: "commons" as const,
        title,
        creator: artist || null,
        license: lic.code,
        licenseVersion: lic.version,
        licenseUrl: m.LicenseUrl?.value || LICENSE_URL[lic.code](lic.version),
        landingUrl: ii.descriptionurl,
        url: ii.thumburl ?? ii.url,
        width: ii.thumbwidth ?? ii.width,
        height: ii.thumbheight ?? ii.height,
      },
    ];
  });
}

export function commonsUrl(query: string, count: number, width = 1600) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  for (const [k, v] of Object.entries({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: String(Math.min(count * 3, 50)),
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: String(width),
    format: "json",
    origin: "*",
  }))
    u.searchParams.set(k, v);
  return u.toString();
}

// ── The Met Open Access (collectionapi.metmuseum.org) ──────────────────────

export interface MetObject {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall?: string;
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  objectURL?: string;
}

/** Only public-domain objects with an image; The Met releases those as CC0. */
export function fromMet(objects: MetObject[]): ImageResult[] {
  return objects.flatMap((o) =>
    o.isPublicDomain && o.primaryImage
      ? [
          {
            id: `met:${o.objectID}`,
            source: "met" as const,
            title: [o.title?.trim() || "Untitled", o.objectDate].filter(Boolean).join(", "),
            creator: o.artistDisplayName?.trim() || null,
            license: "cc0" as const,
            licenseVersion: null,
            licenseUrl: LICENSE_URL.cc0(null),
            landingUrl:
              o.objectURL ?? `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
            url: o.primaryImage,
            width: null,
            height: null,
          },
        ]
      : [],
  );
}

const MET = "https://collectionapi.metmuseum.org/public/collection";
/** v1/search was retired on 2026-10-01; v1.1 is paginated. */
export const metSearchUrl = (query: string, limit: number) =>
  `${MET}/v1.1/search?hasImages=true&q=${encodeURIComponent(query)}&limit=${limit}`;
export const metObjectUrl = (id: number) => `${MET}/v1/objects/${id}`;

// ── Network ────────────────────────────────────────────────────────────────

export interface SearchOptions {
  sources?: SourceName[];
  licenses?: LicenseCode[];
  count?: number;
  /** Per-request timeout, ms. */
  timeoutMs?: number;
  fetch?: typeof fetch;
}

async function getJson<T>(url: string, f: typeof fetch, timeoutMs: number): Promise<T> {
  const res = await f(url, {
    headers: { "user-agent": USER_AGENT, accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Searches the chosen sources (default: all three) and returns up to
 * `count` allowed images per source, best matches first. A source that
 * fails is reported in `errors`, not thrown.
 */
export async function searchImages(
  query: string,
  options: SearchOptions = {},
): Promise<{ results: ImageResult[]; errors: string[] }> {
  const f = options.fetch ?? fetch;
  const count = options.count ?? 6;
  const licenses = options.licenses?.length ? options.licenses : ALL_LICENSES;
  const timeout = options.timeoutMs ?? 20_000;
  const allowed = (r: ImageResult) => licenses.includes(r.license);
  const tasks: Record<SourceName, () => Promise<ImageResult[]>> = {
    openverse: async () =>
      fromOpenverse(await getJson(openverseUrl(query, licenses, count), f, timeout)),
    commons: async () => fromCommons(await getJson(commonsUrl(query, count), f, timeout)),
    met: async () => {
      if (!licenses.includes("cc0")) return [];
      const { objectIDs } = await getJson<{ objectIDs: number[] | null }>(
        metSearchUrl(query, count * 4),
        f,
        timeout,
      );
      const objects: MetObject[] = [];
      for (const id of (objectIDs ?? []).slice(0, count * 4)) {
        if (objects.filter((o) => o.isPublicDomain && o.primaryImage).length >= count) break;
        objects.push(
          await getJson<MetObject>(metObjectUrl(id), f, timeout).catch(() => ({
            objectID: id,
            isPublicDomain: false,
            primaryImage: "",
          })),
        );
      }
      return fromMet(objects);
    },
  };
  const sources = options.sources?.length ? options.sources : (Object.keys(tasks) as SourceName[]);
  const settled = await Promise.allSettled(sources.map((s) => tasks[s]()));
  const results: ImageResult[] = [];
  const errors: string[] = [];
  settled.forEach((s, i) => {
    if (s.status === "fulfilled") results.push(...s.value.filter(allowed).slice(0, count));
    else
      errors.push(
        `${sources[i]}: ${s.reason instanceof Error ? s.reason.message : String(s.reason)}`,
      );
  });
  return { results, errors };
}
