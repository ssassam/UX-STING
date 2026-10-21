/** Minimal sRGB color math: parsing, contrast (WCAG 2) and CIE Lab distance. */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp = (v: number, lo = 0, hi = 255) => Math.min(hi, Math.max(lo, v));

/** Parses `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()`. Returns null otherwise. */
export function parseColor(input: string): Rgba | null {
  const s = input.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
  if (hex) {
    let h = hex[1]!;
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(
    s,
  );
  if (rgb) {
    const alpha =
      rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : Number(rgb[4]);
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha };
  }
  return null;
}

export function toHex({ r, g, b }: Pick<Rgba, "r" | "g" | "b">): string {
  return `#${[r, g, b].map((v) => Math.round(clamp(v)).toString(16).padStart(2, "0")).join("")}`;
}

/** Composites a translucent color over an opaque background. */
export function flatten(color: Rgba, over: Rgba): Rgba {
  const a = color.a;
  return {
    r: color.r * a + over.r * (1 - a),
    g: color.g * a + over.g * (1 - a),
    b: color.b * a + over.b * (1 - a),
    a: 1,
  };
}

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export function luminance(hex: string): number {
  const c = parseColor(hex);
  if (!c) return 0;
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

/** WCAG 2 contrast ratio between two opaque colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export function toLab(hex: string): [number, number, number] {
  const c = parseColor(hex) ?? { r: 0, g: 0, b: 0, a: 1 };
  const [r, g, b] = [lin(c.r), lin(c.g), lin(c.b)];
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIE76 ΔE. Below ~2.3 is barely perceptible; above ~10 is clearly different. */
export function deltaE(a: string, b: string): number {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/** Saturation-like chroma in Lab (0 for grays). */
export function chroma(hex: string): number {
  const [, a, b] = toLab(hex);
  return Math.hypot(a, b);
}

/** Mixes two colors in sRGB; `t` = share of `b`. */
export function mix(a: string, b: string, t: number): string {
  const x = parseColor(a)!;
  const y = parseColor(b)!;
  return toHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
}

/**
 * Darkens or lightens `color` towards black or white until it reaches
 * `target` contrast against `against`, keeping its hue as far as possible.
 */
export function ensureContrast(color: string, against: string, target = 4.5): string {
  if (contrast(color, against) >= target) return color;
  const toward = luminance(against) > 0.18 ? "#000000" : "#ffffff";
  for (let t = 0.05; t <= 1.0001; t += 0.05) {
    const candidate = mix(color, toward, t);
    if (contrast(candidate, against) >= target) return candidate;
  }
  return toward;
}

/** HSL (h 0–360, s and l 0–100) to `#rrggbb`. */
export function hsl(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return toHex({ r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 });
}

/** Hue of a color in degrees (0 for grays). */
export function hueOf(hex: string): number {
  const c = parseColor(hex);
  if (!c) return 0;
  const [r, g, b] = [c.r / 255, c.g / 255, c.b / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
}
