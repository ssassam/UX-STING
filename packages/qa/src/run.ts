import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { analyze, passed, score } from "./analyze.js";
import { guardPage, guardTarget, launchBrowser, settle } from "./browser.js";
import { collectLayout, collectTaste, installVitals, readVitals } from "./collect.js";
import { toMarkdown } from "./report.js";
import { serveStatic, type StaticServer } from "./serve.js";
import {
  DEFAULT_VIEWPORTS,
  type AxeViolation,
  type QaOptions,
  type QaReport,
  type Severity,
  type ViewportResult,
} from "./types.js";

const require = createRequire(import.meta.url);
let axeSource: string | undefined;

const isUrl = (s: string) => /^https?:\/\//i.test(s);

/**
 * Renders `target` (an http(s) URL, or a local HTML file / static folder) at
 * each viewport and measures it. Returns the report and, when `outDir` is
 * set, writes `report.md`, `report.json` and screenshots there.
 */
export async function runQa(target: string, options: QaOptions = {}): Promise<QaReport> {
  const viewports = options.viewports?.length ? options.viewports : [...DEFAULT_VIEWPORTS];
  const shots = options.screenshots !== false && Boolean(options.outDir);
  let server: StaticServer | undefined;
  let url = target;
  if (!isUrl(target)) {
    server = await serveStatic(target);
    url = server.url;
  }
  const allow = await guardTarget(url, options.allowHosts);
  if (options.outDir) mkdirSync(join(options.outDir, "shots"), { recursive: true });
  axeSource ??= readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

  const browser = await launchBrowser(options.executablePath);
  const errors = new Set<string>();
  const failedRequests = new Set<string>();
  const results: ViewportResult[] = [];
  try {
    for (const width of viewports) {
      const context = await browser.newContext({
        viewport: { width, height: width < 600 ? 812 : 900 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await guardPage(page, allow);
      await page.addInitScript(installVitals);
      page.on("console", (m) => {
        // Resource failures are reported once, with their URL, under failedRequests.
        if (m.type() === "error" && !m.text().startsWith("Failed to load resource"))
          errors.add(m.text().slice(0, 300));
      });
      page.on("pageerror", (e) => errors.add(`Uncaught: ${e.message.slice(0, 300)}`));
      page.on("response", (r) => {
        if (r.status() >= 400) failedRequests.add(`${r.status()} ${r.url()}`);
      });
      page.on("requestfailed", (r) => {
        const reason = r.failure()?.errorText ?? "failed";
        if (!/ERR_ABORTED|blockedbyclient/i.test(reason))
          failedRequests.add(`${reason} ${r.url()}`);
      });

      await page.goto(url, { waitUntil: "load", timeout: 45_000 });
      await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
      await page.waitForTimeout(500);
      const vitals = await page.evaluate(readVitals);
      await settle(page, options.settleMs);
      const layout = await page.evaluate(collectLayout);
      const taste = options.taste === false ? undefined : await page.evaluate(collectTaste);

      await page.addScriptTag({ content: axeSource });
      const axe = (await page.evaluate(async () => {
        const w = window as unknown as {
          axe: { run: (ctx: Document, o: object) => Promise<{ violations: unknown[] }> };
        };
        const r = await w.axe.run(document, {
          resultTypes: ["violations"],
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
        });
        return (
          r.violations as Array<{
            id: string;
            impact: string | null;
            help: string;
            helpUrl: string;
            nodes: Array<{ target: unknown[] }>;
          }>
        ).map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          helpUrl: v.helpUrl,
          targets: v.nodes.slice(0, 3).map((n) => n.target.map(String).join(" ")),
          count: v.nodes.length,
        }));
      })) as Array<Omit<AxeViolation, "impact"> & { impact: Severity | null }>;

      const screenshots: ViewportResult["screenshots"] = {};
      if (shots && options.outDir) {
        screenshots.fold = `shots/${width}.png`;
        screenshots.full = `shots/${width}-full.png`;
        await page.screenshot({ path: join(options.outDir, screenshots.fold) });
        await page.screenshot({
          path: join(options.outDir, screenshots.full),
          fullPage: true,
          animations: "disabled",
        });
      }
      results.push({ width, layout, axe, vitals, screenshots, ...(taste ? { taste } : {}) });
      await context.close();
    }
  } finally {
    await browser.close();
    await server?.close();
  }

  const consoleResult = { errors: [...errors], failedRequests: [...failedRequests] };
  const findings = analyze(results, consoleResult);
  const report: QaReport = {
    target,
    url,
    createdAt: new Date().toISOString(),
    viewports: results,
    console: consoleResult,
    findings,
    top: findings.slice(0, 3),
    score: score(findings),
    passed: passed(findings),
  };
  if (options.outDir) {
    writeFileSync(join(options.outDir, "report.json"), JSON.stringify(report, null, 2));
    writeFileSync(join(options.outDir, "report.md"), toMarkdown(report));
  }
  return report;
}
