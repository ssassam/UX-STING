import type { Metadata } from "next";

/**
 * SEO helpers. The live site is served from GitHub Pages under a base path
 * (set by PAGES_BASE_PATH at build time and exposed as NEXT_PUBLIC_BASE_PATH).
 */
export const SITE_ORIGIN = "https://ssassam.github.io";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL of this demo's home page, always with a trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}/`;

/** Relative canonical path (resolved against metadataBase = SITE_URL). */
export const canonical = (path = "") => {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `${clean}/` : "./";
};

/** Absolute URL for sitemaps and structured data. */
export const absolute = (path = "") => new URL(canonical(path), SITE_URL).toString();

/** Serialises schema.org data for a <script type="application/ld+json">. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export const SITE_NAME = "Wayfare";
const DEFAULT_IMAGE = {
  url: "og.jpg",
  width: 1200,
  height: 630,
  alt: "Wayfare travel homepage: beach hero, destination search and featured stays",
};

/**
 * Per-page metadata: canonical URL, Open Graph and Twitter card. Set it on
 * every page (never on the layout, or all pages would share one canonical).
 */
export function pageMeta({
  title,
  description,
  path = "",
  image,
  noindex = false,
}: {
  title?: string;
  description: string;
  path?: string;
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const images = [image ?? DEFAULT_IMAGE];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: canonical(path),
      title: title ?? SITE_NAME,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: title ?? SITE_NAME, description, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
