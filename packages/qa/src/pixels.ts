/**
 * Contrast for text over photos and gradients, measured on what the browser
 * actually painted: hide the text, screenshot its box, and compare the text
 * color with the background pixels. Decoding happens here in Node (no page
 * CSP to fight, no dependency): Playwright screenshots are 8-bit RGB/RGBA,
 * non-interlaced PNGs.
 */
import { inflateSync } from "node:zlib";
import type { Page } from "playwright-core";
import type { LayoutMeasurement, PixelCandidate } from "./types.js";

export interface Bitmap {
  width: number;
  height: number;
  /** RGBA, 4 bytes per pixel. */
  data: Uint8Array;
}

/** Decodes an 8-bit, non-interlaced RGB/RGBA/gray PNG (what browsers screenshot). */
export function decodePng(buf: Uint8Array): Bitmap {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Uint8Array[] = [];
  while (pos < buf.length) {
    const len = view.getUint32(pos);
    const type = String.fromCharCode(...buf.subarray(pos + 4, pos + 8));
    const body = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      const h = new DataView(body.buffer, body.byteOffset, body.byteLength);
      width = h.getUint32(0);
      height = h.getUint32(4);
      if (body[8] !== 8 || body[12] !== 0)
        throw new Error("Unsupported PNG (need 8-bit, non-interlaced)");
      colorType = body[9]!;
    } else if (type === "IDAT") idat.push(body);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`Unsupported PNG color type ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!;
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels]! : 0;
      const b = y > 0 ? pixels[(y - 1) * stride + x]! : 0;
      const c = x >= channels && y > 0 ? pixels[(y - 1) * stride + x - channels]! : 0;
      const v = line[x]!;
      let out: number;
      if (filter === 0) out = v;
      else if (filter === 1) out = v + a;
      else if (filter === 2) out = v + b;
      else if (filter === 3) out = v + ((a + b) >> 1);
      else {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        out = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      }
      pixels[y * stride + x] = out & 255;
    }
  }
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    const gray = channels <= 2;
    data[i * 4] = pixels[s]!;
    data[i * 4 + 1] = gray ? pixels[s]! : pixels[s + 1]!;
    data[i * 4 + 2] = gray ? pixels[s]! : pixels[s + 2]!;
    data[i * 4 + 3] = channels === 4 ? pixels[s + 3]! : channels === 2 ? pixels[s + 1]! : 255;
  }
  return { width, height, data };
}

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (r: number, g: number, b: number) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/**
 * Contrast of `color` against a background bitmap: the ratio that at least
 * 95% of the background reaches (the worst 5% are where text is hardest to
 * read, without letting a few stray pixels decide).
 */
export function pixelContrast(color: PixelCandidate["color"], bg: Bitmap): number {
  const [r, g, b, a] = color;
  const n = bg.width * bg.height;
  const step = Math.max(1, Math.floor(n / 4000));
  const ratios: number[] = [];
  for (let i = 0; i < n; i += step) {
    const br = bg.data[i * 4]!;
    const bgG = bg.data[i * 4 + 1]!;
    const bb = bg.data[i * 4 + 2]!;
    const lf = luminance(r * a + br * (1 - a), g * a + bgG * (1 - a), b * a + bb * (1 - a));
    const lb = luminance(br, bgG, bb);
    const [hi, lo] = lf > lb ? [lf, lb] : [lb, lf];
    ratios.push((hi + 0.05) / (lo + 0.05));
  }
  ratios.sort((x, y) => x - y);
  return ratios[Math.floor(ratios.length * 0.05)] ?? 21;
}

/**
 * Measures every pixel candidate the collector marked, then folds the results
 * into `layout.contrast` (checked count and failing list) and drops the
 * internal candidate list.
 */
export async function measurePixelContrast(page: Page, layout: LayoutMeasurement): Promise<void> {
  const contrast = layout.contrast;
  const candidates = contrast.pixelCandidates ?? [];
  delete contrast.pixelCandidates;
  if (!candidates.length) return;

  // Let late images finish, then hide the marked text (and anything inside it).
  await page.evaluate(async () => {
    const pending = Array.from(document.images).filter((i) => !i.complete);
    pending.forEach((i) => (i.loading = "eager"));
    await Promise.race([
      Promise.all(
        pending.map((i) => new Promise((r) => i.addEventListener("load", r, { once: true }))),
      ),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    const style = document.createElement("style");
    style.id = "ux-sting-px-hide";
    style.textContent =
      "[data-ux-sting-px], [data-ux-sting-px] * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important; fill: transparent !important; stroke: transparent !important; }";
    document.head.append(style);
  });

  try {
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (const c of candidates) {
      const x = Math.max(0, Math.floor(c.rect.x));
      const y = Math.max(0, Math.floor(c.rect.y));
      const width = Math.ceil(c.rect.width);
      const height = Math.min(Math.ceil(c.rect.height), docHeight - y);
      if (width < 1 || height < 1) {
        contrast.skipped++;
        continue;
      }
      let ratio: number;
      try {
        const png = await page.screenshot({
          fullPage: true,
          clip: { x, y, width, height },
          animations: "disabled",
          type: "png",
        });
        ratio = pixelContrast(c.color, decodePng(png));
      } catch {
        contrast.skipped++;
        continue;
      }
      contrast.checked++;
      if (ratio < c.required - 0.005)
        contrast.failing.push({
          target: c.target,
          ratio: Math.round(ratio * 100) / 100,
          required: c.required,
          text: c.text,
          method: "pixels",
        });
    }
    contrast.failing = contrast.failing.slice(0, 20);
  } finally {
    await page.evaluate(() => {
      document.getElementById("ux-sting-px-hide")?.remove();
      document
        .querySelectorAll("[data-ux-sting-px]")
        .forEach((e) => e.removeAttribute("data-ux-sting-px"));
    });
  }
}
