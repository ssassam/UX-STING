import { chromium } from "@playwright/test";
const [url, out, w = "1280", mode = "light", h = "1400"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  colorScheme: mode,
});
await page.addInitScript((m) => localStorage.setItem("ui-color-mode", m), mode);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: out });
await browser.close();
