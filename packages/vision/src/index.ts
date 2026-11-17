import { readFile } from "node:fs/promises";
import { compareImages, type ImageComparison, type ImageSample } from "@ux-sting/design-dna";
import { decodePng } from "@ux-sting/qa";

export interface VisionThresholds {
  maxMismatch?: number;
  minSsim?: number;
  maxHeightDelta?: number;
}
export interface VisionReport extends ImageComparison {
  passed: boolean;
  thresholds: Required<VisionThresholds>;
  notes: string[];
}
export function compareScreenshots(
  reference: ImageSample,
  candidate: ImageSample,
  limits: VisionThresholds = {},
): VisionReport {
  for (const image of [reference, candidate]) {
    if (
      !Number.isInteger(image.width) ||
      !Number.isInteger(image.height) ||
      image.width < 1 ||
      image.height < 1 ||
      image.width * image.height > 25_000_000 ||
      image.data.length !== image.width * image.height * 4
    )
      throw new Error("Invalid RGBA image dimensions or data.");
  }
  const thresholds = {
    maxMismatch: limits.maxMismatch ?? 0.1,
    minSsim: limits.minSsim ?? 0.9,
    maxHeightDelta: limits.maxHeightDelta ?? 0.1,
  };
  if (
    !Number.isFinite(thresholds.maxMismatch) ||
    thresholds.maxMismatch < 0 ||
    thresholds.maxMismatch > 1 ||
    !Number.isFinite(thresholds.minSsim) ||
    thresholds.minSsim < -1 ||
    thresholds.minSsim > 1 ||
    !Number.isFinite(thresholds.maxHeightDelta) ||
    thresholds.maxHeightDelta < 0
  )
    throw new Error("Invalid vision thresholds.");
  if (reference.width !== candidate.width)
    throw new Error("Viewport widths differ. Capture both images at the same width.");
  const metrics = compareImages(reference, candidate);
  const sameWidth = reference.width === candidate.width;
  return {
    ...metrics,
    thresholds,
    passed:
      sameWidth &&
      metrics.mismatch <= thresholds.maxMismatch &&
      metrics.ssim >= thresholds.minSsim &&
      Math.abs(metrics.heightRatio - 1) <= thresholds.maxHeightDelta,
    notes: [
      "Pixel and structural comparison; this does not infer semantic design intent.",
      ...(!sameWidth ? ["Viewport widths differ. Capture both images at the same width."] : []),
    ],
  };
}
export async function comparePngFiles(
  reference: string,
  candidate: string,
  limits: VisionThresholds = {},
): Promise<VisionReport> {
  const [a, b] = await Promise.all([readFile(reference), readFile(candidate)]);
  return compareScreenshots(decodePng(a), decodePng(b), limits);
}
