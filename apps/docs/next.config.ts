import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  output: process.env.DOCS_EXPORT ? "export" : undefined,
  images: { unoptimized: true },
};

export default config;
