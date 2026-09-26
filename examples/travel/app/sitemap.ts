import type { MetadataRoute } from "next";
import { destinations, stays, tours } from "../lib/data";
import { absolute } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-26");
  return [
    { url: absolute(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["destinations", "search", "tours", "credits"].map((p) => ({
      url: absolute(p),
      lastModified: now,
      priority: 0.8,
    })),
    ...destinations.map((d) => ({
      url: absolute(`destinations/${d.slug}`),
      lastModified: now,
      priority: 0.7,
    })),
    ...stays.map((s) => ({ url: absolute(`stays/${s.id}`), lastModified: now, priority: 0.6 })),
    ...tours.map((t) => ({ url: absolute(`tours/${t.id}`), lastModified: now, priority: 0.6 })),
  ];
}
