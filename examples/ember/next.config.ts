import type { NextConfig } from "next";

/**
 * Set PAGES_BASE_PATH (e.g. "/UX-STING") to produce a static export for
 * GitHub Pages; otherwise the app runs as a normal Next.js server.
 */
const basePath = process.env.PAGES_BASE_PATH;

const config: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(basePath !== undefined
    ? {
        output: "export",
        basePath: basePath || undefined,
        trailingSlash: true,
        env: { NEXT_PUBLIC_BASE_PATH: basePath },
      }
    : {}),
};

export default config;
