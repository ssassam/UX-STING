import type { MetadataRoute } from "next";
import { coins } from "../lib/market";
import { absolute } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-26");
  return [
    { url: absolute(), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absolute("news"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absolute("credits"), lastModified: now, priority: 0.3 },
    ...coins.map((c) => ({ url: absolute(`coin/${c.id}`), lastModified: now, priority: 0.6 })),
  ];
}
