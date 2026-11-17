import lighthouse, { type Flags } from "lighthouse";
import { launch } from "chrome-launcher";

export type AuditCategory = "performance" | "accessibility" | "best-practices" | "seo";
export interface LighthouseOptions {
  chromePath?: string;
  chromeFlags?: string[];
  formFactor?: "mobile" | "desktop";
  thresholds?: Partial<Record<AuditCategory, number>>;
}
export interface LighthouseReport {
  url: string;
  scores: Partial<Record<AuditCategory, number | null>>;
  thresholds: Partial<Record<AuditCategory, number>>;
  passed: boolean;
  failures: string[];
  html: string;
}
/** Run only against operator-selected URLs. Chrome is always closed, including failed audits. */
export async function runLighthouse(
  url: string,
  options: LighthouseOptions = {},
): Promise<LighthouseReport> {
  const target = new URL(url);
  if (!["http:", "https:"].includes(target.protocol) || target.username || target.password)
    throw new Error("Expected an HTTP(S) URL without credentials.");
  const thresholds = options.thresholds ?? {
    performance: 90,
    accessibility: 95,
    "best-practices": 90,
    seo: 90,
  };
  for (const [key, value] of Object.entries(thresholds)) {
    if (
      !["performance", "accessibility", "best-practices", "seo"].includes(key) ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    )
      throw new Error("Thresholds must be category scores between 0 and 100.");
  }
  const chrome = await launch({
    chromePath: options.chromePath ?? process.env.CHROMIUM_PATH,
    chromeFlags: ["--headless", "--disable-dev-shm-usage", ...(options.chromeFlags ?? [])],
  });
  try {
    const desktop = options.formFactor === "desktop";
    const flags: Flags = {
      port: chrome.port,
      output: "html",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(desktop
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 900,
              deviceScaleFactor: 1,
              disabled: false,
            },
          }
        : {}),
    };
    const result = await lighthouse(target.href, flags);
    if (!result) throw new Error("Lighthouse returned no result.");
    if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
    const scores: LighthouseReport["scores"] = {};
    for (const key of ["performance", "accessibility", "best-practices", "seo"] as const) {
      const raw = result.lhr.categories[key]?.score;
      scores[key] = typeof raw === "number" ? Math.round(raw * 100) : null;
    }
    const failures = Object.entries(thresholds).flatMap(([key, minimum]) => {
      const score = scores[key as AuditCategory];
      return score === null || score === undefined || score < minimum
        ? [`${key}: ${score ?? "unavailable"}, required ${minimum}`]
        : [];
    });
    return {
      url: result.lhr.finalDisplayedUrl,
      scores,
      thresholds,
      passed: failures.length === 0,
      failures,
      html: Array.isArray(result.report) ? result.report.join("\n") : result.report,
    };
  } finally {
    await chrome.kill();
  }
}
