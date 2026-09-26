export type Category =
  | "foundations"
  | "typography"
  | "buttons"
  | "forms"
  | "date-time"
  | "navigation"
  | "overlays"
  | "feedback"
  | "data-display"
  | "media"
  | "command"
  | "patterns"
  | "theming";

export interface ComponentMeta {
  /** Folder name and CLI name, e.g. "dropdown-menu". */
  name: string;
  title: string;
  category: Category;
  description: string;
  /** When to use it. */
  when: string;
  /** When to use something else, and what. */
  avoid?: string;
  /** Accessibility behavior and responsibilities. */
  a11y: string[];
  /** Keyboard interactions: [keys, action]. */
  keyboard?: Array<[string, string]>;
  /** Primary exported component (for API docs); defaults to the title without spaces. */
  primary?: string;
  /** Related components (names). */
  related?: string[];
  /** Mentions of responsive / mobile behavior. */
  responsive?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  foundations: "Foundations",
  typography: "Typography",
  buttons: "Buttons",
  forms: "Forms",
  "date-time": "Date & time",
  navigation: "Navigation",
  overlays: "Overlays",
  feedback: "Feedback",
  "data-display": "Data display",
  media: "Media",
  command: "Command & search",
  patterns: "Patterns",
  theming: "Theming",
};
