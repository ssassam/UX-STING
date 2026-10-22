import { guardPage, guardTarget, launchBrowser, settle } from "@ux-sting/qa";
import { collectDesign, mediaWidths, type RawExtraction } from "./collect.js";
import type { DtcgDocument } from "./dtcg.js";
import { extractionToDtcg } from "./tokens.js";

export interface ExtractOptions {
  /** Viewport width to measure at (default 1440). */
  width?: number;
  /** Extra `host:port` entries subrequests may reach besides the target. */
  allowHosts?: string[];
  executablePath?: string;
  /** Prefer the dark color scheme when the site supports it. */
  colorScheme?: "light" | "dark";
}

/** Loads `url` in headless Chromium and returns raw measurements plus DTCG tokens. */
export async function extractUrl(
  url: string,
  options: ExtractOptions = {},
): Promise<{ raw: RawExtraction; tokens: DtcgDocument }> {
  const allow = await guardTarget(url, options.allowHosts);
  const browser = await launchBrowser(options.executablePath);
  try {
    const context = await browser.newContext({
      viewport: { width: options.width ?? 1440, height: 900 },
      colorScheme: options.colorScheme ?? "light",
    });
    const page = await context.newPage();
    await guardPage(page, allow);
    // Cross-origin stylesheets hide their rules from the CSSOM; read their
    // bodies from the network instead so breakpoints are not lost.
    const sheets: Array<Promise<string>> = [];
    page.on("response", (r) => {
      if (r.request().resourceType() === "stylesheet" && r.ok())
        sheets.push(r.text().catch(() => ""));
    });
    await page.goto(url, { waitUntil: "load", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    await settle(page, 400);
    const measured = await page.evaluate(collectDesign);
    const raw: RawExtraction = { url, capturedAt: new Date().toISOString(), ...measured };
    const fromNetwork = (await Promise.all(sheets)).map(mediaWidths);
    const merge = (key: "minWidth" | "maxWidth") =>
      [...new Set([...raw.breakpoints[key], ...fromNetwork.flatMap((m) => m[key])])].sort(
        (a, b) => a - b,
      );
    raw.breakpoints = {
      minWidth: merge("minWidth"),
      maxWidth: merge("maxWidth"),
      unreadableSheets: Math.max(0, raw.breakpoints.unreadableSheets - fromNetwork.length),
    };
    return { raw, tokens: extractionToDtcg(raw) };
  } finally {
    await browser.close();
  }
}
