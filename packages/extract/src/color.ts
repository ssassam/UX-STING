/**
 * Color parsing and OKLCH conversion for token import. Accepts the CSS
 * syntaxes design tools emit (hex, rgb/rgba, hsl/hsla, oklch) and DTCG
 * 2025.10 color objects. Conversion math: Björn Ottosson's OKLab (public
 * domain formulas), sRGB per IEC 61966-2-1.
 */

export interface Rgb {
  /** 0–255 */
  r: number;
  g: number;
  b: number;
  /** 0–1 */
  a: number;
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toGamma = (x: number) =>
  255 * clamp(x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055, 0, 1);

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

const num = (s: string, scale = 1) =>
  s.endsWith("%") ? (parseFloat(s) / 100) * scale : parseFloat(s);

/** Parses a CSS color string or DTCG color object; null when unsupported. */
export function parseColor(input: unknown): Rgb | null {
  if (input && typeof input === "object") {
    const o = input as {
      colorSpace?: string;
      components?: unknown[];
      alpha?: number;
      hex?: string;
    };
    const a = typeof o.alpha === "number" ? o.alpha : 1;
    const comps = Array.isArray(o.components) ? o.components.map(Number) : [];
    if (o.colorSpace === "srgb" && comps.length === 3 && comps.every(Number.isFinite))
      return { r: comps[0]! * 255, g: comps[1]! * 255, b: comps[2]! * 255, a };
    if (o.colorSpace === "oklch" && comps.length === 3 && comps.every(Number.isFinite))
      return { ...oklchToRgb({ l: comps[0]!, c: comps[1]!, h: comps[2]! }), a };
    if (o.colorSpace === "hsl" && comps.length === 3 && comps.every(Number.isFinite)) {
      const [r, g, b] = hslToRgb(comps[0]!, comps[1]! / 100, comps[2]! / 100);
      return { r, g, b, a };
    }
    return typeof o.hex === "string" ? parseColor(o.hex) : null;
  }
  if (typeof input !== "string") return null;
  const s = input.trim().toLowerCase();
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (s === "white") return { r: 255, g: 255, b: 255, a: 1 };
  if (s === "black") return { r: 0, g: 0, b: 0, a: 1 };
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
  if (hex) {
    let h = hex[1]!;
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  const fn = /^(rgba?|hsla?|oklch)\((.*)\)$/.exec(s);
  if (!fn) return null;
  const parts = fn[2]!.replace(/[,/]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length < 3) return null;
  const alpha = parts[3] === undefined ? 1 : num(parts[3]);
  if (fn[1]!.startsWith("rgb")) {
    const [r, g, b] = parts.slice(0, 3).map((p) => num(p, 255));
    return { r: r!, g: g!, b: b!, a: alpha };
  }
  if (fn[1]!.startsWith("hsl")) {
    const [r, g, b] = hslToRgb(parseFloat(parts[0]!), num(parts[1]!, 1), num(parts[2]!, 1));
    return { r, g, b, a: alpha };
  }
  const l = num(parts[0]!, 1);
  return { ...oklchToRgb({ l, c: num(parts[1]!, 0.4), h: parseFloat(parts[2]!) || 0 }), a: alpha };
}

export function toHex({ r, g, b }: Pick<Rgb, "r" | "g" | "b">): string {
  return `#${[r, g, b]
    .map((v) =>
      Math.round(clamp(v, 0, 255))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function rgbToOklch({ r, g, b }: Pick<Rgb, "r" | "g" | "b">): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

export function oklchToRgb({ l, c, h }: Oklch): Pick<Rgb, "r" | "g" | "b"> {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: toGamma(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: toGamma(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: toGamma(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  };
}

/** `oklch(L C H)` string in the precision UX-STING tokens use. */
export const oklchString = ({ l, c, h }: Oklch) =>
  `oklch(${Number(l.toFixed(3))} ${Number(c.toFixed(3))} ${Number(h.toFixed(1))})`;

export function toOklchString(color: unknown): string | null {
  const rgb = parseColor(color);
  return rgb ? oklchString(rgbToOklch(rgb)) : null;
}

export function luminance({ r, g, b }: Pick<Rgb, "r" | "g" | "b">): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrast(a: Pick<Rgb, "r" | "g" | "b">, b: Pick<Rgb, "r" | "g" | "b">): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

/** Perceptual distance (Euclidean in OKLab, ×100 ≈ ΔE). */
export function deltaE(a: Pick<Rgb, "r" | "g" | "b">, b: Pick<Rgb, "r" | "g" | "b">): number {
  const p = rgbToOklch(a);
  const q = rgbToOklch(b);
  const pa = p.c * Math.cos((p.h * Math.PI) / 180);
  const pb = p.c * Math.sin((p.h * Math.PI) / 180);
  const qa = q.c * Math.cos((q.h * Math.PI) / 180);
  const qb = q.c * Math.sin((q.h * Math.PI) / 180);
  return 100 * Math.hypot(p.l - q.l, pa - qa, pb - qb);
}

/**
 * Moves `fg` in OKLCH lightness (away from `bg`) until it reaches `target`
 * contrast. Returns the original when it already passes.
 */
export function ensureContrast(fg: Rgb, bg: Rgb, target: number): Rgb {
  if (contrast(fg, bg) >= target) return fg;
  const o = rgbToOklch(fg);
  const darker = luminance(bg) > 0.18;
  for (let step = 1; step <= 100; step++) {
    const l = clamp(o.l + (darker ? -step : step) * 0.01, 0, 1);
    const candidate = { ...oklchToRgb({ ...o, l }), a: 1 };
    if (contrast(candidate, bg) >= target) return candidate;
  }
  return darker ? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
}
