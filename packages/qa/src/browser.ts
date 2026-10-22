import { lookup } from "node:dns/promises";
import { checkTargetUrl, isPrivateAddress } from "@ux-sting/design-dna";
import type { Browser, Page } from "playwright-core";

/**
 * Launches headless Chromium through playwright-core. Uses `executablePath`,
 * then `CHROMIUM_PATH`, then Playwright's managed browser
 * (`npx playwright install chromium`).
 */
export async function launchBrowser(executablePath = process.env.CHROMIUM_PATH): Promise<Browser> {
  const { chromium } = await import("playwright-core");
  try {
    return await chromium.launch(executablePath ? { executablePath } : {});
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/Executable doesn't exist|executable/i.test(message))
      throw new Error(
        "No Chromium found. Run `npx playwright install chromium` or set CHROMIUM_PATH.",
      );
    throw error;
  }
}

const hostPort = (url: URL) =>
  `${url.hostname.replace(/^\[|\]$/g, "").toLowerCase()}:${url.port || (url.protocol === "https:" ? "443" : "80")}`;

/**
 * SSRF guard. The target the operator named is allowlisted (it is usually
 * their own dev server); every other local, private or metadata address is
 * refused, for the navigation, its redirects and every subrequest.
 */
export async function guardTarget(target: string, allowHosts: string[] = []) {
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    throw new Error(`Refused ${target}: not a valid absolute URL.`);
  }
  const allow = [hostPort(url), ...allowHosts];
  const check = checkTargetUrl(target, { allowHosts: allow });
  if (!check.ok) throw new Error(`Refused ${target}: ${check.reason}`);
  if (!check.allowlisted) {
    const addresses = await lookup(url.hostname, { all: true });
    const bad = addresses.find((a) => isPrivateAddress(a.address));
    if (bad) throw new Error(`Refused ${target}: resolves to private address ${bad.address}.`);
  }
  return allow;
}

export async function guardPage(page: Page, allowHosts: string[]) {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (/^(data|blob):/.test(url) || url === "about:blank") return route.continue();
    return checkTargetUrl(url, { allowHosts }).ok
      ? route.continue()
      : route.abort("blockedbyclient");
  });
}

/** Scrolls to the bottom and back so lazy images and scroll reveals settle. */
export async function settle(page: Page, ms = 600) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await document.fonts?.ready;
  });
  await page.waitForTimeout(ms);
}
