import { describe, expect, it } from "vitest";
import { compareScreenshots } from "./index.js";
const image = (n: number, height = 16) => ({
  width: 16,
  height,
  data: new Uint8Array(16 * height * 4).fill(n),
});
describe("screenshot comparison", () => {
  it("passes identical images and rejects a large visual difference", () => {
    expect(compareScreenshots(image(0), image(0)).passed).toBe(true);
    const changed = compareScreenshots(image(0), image(255));
    expect(changed.passed).toBe(false);
    expect(changed.mismatch).toBe(1);
  });
  it("does not hide page-length differences", () => {
    expect(compareScreenshots(image(0), image(0, 32)).passed).toBe(false);
  });
  it("rejects incompatible images and thresholds", () => {
    expect(() =>
      compareScreenshots(image(0), { ...image(0), width: 8, data: new Uint8Array(8 * 16 * 4) }),
    ).toThrow("widths differ");
    expect(() => compareScreenshots(image(0), image(0), { minSsim: NaN })).toThrow("thresholds");
    expect(() => compareScreenshots({ ...image(0), data: [] }, image(0))).toThrow("RGBA");
  });
});
