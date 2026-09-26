import type { MetadataRoute } from "next";
import { absolute } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolute(),
      lastModified: new Date("2026-09-26"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
