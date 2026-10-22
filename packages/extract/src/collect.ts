/** Raw measurements of a live page. Every number was read from the browser. */
export interface RawExtraction {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  capturedAt: string;
  /** Opaque page background (`#rrggbb`). */
  pageBackground: string;
  /** Background colors weighted by painted area (px², capped per element). */
  backgrounds: Array<{ color: string; area: number }>;
  /** Text colors weighted by visible characters. */
  textColors: Array<{ color: string; chars: number }>;
  borderColors: Array<{ color: string; count: number }>;
  /** Colors on buttons and links: background (`fill`) or text (`text`). */
  interactive: Array<{ color: string; on: string; kind: "fill" | "text"; count: number }>;
  fonts: Array<{ stack: string; chars: number; heading: number }>;
  /** Font sizes weighted by characters, with the dominant role. */
  fontSizes: Array<{ px: number; chars: number; role: "heading" | "body" | "small" }>;
  headings: Partial<Record<"h1" | "h2" | "h3", TextStyle>>;
  body: TextStyle | null;
  spacing: Array<{ px: number; count: number }>;
  radii: Array<{ px: number; count: number }>;
  shadows: Array<{ value: string; count: number }>;
  motion: {
    transitions: Array<{ durationMs: number; easing: string; count: number }>;
    animations: Array<{ durationMs: number; easing: string; count: number }>;
    /** Animations running or retained, as reported by document.getAnimations(). */
    live: number;
  };
  breakpoints: { minWidth: number[]; maxWidth: number[]; unreadableSheets: number };
  /** Most common width of centered containers, px; null when none found. */
  container: number | null;
}

export interface TextStyle {
  family: string;
  sizePx: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
  color: string;
}

/**
 * In-page extractor for Playwright's `page.evaluate`. Self-contained (no
 * imports or outer variables). Reads computed styles, geometry, CSSOM media
 * rules and `document.getAnimations()`; never the page's source code.
 */
