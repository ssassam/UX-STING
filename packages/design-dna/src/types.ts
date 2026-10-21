/**
 * Design DNA — a framework-independent, editable description of a design
 * identity. It records measurable decisions (sizes, colors, geometry,
 * composition), not labels like "modern", and every value carries its
 * provenance so people and agents can tell what was measured, what was
 * inferred and what was chosen.
 */

/** Where a value came from. */
export type ProvenanceSource =
  /** Read directly from a rendered page (computed style, geometry). */
  | "observed"
  /** Derived from observations (a ratio, a role, a dominant value). */
  | "inferred"
  /** Chosen from a written brief by the planner. */
  | "brief"
  /** Taken from another DNA during a remix. */
  | "remix"
  /** Fallback when nothing better was available. */
  | "default"
  /** Changed by a person or by the improvement loop. */
  | "edited";

export interface Provenance {
  source: ProvenanceSource;
  /** 0–1. Observed values are usually ≥ 0.9; inferred ones lower. */
  confidence: number;
  /** Short human-readable evidence, e.g. "h1 computed font-size at 1280px". */
  evidence?: string;
}

/** Hex color, `#rrggbb`. */
export type Hex = string;

export interface FontSpec {
  /** CSS font-family list as observed or chosen. */
  family: string;
  /** Generic classification, used when the exact font is unavailable. */
  classification: "sans" | "serif" | "mono" | "display";
  weight: number;
}

export type SectionRole =
  | "navigation"
  | "hero"
  | "intro"
  | "features"
  | "list"
  | "gallery"
  | "stats"
  | "testimonials"
  | "pricing"
  | "menu"
  | "schedule"
  | "faq"
  | "cta"
  | "contact"
  | "content"
  | "footer";

export type Composition =
  /** One column, content stacked. */
  | "stack"
  /** Text and media side by side, roughly equal. */
  | "split"
  /** Uneven columns (e.g. 7/5) or offset content. */
  | "asymmetric"
  /** Repeated items in a grid. */
  | "grid"
  /** Numbered or ruled rows, editorial index. */
  | "index"
  /** Edge-to-edge media or color field. */
  | "full-bleed"
  /** Centered, narrow measure. */
  | "centered";

export interface SectionSpec {
  id: string;
  role: SectionRole;
  composition: Composition;
  /** Column count at desktop width. */
  columns: number;
  /** Background treatment of the band. */
  surface: "background" | "surface" | "inverse" | "accent" | "media";
  /** Measured height at the reference desktop viewport, in px. */
  heightPx?: number;
  /** Items repeated inside the section (cards, rows, logos). */
  itemCount?: number;
  /** Has a media element (image, video, map). */
  media?: boolean;
  /** Vertical padding override in px (set by the improvement loop or by hand). */
  paddingBlock?: number;
}

export interface ColorSystem {
  scheme: "light" | "dark";
  background: Hex;
  surface: Hex;
  foreground: Hex;
  muted: Hex;
  border: Hex;
  accent: Hex;
  accentForeground: Hex;
  /** Heading color, when headings differ from body text. */
  heading?: Hex;
  /** Optional color used for inverse (dark-on-light flipped) bands. */
  inverse?: Hex;
}

export interface TypeScale {
  /** Body size in px. */
  base: number;
  /** Average ratio between consecutive steps. */
  ratio: number;
  /** px sizes by step. */
  steps: { small: number; body: number; h3: number; h2: number; h1: number; display: number };
  /** Display size at phone widths in px. Defaults to 55% of `display`. */
  mobileDisplay?: number;
}

export interface Typography {
  display: FontSpec;
  body: FontSpec;
  mono?: FontSpec;
  scale: TypeScale;
  /** Letter-spacing of headings in em (negative = tighter). */
  headingTracking: number;
  /** Line-height of headings (unitless). */
  headingLeading: number;
  /** Line-height of body text (unitless). */
  bodyLeading: number;
  /** Labels/eyebrows set in uppercase. */
  uppercaseLabels: boolean;
  /** Maximum body measure in characters. */
  measure: number;
}

export interface Layout {
  /** Max content width in px. */
  container: number;
  /** Minimum inline padding between the viewport edge and content, in px. */
  pagePadding: number;
  columns: number;
  gutter: number;
  /** Vertical gap between sections in px. */
  sectionGap: number;
  /** Base spacing unit in px (4 or 8 usually). */
  spacingUnit: number;
  alignment: "centered" | "start" | "asymmetric";
  sections: SectionSpec[];
}

export interface Shape {
  /** Typical corner radius of cards and controls in px. */
  radius: number;
  /** Radius of buttons in px (9999 = pill). */
  controlRadius: number;
  borderWidth: number;
  shadow: "none" | "soft" | "hard";
}

export interface Imagery {
  treatment: "none" | "framed" | "full-bleed" | "mixed";
  /** Dominant aspect ratio of content images (width / height). */
  aspect?: number;
}

export interface Motion {
  level: "none" | "subtle" | "expressive";
  /** Typical transition duration in ms. */
  durationMs: number;
}

export interface Navigation {
  pattern: "top-bar" | "split" | "minimal" | "sidebar";
  sticky: boolean;
  /** Visible top-level links at desktop width. */
  itemCount: number;
}

export interface Personality {
  /** Descriptive words, derived from measurements (never the input). */
  keywords: string[];
  density: "airy" | "balanced" | "dense";
  contrast: "soft" | "medium" | "high";
}

export interface SourceRef {
  kind: "url" | "screenshot" | "brief" | "dna";
  ref: string;
  /** The user confirmed they own or may reproduce this reference. */
  authorized?: boolean;
  capturedAt?: string;
}

export interface DesignDNA {
  version: 1;
  name: string;
  mode: "reconstruct" | "original" | "remix";
  sources: SourceRef[];
  personality: Personality;
  color: ColorSystem;
  typography: Typography;
  layout: Layout;
  shape: Shape;
  imagery: Imagery;
  motion: Motion;
  navigation: Navigation;
  /** Provenance by dot path, e.g. `"color.accent"`, `"typography.scale"`. */
  provenance: Record<string, Provenance>;
}

/** Text content to place into a generated page. */
export interface PageContent {
  lang: string;
  dir?: "ltr" | "rtl";
  title: string;
  description: string;
  siteName: string;
  nav: Array<{ label: string; href: string }>;
  sections: SectionContent[];
  footer?: string;
}

export interface SectionContent {
  /** Matches a `SectionSpec.id`; unmatched sections use the next spec by role. */
  id: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  items?: Array<{ title: string; text?: string; meta?: string }>;
  action?: { label: string; href: string };
  /** Decorative media is rendered as a token-colored block, never a fetched image. */
  media?: { alt: string };
}
