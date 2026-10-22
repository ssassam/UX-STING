/** Viewport widths QA renders at by default: phone, tablet, desktop. */
export const DEFAULT_VIEWPORTS = [375, 768, 1440] as const;

export type Severity = "critical" | "serious" | "moderate" | "minor";
export type Category = "a11y" | "contrast" | "layout" | "console" | "performance" | "taste";

/** A short CSS path to an element, e.g. `main > section.pricing`. */
export type Target = string;

/** Raw, in-page layout measurements at one viewport (see `collectLayout`). */
export interface LayoutMeasurement {
  width: number;
  height: number;
  documentHeight: number;
  overflow: { px: number; offenders: Target[] };
  /** The first-screen title (h1, else the first h2), or null when the page has none. */
  title: { text: string; top: number; bottom: number; visible: boolean; tag: string } | null;
  sections: Array<{
    target: Target;
    top: number;
    height: number;
    /** Gap between the viewport edges and the union of the section's content, in px. */
    marginStart: number;
    marginEnd: number;
    textChars: number;
    childCount: number;
    hasMedia: boolean;
    hasControls: boolean;
    /** Navigation landmark (short by nature, never an orphan). */
    isNav?: boolean;
  }>;
  /** Grids whose last row holds a single item while full rows hold ≥ 3. */
  orphanItems: Array<{ target: Target; perRow: number; lastRow: number }>;
  /** Vertical bands with no visible text, media or control, in px from the top. */
  emptyStretches: Array<{ top: number; height: number }>;
  contrast: {
    checked: number;
    /** Text whose background could not be determined (images, gradients). */
    skipped: number;
    failing: Array<{
      target: Target;
      ratio: number;
      required: number;
      text: string;
      /** "pixels": measured on the rendered image behind the text (photos, gradients). */
      method?: "pixels";
    }>;
    /**
     * Text over images or gradients, measured afterwards on real pixels
     * (internal hand-off from the in-page collector; removed from reports).
     */
    pixelCandidates?: PixelCandidate[];
  };
}

/** Text whose background is an image or gradient; contrast is measured on screenshot pixels. */
export interface PixelCandidate {
  id: number;
  target: Target;
  text: string;
  required: number;
  /** Text color, sRGB 0–255 and alpha 0–1. */
  color: [number, number, number, number];
  /** Document coordinates of the text box. */
  rect: { x: number; y: number; width: number; height: number };
}

/** Anti-slop signals: generic AI-page patterns (see the ux-sting-taste skill). */
export interface TasteMeasurement {
  /** Gradients with a violet/purple stop. */
  purpleGradients: Target[];
  /** Gradient-filled text (background-clip: text). */
  gradientText: Target[];
  /** Emoji used as icons or bullets. */
  emojiIcons: Array<{ target: Target; text: string }>;
  /** Stock marketing phrases found in visible text. */
  genericCopy: string[];
  /** Round, unsourced numbers ("10,000+ users", "99.9%", "10x"). */
  fakeStats: string[];
  lorem: boolean;
  /** Elements with backdrop-filter blur. */
  glass: number;
  /** Container of three equal cards right below a centered hero, or null. */
  centeredHeroCards: Target | null;
  /** Numeric table cells, and how many are not end-aligned / not tabular figures. */
  numbers: { cells: number; misaligned: number; proportional: number };
}

export interface AxeViolation {
  id: string;
  impact: Severity | null;
  help: string;
  helpUrl: string;
  targets: Target[];
  count: number;
}

export interface Vitals {
  /** Largest Contentful Paint in ms, or null when the browser did not report one. */
  lcp: number | null;
  /** Cumulative Layout Shift (sum of shifts without recent input) during load. */
  cls: number | null;
}

/** Everything measured at one viewport. */
export interface ViewportResult {
  width: number;
  layout: LayoutMeasurement;
  axe: AxeViolation[];
  vitals: Vitals;
  /** Anti-slop signals; absent when taste checks are off. */
  taste?: TasteMeasurement;
  /** Paths relative to the report directory. */
  screenshots: { fold?: string; full?: string };
}

export interface Finding {
  /** Stable rule id, e.g. `overflow-x`, `axe:image-alt`, `lcp`. */
  id: string;
  category: Category;
  severity: Severity;
  message: string;
  /** One concrete action that fixes it. */
  fix: string;
  viewports: number[];
  targets: Target[];
  /** Affected nodes or occurrences. */
  count: number;
  helpUrl?: string;
}

export interface QaReport {
  target: string;
  url: string;
  createdAt: string;
  viewports: ViewportResult[];
  console: { errors: string[]; failedRequests: string[] };
  findings: Finding[];
  /** The three most valuable fixes, best first. */
  top: Finding[];
  /** 0–100, 100 = nothing found. */
  score: number;
  /** True when no critical or serious finding remains. */
  passed: boolean;
}

export interface QaOptions {
  viewports?: number[];
  /** Directory for report.md, report.json and screenshots. Nothing is written when omitted. */
  outDir?: string;
  /** Extra `host:port` entries allowed besides the target's own host. */
  allowHosts?: string[];
  /** Chromium executable; defaults to `CHROMIUM_PATH` or Playwright's managed browser. */
  executablePath?: string;
  /** Skip screenshots (faster, for CI). */
  screenshots?: boolean;
  /** Run anti-slop (taste) checks. Default true. */
  taste?: boolean;
  /** Milliseconds to wait after load for late content and animations. */
  settleMs?: number;
}
