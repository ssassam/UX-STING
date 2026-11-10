import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

interface IndexEntry {
  id: string;
  type: string;
  tags?: string[];
}

const index = JSON.parse(
  readFileSync(new URL("../storybook-static/index.json", import.meta.url), "utf8"),
) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter(
  (e) => e.type === "story" && !e.tags?.includes("no-visual"),
);

for (const story of stories) {
  for (const mode of ["light", "dark"] as const) {
    test(`${story.id} (${mode})`, async ({ page }) => {
      // Stories that render "today" (calendars, opening hours) need a stable clock.
      if (story.tags?.includes("fixed-clock"))
        await page.clock.setFixedTime(new Date("2026-01-14T10:30:00"));
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=mode:${mode}`);
      await page.waitForSelector("#storybook-root > *", { state: "attached" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${story.id}-${mode}.png`, { fullPage: true });
    });
  }
}
