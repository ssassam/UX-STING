# @ux-sting/vision

`compareScreenshots(referenceRGBA, candidateRGBA, thresholds?)` returns mismatch, SSIM, height ratio, horizontal difference bands and a pass flag. `comparePngFiles(referencePath, candidatePath, thresholds?)` decodes PNG files first.

Thresholds default to `maxMismatch: 0.1`, `minSsim: 0.9`, `maxHeightDelta: 0.1`. Viewport widths must match. This is pixel comparison, not screenshot-to-design understanding. For stable results, use the same browser, fonts and viewport and wait for the page to settle.
