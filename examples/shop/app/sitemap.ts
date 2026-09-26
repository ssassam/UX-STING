import type { MetadataRoute } from "next";
import { products } from "../lib/data";
import { absolute } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-26");
  return [
    { url: absolute(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absolute("shop"), lastModified: now, priority: 0.9 },
    { url: absolute("credits"), lastModified: now, priority: 0.3 },
    ...products.map((p) => ({
      url: absolute(`product/${p.id}`),
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
