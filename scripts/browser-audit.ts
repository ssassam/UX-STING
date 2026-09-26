/**
 * Loads pages in Chromium, runs axe-core (including color contrast, which
 * jsdom cannot compute) and saves screenshots. Usage:
 *   node scripts/browser-audit.ts http://localhost:3100 /components/button /docs/theming
 */
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const [base = "http://localhost:3000", ...paths] = process.argv.slice(2);
const outDir = process.env.SHOTS_DIR ?? "test-results/screenshots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
let failures = 0;
const configs: Array<["light" | "dark", number]> = process.env.AUDIT_QUICK
  ? [["light", 390], ["dark", 1280]]
  : [["light", 390], ["light", 1280], ["dark", 390], ["dark", 1280]];
for (const [mode, width] of configs) {
  {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: mode });
    await page.addInitScript((m) => localStorage.setItem("ui-color-mode", m), mode);
    for (const path of paths.length ? paths : ["/"]) {
      await page.goto(base + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () => {
        // @ts-expect-error injected
        const r = await window.axe.run(document, { resultTypes: ["violations"] });
        return r.violations.map((v: { id: string; impact: string; nodes: Array<{ target: string[] }> }) => ({ id: v.id, impact: v.impact, targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
      });
      const name = `${path.replace(/\W+/g, "_") || "home"}-${mode}-${width}`;
      if (!process.env.NO_SHOTS) await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
      const serious = result.filter((v: { impact: string }) => v.impact === "serious" || v.impact === "critical");
      if (serious.length || overflow > 1) failures++;
      console.log(`${serious.length || overflow > 1 ? "✖" : "✔"} ${path} [${mode} ${width}px] overflow=${overflow}px violations=${JSON.stringify(result)}`);
    }
    await page.close();
  }
}
await browser.close();
process.exit(failures ? 1 : 0);