export function collectDesign(): Omit<RawExtraction, "url" | "capturedAt"> {
  const vw = document.documentElement.clientWidth;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const rgba = (color: string): [number, number, number, number] => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
  };
  const hex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const backdrop = (el: Element | null): [number, number, number] => {
    const layers: Array<[number, number, number, number]> = [];
    for (let e = el; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let out: [number, number, number] = [255, 255, 255];
    for (const [r, g, b, a] of layers.reverse())
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
    return out;
  };
  const opaque = (color: string, el: Element) => {
    const [r, g, b, a] = rgba(color);
    const [br, bg, bb] = backdrop(el.parentElement);
    return hex(r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a));
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
  };
  const tally = <K extends string | number>(map: Map<K, number>, key: K, by = 1) =>
    map.set(key, (map.get(key) ?? 0) + by);
  const px = (v: string) => parseFloat(v) || 0;

  const bgArea = new Map<string, number>();
  const text = new Map<string, number>();
  const borders = new Map<string, number>();
  const interactive = new Map<
    string,
    { color: string; on: string; kind: "fill" | "text"; count: number }
  >();
  const fonts = new Map<string, { chars: number; heading: number }>();
  const sizes = new Map<number, { chars: number; heading: number; small: number }>();
  const spacing = new Map<number, number>();
  const radii = new Map<number, number>();
  const shadows = new Map<string, number>();
  const transitions = new Map<string, number>();
  const animations = new Map<string, number>();
  const containers = new Map<number, number>();

  const all = Array.from(document.body.querySelectorAll("*")).filter(
    (el) => !["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "svg"].includes(el.tagName) && visible(el),
  );
  for (const el of all) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();

    const bg = rgba(s.backgroundColor);
    if (bg[3] > 0.05)
      tally(bgArea, opaque(s.backgroundColor, el), Math.min(r.width * r.height, vw * 1200));

    for (const side of ["Top", "Right", "Bottom", "Left"] as const) {
      const w = px(s.getPropertyValue(`border-${side.toLowerCase()}-width`));
      const style = s.getPropertyValue(`border-${side.toLowerCase()}-style`);
      if (w > 0 && style !== "none") {
        const c = s.getPropertyValue(`border-${side.toLowerCase()}-color`);
        if (rgba(c)[3] > 0.05) tally(borders, opaque(c, el));
      }
    }

    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    const isHeading = /^H[1-6]$/.test(el.tagName) || el.getAttribute("role") === "heading";
    if (ownText) {
      const chars = ownText.length;
      tally(text, opaque(s.color, el), chars);
      const f = fonts.get(s.fontFamily) ?? { chars: 0, heading: 0 };
      f.chars += chars;
      if (isHeading || el.closest("h1,h2,h3,h4,h5,h6")) f.heading += chars;
      fonts.set(s.fontFamily, f);
      const size = Math.round(px(s.fontSize) * 2) / 2;
      const z = sizes.get(size) ?? { chars: 0, heading: 0, small: 0 };
      z.chars += chars;
      if (isHeading || el.closest("h1,h2,h3,h4,h5,h6")) z.heading += chars;
      if (el.closest("small,figcaption,label,time") || size < 14) z.small += chars;
      sizes.set(size, z);
    }

    const control =
      el.matches("button,[role=button],input[type=submit],a[href]") &&
      !el.matches("nav a, footer a");
    if (control) {
      const looksButton = el.matches("button,[role=button],input[type=submit]") || bg[3] > 0.5;
      const fill = bg[3] > 0.5 ? opaque(s.backgroundColor, el) : null;
      const fg = opaque(s.color, el);
      const key = fill ? `fill:${fill}:${fg}` : `text:${fg}`;
      const entry = interactive.get(key) ?? {
        color: fill ?? fg,
        on: fill ? fg : hex(...backdrop(el)),
        kind: fill ? ("fill" as const) : ("text" as const),
        count: 0,
      };
      entry.count += looksButton ? 3 : 1;
      interactive.set(key, entry);
    }

    for (const prop of [
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "row-gap",
      "column-gap",
      "margin-top",
      "margin-bottom",
    ]) {
      const v = Math.round(px(s.getPropertyValue(prop)));
      if (v > 0 && v <= 256) tally(spacing, v);
    }
    const radius = Math.round(px(s.borderTopLeftRadius));
    if (radius > 0 && (bg[3] > 0.05 || px(s.borderTopWidth) > 0 || el.tagName === "IMG"))
      tally(radii, radius >= Math.min(r.width, r.height) / 2 - 1 ? 9999 : radius);
    if (s.boxShadow !== "none") tally(shadows, s.boxShadow);

    const durations = s.transitionDuration
      .split(",")
      .map((d) => px(d) * (d.trim().endsWith("ms") ? 1 : 1000));
    const easings = s.transitionTimingFunction.split(/,(?![^(]*\))/);
    durations.forEach((d, i) => {
      if (d > 0)
        tally(transitions, `${Math.round(d)}|${(easings[i] ?? easings[0] ?? "ease").trim()}`);
    });
    if (s.animationName !== "none") {
      const d = px(s.animationDuration) * (s.animationDuration.endsWith("ms") ? 1 : 1000);
      if (d > 0)
        tally(
          animations,
          `${Math.round(d)}|${s.animationTimingFunction.split(/,(?![^(]*\))/)[0]!.trim()}`,
        );
    }

    const ml = s.marginLeft;
    if (
      r.width < vw - 1 &&
      r.width > 320 &&
      ml !== "0px" &&
      ml === s.marginRight &&
      Math.abs(r.left - (vw - r.right)) < 2
    )
      tally(containers, Math.round(r.width));
  }

  let live = 0;
  for (const a of document.getAnimations?.() ?? []) {
    live++;
    // CSS animations and transitions were counted from computed styles above;
    // only script-driven (Web Animations API) ones are added here.
    if (a instanceof CSSAnimation || a instanceof CSSTransition) continue;
    const t = a.effect?.getTiming();
    const d = typeof t?.duration === "number" ? t.duration : 0;
    if (d > 0) tally(animations, `${Math.round(d)}|${t?.easing ?? "linear"}`);
  }

  const minWidth = new Set<number>();
  const maxWidth = new Set<number>();
  let unreadableSheets = 0;
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      const media = (rule as CSSMediaRule).media?.mediaText ?? (rule as CSSMediaRule).conditionText;
      if (media) {
        for (const m of media.matchAll(/(min|max)-width:\s*([\d.]+)(px|em|rem)/g)) {
          const v = parseFloat(m[2]!) * (m[3] === "px" ? 1 : 16);
          (m[1] === "min" ? minWidth : maxWidth).add(Math.round(v));
        }
        for (const m of media.matchAll(/width\s*(>=|>|<=|<)\s*([\d.]+)(px|em|rem)/g)) {
          const v = parseFloat(m[2]!) * (m[3] === "px" ? 1 : 16);
          (m[1]!.startsWith(">") ? minWidth : maxWidth).add(Math.round(v));
        }
      }
      if ((rule as CSSGroupingRule).cssRules) visit((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules);
    } catch {
      unreadableSheets++;
    }
  }

  const style = (el: Element | null): TextStyle | null => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const size = px(s.fontSize);
    return {
      family: s.fontFamily,
      sizePx: size,
      weight: Number(s.fontWeight) || 400,
      lineHeight:
        s.lineHeight === "normal" ? 1.2 : Math.round((px(s.lineHeight) / size) * 100) / 100,
      letterSpacingEm:
        s.letterSpacing === "normal" ? 0 : Math.round((px(s.letterSpacing) / size) * 1000) / 1000,
      color: opaque(s.color, el),
    };
  };
  const firstVisible = (sel: string) =>
    Array.from(document.querySelectorAll(sel)).find(visible) ?? null;
  const headings: RawExtraction["headings"] = {};
  for (const tag of ["h1", "h2", "h3"] as const) {
    const st = style(firstVisible(tag));
    if (st) headings[tag] = st;
  }
  // Body text: among real paragraphs, the font size carrying the most characters
  // (a large hero lead paragraph comes first in the DOM but is not body copy).
  const bySize = new Map<string, { el: Element; chars: number }>();
  for (const p of Array.from(document.querySelectorAll("p, li, dd"))) {
    const chars = (p.textContent ?? "").trim().length;
    if (chars < 40 || !visible(p)) continue;
    const key = getComputedStyle(p).fontSize;
    const entry = bySize.get(key) ?? { el: p, chars: 0 };
    entry.chars += chars;
    bySize.set(key, entry);
  }
  const bodyText = [...bySize.values()].sort((a, b) => b.chars - a.chars)[0]?.el ?? null;

  const sorted = <K>(m: Map<K, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  const split = (key: string) => {
    const [d, ...e] = key.split("|");
    return { durationMs: Number(d), easing: e.join("|") };
  };
  return {
    title: document.title,
    viewport: { width: vw, height: window.innerHeight },
    pageBackground: hex(...backdrop(document.body)),
    backgrounds: sorted(bgArea)
      .slice(0, 24)
      .map(([color, area]) => ({ color, area: Math.round(area) })),
    textColors: sorted(text)
      .slice(0, 24)
      .map(([color, chars]) => ({ color, chars })),
    borderColors: sorted(borders)
      .slice(0, 12)
      .map(([color, count]) => ({ color, count })),
    interactive: [...interactive.values()].sort((a, b) => b.count - a.count).slice(0, 16),
    fonts: [...fonts.entries()]
      .sort((a, b) => b[1].chars - a[1].chars)
      .slice(0, 8)
      .map(([stack, f]) => ({ stack, ...f })),
    fontSizes: [...sizes.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([size, z]) => ({
        px: size,
        chars: z.chars,
        role:
          z.heading > z.chars / 2
            ? ("heading" as const)
            : z.small > z.chars / 2
              ? ("small" as const)
              : ("body" as const),
      })),
    headings,
    body: style(bodyText),
    spacing: sorted(spacing)
      .slice(0, 24)
      .map(([v, count]) => ({ px: v, count })),
    radii: sorted(radii)
      .slice(0, 12)
      .map(([v, count]) => ({ px: v, count })),
    shadows: sorted(shadows)
      .slice(0, 8)
      .map(([value, count]) => ({ value, count })),
    motion: {
      transitions: sorted(transitions)
        .slice(0, 12)
        .map(([k, count]) => ({ ...split(k), count })),
      animations: sorted(animations)
        .slice(0, 12)
        .map(([k, count]) => ({ ...split(k), count })),
      live,
    },
    breakpoints: {
      minWidth: [...minWidth].sort((a, b) => a - b),
      maxWidth: [...maxWidth].sort((a, b) => a - b),
      unreadableSheets,
    },
    container: sorted(containers)[0]?.[0] ?? null,
  };
}

/** `min-width` / `max-width` px values of every @media condition in a stylesheet's text. */
export function mediaWidths(css: string): { minWidth: number[]; maxWidth: number[] } {
  const min = new Set<number>();
  const max = new Set<number>();
  const toPx = (v: string, unit: string) => Math.round(parseFloat(v) * (unit === "px" ? 1 : 16));
  for (const block of css.matchAll(/@media([^{]+)\{/g)) {
    const q = block[1]!;
    for (const m of q.matchAll(/(min|max)-width\s*:\s*([\d.]+)(px|em|rem)/g))
      (m[1] === "min" ? min : max).add(toPx(m[2]!, m[3]!));
    for (const m of q.matchAll(/width\s*(>=|>|<=|<)\s*([\d.]+)(px|em|rem)/g))
      (m[1]!.startsWith(">") ? min : max).add(toPx(m[2]!, m[3]!));
  }
  const sort = (s: Set<number>) => [...s].sort((a, b) => a - b);
  return { minWidth: sort(min), maxWidth: sort(max) };
}
