import { deflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { decodePng, pixelContrast } from "./pixels.js";

/** Minimal PNG encoder for tests: RGB, one filter type for every row. */
function png(width: number, height: number, rgb: (x: number, y: number) => number[], filter = 0) {
  const stride = width * 3;
  const px = (x: number, y: number, c: number) => (x < 0 || y < 0 ? 0 : rgb(x, y)[c]!);
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = filter;
    for (let x = 0; x < width; x++)
      for (let c = 0; c < 3; c++) {
        const v = px(x, y, c);
        const a = px(x - 1, y, c);
        const b = px(x, y - 1, c);
        const pred = filter === 1 ? a : filter === 2 ? b : filter === 3 ? (a + b) >> 1 : 0;
        raw[y * (stride + 1) + 1 + x * 3 + c] = (v - pred) & 255;
      }
  }
  const chunk = (type: string, body: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(body.length);
    return Buffer.concat([len, Buffer.from(type), body, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const gradient = (x: number, y: number) => [x * 20, y * 30, (x + y) * 10];

describe("decodePng", () => {
  it.each([0, 1, 2, 3])("decodes filter type %i exactly", (filter) => {
    const bmp = decodePng(png(6, 5, gradient, filter));
    expect([bmp.width, bmp.height]).toEqual([6, 5]);
    for (const [x, y] of [
      [0, 0],
      [5, 4],
      [3, 2],
    ] as const) {
      const i = (y * 6 + x) * 4;
      expect(Array.from(bmp.data.subarray(i, i + 4))).toEqual([...gradient(x, y), 255]);
    }
  });
});

describe("pixelContrast", () => {
  const white: [number, number, number, number] = [255, 255, 255, 1];
  it("passes white text on a dark photo-like background", () => {
    const dark = decodePng(png(20, 10, (x, y) => [20 + x, 30 + y, 40]));
    expect(pixelContrast(white, dark)).toBeGreaterThan(12);
  });

  it("fails white text where the image behind it is light", () => {
    const light = decodePng(png(20, 10, () => [235, 235, 235]));
    expect(pixelContrast(white, light)).toBeLessThan(1.3);
  });

  it("judges by the worst 5% of the background, not the average", () => {
    // 20% of the area is near-white sky behind white text.
    const mixed = decodePng(png(10, 10, (x) => (x < 2 ? [245, 245, 245] : [10, 10, 10])));
    expect(pixelContrast(white, mixed)).toBeLessThan(1.2);
  });
});
