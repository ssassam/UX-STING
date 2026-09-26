/**
 * Minimal, dependency-free OKLCH helpers used to generate palettes and to
 * verify WCAG contrast of semantic token pairs at build/test time.
 */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const OKLCH_RE = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+%?\s*)?\)$/i;

export function oklch(l: number, c: number, h: number): string {
  const round = (n: number, d: number) => Number(n.toFixed(d));
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}

export function parseOklch(value: string): Oklch {
  const match = OKLCH_RE.exec(value.trim());
  if (!match) throw new Error(`Unsupported color value: ${value}`);
  const [, l = "0", pct, c = "0", h = "0"] = match;
  return { l: pct ? Number(l) / 100 : Number(l), c: Number(c), h: Number(h) };
}

/** Converts OKLCH to linear-light sRGB (unclamped). */
export function oklchToLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;

  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** WCAG 2.x relative luminance for an OKLCH color string. */
export function relativeLuminance(value: string): number {
  const [r, g, b] = oklchToLinearSrgb(parseOklch(value)).map(clamp01) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two OKLCH color strings. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Converts an OKLCH string to a `#rrggbb` hex string (gamut-clipped). */
export function oklchToHex(value: string): string {
  const toGamma = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  return (
    "#" +
    oklchToLinearSrgb(parseOklch(value))
      .map((x) =>
        Math.round(clamp01(toGamma(clamp01(x))) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
