import { defineConfig } from "@playwright/test";

/**
 * Visual regression over every Storybook story, in light and dark mode.
 * Baselines are platform-specific: generate them in CI's Playwright image
 * with `pnpm test:visual:update` and commit `visual/__screenshots__`.
 */
export default defineConfig({
  testDir: ".",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  outputDir: "../test-results",
  fullyParallel: true,
  updateSnapshots: "missing",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  use: {
    baseURL: "http://127.0.0.1:6007",
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
  },
  webServer: {
    command: "node visual/serve.mjs",
    cwd: "..",
    url: "http://127.0.0.1:6007/index.json",
    reuseExistingServer: true,
  },
});
