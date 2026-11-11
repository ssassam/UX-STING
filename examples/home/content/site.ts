/** Facts shown on the page. Every number comes from the repo README (keep them in sync on release). */
export const NPM_VERSION = "0.13.0";
export const GITHUB_URL = "https://github.com/ssassam/UX-STING";
export const NPM_URL = "https://www.npmjs.com/package/ux-sting";
export const INSTALL_CMD = "npx ux-sting skills add";

export const measures = [
  { value: 115, label: "components", note: "forms, data grid, overlays, commerce, motion" },
  { value: 17, label: "theme presets", note: "Material, Fluent, Carbon, Polaris, Apple…" },
  { value: 24, label: "AI coding hosts", note: "one install command" },
  { value: 192, label: "industry rules", note: "with anti-patterns" },
  { value: 80, label: "UI styles", note: "searchable offline" },
  { value: 192, label: "palettes", note: "contrast-checked" },
  { value: 74, label: "font pairings", note: "display + body" },
  { value: 22, label: "stack guides", note: "React to SwiftUI" },
] as const;

export const hosts = [
  "Claude Code",
  "Codex",
  "Cursor",
  "Windsurf",
  "Copilot",
  "Gemini",
  "Antigravity",
  "Qoder",
  "Kiro",
  "Roo Code",
  "KiloCode",
  "Cline",
  "Continue",
  "OpenCode",
  "Trae",
  "Augment",
  "CodeBuddy",
  "Warp",
  "Droid",
  "Amazon Q",
  "Kimi",
  "ZCode",
  "CodeWhale",
  "OpenClaw",
] as const;

export const SITE = "https://uxsting.veltein.com";

/** The live demo sites (all built with UX-STING and deployed with this page). */
export const demos = [
  {
    id: "travel",
    name: "Wayfare",
    kind: "Travel booking",
    href: `${SITE}/travel/`,
    image: "templates/travel.webp",
    body: "Destinations, stays, tours and a trip planner with search filters and a booking flow.",
  },
  {
    id: "cars",
    name: "Drivo",
    kind: "Car rental",
    href: `${SITE}/cars/`,
    image: "templates/car-rental.webp",
    body: "Fleet search, date and location pickers, extras and a checkout summary.",
  },
  {
    id: "shop",
    name: "Maison Nord",
    kind: "E-commerce",
    href: `${SITE}/shop/`,
    image: "templates/shop.webp",
    body: "Catalog with filters, product gallery, cart drawer and checkout fields.",
  },
  {
    id: "watch",
    name: "Pulse One",
    kind: "Product launch",
    href: `${SITE}/watch/`,
    image: "templates/watch.webp",
    body: "Launch page with a finish picker, specs table, reviews and a pre-order configurator.",
  },
  {
    id: "crypto",
    name: "Chainlens",
    kind: "Analytics",
    href: `${SITE}/crypto/`,
    image: "templates/crypto.webp",
    body: "Markets table, candlestick and area charts, portfolio and a watchlist.",
  },
  {
    id: "ember",
    name: "Ember",
    kind: "Restaurant",
    href: `${SITE}/ember/`,
    image: "templates/ember.webp",
    body: "Menu, opening hours, location and a table reservation flow.",
  },
] as const;
