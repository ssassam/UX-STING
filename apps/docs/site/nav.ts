import { components } from "../../../registry/components.ts";
import { CATEGORY_LABELS, type Category } from "../../../registry/types.ts";

export const guides = [
  { slug: "introduction", title: "Introduction" },
  { slug: "installation", title: "Installation" },
  { slug: "nextjs", title: "Next.js & RSC" },
  { slug: "theming", title: "Theming" },
  { slug: "tokens", title: "Design tokens" },
  { slug: "dark-mode", title: "Dark mode" },
  { slug: "density", title: "Density" },
  { slug: "accessibility", title: "Accessibility" },
  { slug: "ux-quality", title: "UX quality rules" },
  { slug: "internationalization", title: "RTL & i18n" },
  { slug: "responsive", title: "Responsive design" },
  { slug: "cli", title: "CLI" },
  { slug: "api-consistency", title: "API conventions" },
  { slug: "patterns", title: "Patterns" },
  { slug: "recipes", title: "Recipes" },
  { slug: "forms", title: "Forms & validation" },
  { slug: "performance", title: "Performance" },
  { slug: "migration", title: "Migration" },
  { slug: "contributing", title: "Contributing" },
] as const;

export const categoryOrder: Category[] = [
  "foundations",
  "typography",
  "buttons",
  "forms",
  "date-time",
  "navigation",
  "overlays",
  "feedback",
  "data-display",
  "media",
  "command",
  "patterns",
  "theming",
];

export function componentsByCategory() {
  return categoryOrder.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: components.filter((c) => c.category === category).sort((a, b) => a.title.localeCompare(b.title)),
  }));
}

export { components, CATEGORY_LABELS };
