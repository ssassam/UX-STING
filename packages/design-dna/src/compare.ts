import { deltaE } from "./color.js";
import type { DesignDNA } from "./types.js";

/** An RGBA image sample (e.g. a downscaled screenshot). */
export interface ImageSample {
  width: number;
  height: number;
  /** RGBA bytes, row-major, length = width × height × 4. */
  data: ArrayLike<number>;
}

export interface ImageComparison {
  /** Share of compared pixels whose color differs noticeably (0–1). */
  mismatch: number;
  /** Mean structural similarity over 8×8 luminance blocks (−1…1, 1 = identical). */
  ssim: number;
  /** Height of `b` relative to `a`. 1 = same page length. */
  heightRatio: number;
  /** Horizontal bands (top to bottom) and their mismatch, for locating differences. */
  bands: Array<{ fromY: number; toY: number; mismatch: number }>;
}

const lum = (d: ArrayLike<number>, i: number) =>
  0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]!;

/**
 * Compares two screenshots of the same width. Only the overlapping height is
 * compared pixel by pixel; the length difference is reported separately.
 * Pixel metrics are one signal among several — never optimise them at the
 * expense of accessibility or content.
 */
export function compareImages(
  a: ImageSample,
  b: ImageSample,
  { threshold = 32, bands = 8 } = {},
): ImageComparison {
  if (a.width !== b.width) throw new Error("compareImages: samples must have the same width");
  const w = a.width;
  const h = Math.min(a.height, b.height);
  let differing = 0;
  const bandSize = Math.max(1, Math.ceil(h / bands));
  const bandDiff = new Array<number>(Math.ceil(h / bandSize)).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const d =
        Math.abs(a.data[i]! - b.data[i]!) +
        Math.abs(a.data[i + 1]! - b.data[i + 1]!) +
        Math.abs(a.data[i + 2]! - b.data[i + 2]!);
      if (d > threshold * 3) {
        differing++;
        bandDiff[Math.floor(y / bandSize)]!++;
      }
    }
  }
  // SSIM on 8×8 luminance blocks.
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  let total = 0;
  let blocks = 0;
  for (let by = 0; by + 8 <= h; by += 8) {
    for (let bx = 0; bx + 8 <= w; bx += 8) {
      let ma = 0,
        mb = 0;
      for (let y = by; y < by + 8; y++)
        for (let x = bx; x < bx + 8; x++) {
          const i = (y * w + x) * 4;
          ma += lum(a.data, i);
          mb += lum(b.data, i);
        }
      ma /= 64;
      mb /= 64;
      let va = 0,
        vb = 0,
        cov = 0;
      for (let y = by; y < by + 8; y++)
        for (let x = bx; x < bx + 8; x++) {
          const i = (y * w + x) * 4;
          const da = lum(a.data, i) - ma;
          const db = lum(b.data, i) - mb;
          va += da * da;
          vb += db * db;
          cov += da * db;
        }
      va /= 63;
      vb /= 63;
      cov /= 63;
      total += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      blocks++;
    }
  }
  return {
    mismatch: w * h ? differing / (w * h) : 0,
    ssim: blocks ? total / blocks : 1,
    heightRatio: a.height ? b.height / a.height : 1,
    bands: bandDiff.map((n, i) => ({
      fromY: i * bandSize,
      toY: Math.min(h, (i + 1) * bandSize),
      mismatch: n / (w * Math.max(1, Math.min(h, (i + 1) * bandSize) - i * bandSize)),
    })),
  };
}

export interface TokenDifference {
  path: string;
  reference: string | number;
  candidate: string | number;
  /** Normalised distance; 0 = identical, ≥ 1 = clearly different. */
  distance: number;
}

export interface DnaFidelity {
  /** 0–100, weighted across color, type, layout, sections and shape. */
  score: number;
  categories: Record<"color" | "typography" | "layout" | "sections" | "shape", number>;
  differences: TokenDifference[];
}

/**
 * Compares two DNAs token by token — the reference's and the DNA measured
 * back from the generated page. This catches differences pixel metrics
 * cannot explain (a 40px vs 32px heading, a different accent) and it works
 * even when the content differs.
 */
export function compareDna(reference: DesignDNA, candidate: DesignDNA): DnaFidelity {
  const differences: TokenDifference[] = [];
  const push = (path: string, r: string | number, c: string | number, distance: number) =>
    differences.push({
      path,
      reference: r,
      candidate: c,
      distance: Math.round(distance * 1000) / 1000,
    });

  const colorKeys = [
    "background",
    "surface",
    "foreground",
    "muted",
    "accent",
    "accentForeground",
    "border",
  ] as const;
  const colorScores = colorKeys.map((k) => {
    const d = deltaE(reference.color[k], candidate.color[k]) / 20;
    push(`color.${k}`, reference.color[k], candidate.color[k], d);
    return Math.max(0, 1 - d);
  });

  const rel = (r: number, c: number) =>
    r === 0 && c === 0 ? 0 : Math.abs(r - c) / Math.max(Math.abs(r), Math.abs(c), 1);
  const steps = reference.typography.scale.steps;
  const typeScores = (Object.keys(steps) as Array<keyof typeof steps>).map((k) => {
    const d = rel(steps[k], candidate.typography.scale.steps[k]) * 4;
    push(`typography.scale.steps.${k}`, steps[k], candidate.typography.scale.steps[k], d);
    return Math.max(0, 1 - d);
  });
  const fam = (s: string) => (s.split(",")[0] ?? "").replace(/["']/g, "").trim().toLowerCase();
  const sameDisplay =
    fam(reference.typography.display.family) === fam(candidate.typography.display.family);
  const sameBody = fam(reference.typography.body.family) === fam(candidate.typography.body.family);
  push(
    "typography.display.family",
    reference.typography.display.family,
    candidate.typography.display.family,
    sameDisplay ? 0 : 1,
  );
  push(
    "typography.body.family",
    reference.typography.body.family,
    candidate.typography.body.family,
    sameBody ? 0 : 1,
  );
  typeScores.push(sameDisplay ? 1 : 0, sameBody ? 1 : 0);
  const tr =
    Math.abs(reference.typography.headingTracking - candidate.typography.headingTracking) * 25;
  push(
    "typography.headingTracking",
    reference.typography.headingTracking,
    candidate.typography.headingTracking,
    tr,
  );
  typeScores.push(Math.max(0, 1 - tr));

  const layoutPairs: Array<[string, number, number]> = [
    ["layout.container", reference.layout.container, candidate.layout.container],
    ["layout.sectionGap", reference.layout.sectionGap, candidate.layout.sectionGap],
    ["layout.gutter", reference.layout.gutter, candidate.layout.gutter],
  ];
  const layoutScores = layoutPairs.map(([path, r, c]) => {
    const d = rel(r, c) * 3;
    push(path, r, c, d);
    return Math.max(0, 1 - d);
  });

  const rs = reference.layout.sections;
  const cs = candidate.layout.sections;
  const n = Math.max(rs.length, cs.length, 1);
  let sectionTotal = 0;
  for (let i = 0; i < n; i++) {
    const r = rs[i];
    const c = cs[i];
    if (!r || !c) {
      push(`layout.sections[${i}]`, r?.role ?? "—", c?.role ?? "—", 1);
      continue;
    }
    const roleOk = r.role === c.role ? 1 : 0;
    // The page shell (header, footer) is generated generically; only its role is compared.
    const shell = r.role === "navigation" || r.role === "footer";
    const compOk = shell || r.composition === c.composition ? 1 : 0;
    const heightOk =
      shell || !r.heightPx || !c.heightPx ? 1 : Math.max(0, 1 - rel(r.heightPx, c.heightPx) * 2);
    const s = (roleOk + compOk + heightOk) / 3;
    if (s < 1)
      push(
        `layout.sections[${i}]`,
        `${r.role}/${r.composition}/${r.heightPx ?? "?"}px`,
        `${c.role}/${c.composition}/${c.heightPx ?? "?"}px`,
        1 - s,
      );
    sectionTotal += s;
  }
  const sectionScore = sectionTotal / n;

  const radiusD = rel(reference.shape.radius, candidate.shape.radius) * 2;
  push("shape.radius", reference.shape.radius, candidate.shape.radius, radiusD);
  const shapeScore =
    (Math.max(0, 1 - radiusD) + (reference.shape.shadow === candidate.shape.shadow ? 1 : 0)) / 2;

  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
  const categories = {
    color: Math.round(avg(colorScores) * 100),
    typography: Math.round(avg(typeScores) * 100),
    layout: Math.round(avg(layoutScores) * 100),
    sections: Math.round(sectionScore * 100),
    shape: Math.round(shapeScore * 100),
  };
  const score = Math.round(
    categories.color * 0.25 +
      categories.typography * 0.3 +
      categories.layout * 0.15 +
      categories.sections * 0.2 +
      categories.shape * 0.1,
  );
  differences.sort((a, b) => b.distance - a.distance);
  return { score, categories, differences };
}
