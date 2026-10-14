/**
 * UX-STING Universal prototype pipeline:
 *
 *   reference URL ─┐
 *                  ├─▶ Design DNA ─▶ generated page ─▶ browser render ─▶ visual audit ─▶ fixes ─▶ improved page
 *   written brief ─┘
 *
 * Usage:
 *   node scripts/design-dna/run.ts reconstruct <url> --authorized [--allow-host localhost:4100] [--out dir]
 *   node scripts/design-dna/run.ts original <brief.json> [--out dir]
 *
 * Deterministic checks (contrast, overflow, axe, token and pixel metrics)
 * are reported separately from inferred values (section roles,
 * personality), which are labelled with their provenance in dna.json.
 */
import { lookup } from "node:dns/promises";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { chromium, type Browser, type Page } from "@playwright/test";
import {
  applyFixes,
  checkTargetUrl,
  compareDna,
  compareImages,
  dnaFromDirection,
  dnaFromObservation,
  dnaToDtcg,
  dnaToUxStingTheme,
  generatePage,
  isPrivateAddress,
  planDirections,
  proposeFixes,
  validateDna,
  type Brief,
  type DesignDNA,
  type DnaFidelity,
  type Fix,
  type ImageComparison,
  type PageContent,
  type PageObservation,
  type PageQa,
} from "../../packages/design-dna/dist/index.js";
import { collectPage } from "./collect.ts";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const VIEWPORTS = [1280, 390];
const MAX_ITERATIONS = 3;

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const allowHosts = args.flatMap((a, i) => (args[i - 1] === "--allow-host" ? [a] : []));
const [mode, target] = args;
const outDir = resolve(option("out") ?? `design-dna-output/${mode}-${Date.now()}`);

async function guardTarget(url: string) {
  const check = checkTargetUrl(url, { allowHosts });
  if (!check.ok) throw new Error(`Refused ${url}: ${check.reason}`);
  if (!check.allowlisted) {
    const addresses = await lookup(check.url!.hostname, { all: true });
    const bad = addresses.find((a) => isPrivateAddress(a.address));
    if (bad) throw new Error(`Refused ${url}: resolves to private address ${bad.address}.`);
  }
}

/** Blocks every request (subresources and redirects included) that fails the target check. */
async function guardPage(page: Page) {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("data:") || url.startsWith("blob:") || url === "about:blank")
      return route.continue();
    const check = checkTargetUrl(url, { allowHosts });
    return check.ok ? route.continue() : route.abort("blockedbyclient");
  });
}

async function screenshot(page: Page, file: string) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(400);
  return page.screenshot({ path: file, fullPage: true, animations: "disabled" });
}

/** Downscales a PNG to `width` px wide and returns its RGBA pixels. */
async function sample(browser: Browser, png: Buffer, width = 160) {
  const page = await browser.newPage();
  const result = await page.evaluate(
    async ({ src, width }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const height = Math.round((img.height * width) / img.width);
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      return { width, height, data: Array.from(ctx.getImageData(0, 0, width, height).data) };
    },
    { src: `data:image/png;base64,${png.toString("base64")}`, width },
  );
  await page.close();
  return result;
}

async function qa(page: Page, viewport: number): Promise<PageQa> {
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const over = Array.from(document.querySelectorAll("body *"))
      .filter((el) => el.getBoundingClientRect().right > vw + 1)
      .slice(0, 8)
      .map(
        (el) =>
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : el.className ? `.${String(el.className).split(" ")[0]}` : ""),
      );
    // Text squeezed into a column narrower than ~6 characters, wrapping onto 3+ lines.
    const cramped = Array.from(document.querySelectorAll("p,li,h1,h2,h3,a,span"))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const fs = parseFloat(s.fontSize);
        const lh = s.lineHeight === "normal" ? fs * 1.2 : parseFloat(s.lineHeight);
        const text = (el.textContent ?? "").trim();
        return text.length > 8 && r.width > 0 && r.width < fs * 6 && r.height > lh * 2.5;
      })
      .slice(0, 8)
      .map(
        (el) =>
          `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(" ")[0]}` : ""} "${(el.textContent ?? "").trim().slice(0, 24)}"`,
      );
    return {
      overflowX: Math.max(0, document.documentElement.scrollWidth - vw),
      overflowing: over,
      cramped,
    };
  });
  await page.addScriptTag({ content: axeSource });
  const a11y = await page.evaluate(async () => {
    // @ts-expect-error axe is injected above
    const r = await window.axe.run(document, { resultTypes: ["violations"] });
    return r.violations.map((v: { id: string; impact: string | null; nodes: unknown[] }) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
    }));
  });
  return { viewport, ...overflow, a11y };
}

interface Iteration {
  index: number;
  dna: DesignDNA;
  qa: PageQa[];
  fidelity?: DnaFidelity;
  pixels?: ImageComparison;
  fixes: Fix[];
  shots: Record<number, string>;
}

/** Renders a DNA, audits it and returns the measured results for one iteration. */
async function renderAndAudit(
  browser: Browser,
  dna: DesignDNA,
  content: PageContent,
  index: number,
  base: string,
  reference?: { dna: DesignDNA; shot: Buffer },
): Promise<Iteration> {
  const dir = join(base, `iteration-${index}`);
  mkdirSync(dir, { recursive: true });
  const { html } = generatePage(dna, content);
  writeFileSync(join(dir, "index.html"), html);
  writeFileSync(join(dir, "dna.json"), JSON.stringify(dna, null, 2));
  const results: PageQa[] = [];
  const shots: Record<number, string> = {};
  let measured: DesignDNA | undefined;
  let desktopShot: Buffer | undefined;
  for (const width of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await guardPage(page);
    await page.setContent(html, { waitUntil: "load" });
    const file = join(dir, `screenshot-${width}.png`);
    const png = await screenshot(page, file);
    shots[width] = file;
    if (width === 1280) {
      desktopShot = png;
      const obs = (await page.evaluate(collectPage, { authorized: false })) as PageObservation;
      measured = dnaFromObservation(obs, { name: "measured" });
    }
    results.push(await qa(page, width));
    await page.close();
  }
  let fidelity: DnaFidelity | undefined;
  let pixels: ImageComparison | undefined;
  if (reference && measured && desktopShot) {
    fidelity = compareDna(reference.dna, measured);
    pixels = compareImages(
      await sample(browser, reference.shot),
      await sample(browser, desktopShot),
    );
    results[0]!.mismatch = pixels.mismatch;
  }
  const fixes = proposeFixes(dna, { reference: reference?.dna, measured, fidelity, qa: results });
  return { index, dna, qa: results, fidelity, pixels, fixes, shots };
}

async function loop(
  browser: Browser,
  dna: DesignDNA,
  content: PageContent,
  base: string,
  reference?: { dna: DesignDNA; shot: Buffer },
) {
  const iterations: Iteration[] = [];
  let current = dna;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const it = await renderAndAudit(browser, current, content, i, base, reference);
    iterations.push(it);
    console.log(
      `  iteration ${i}: ${it.fidelity ? `fidelity ${it.fidelity.score}/100, pixel mismatch ${(it.pixels!.mismatch * 100).toFixed(1)}%, ` : ""}a11y ${it.qa.map((q) => q.a11y.length).join("/")} violations, cramped ${it.qa.map((q) => q.cramped?.length ?? 0).join("/")}, overflow ${it.qa.map((q) => q.overflowX).join("/")}px, ${it.fixes.length} fixes`,
    );
    if (!it.fixes.length) break;
    // Stop when the same corrections come back without any measured gain.
    const prev = iterations.at(-2);
    const samePaths =
      prev &&
      prev.fixes
        .map((f) => f.path)
        .sort()
        .join() ===
        it.fixes
          .map((f) => f.path)
          .sort()
          .join();
    if (samePaths && (it.fidelity?.score ?? 0) <= (prev.fidelity?.score ?? 0)) {
      console.log("  stopped: the remaining differences do not respond to token changes");
      break;
    }
    current = applyFixes(current, it.fixes);
  }
  return iterations;
}

function contentFromObservation(
  obs: PageObservation,
  dna: DesignDNA,
  authorized: boolean,
): PageContent {
  const specs = dna.layout.sections.filter((s) => s.role !== "navigation" && s.role !== "footer");
  const firstOutline = obs.sections.findIndex(
    (s) => s.tag !== "nav" && !(s.tag === "header" && s.height < 160),
  );
  return {
    lang: obs.lang,
    dir: obs.dir,
    title: authorized ? obs.title : "Reconstruction (placeholder content)",
    description: authorized
      ? (obs.description ?? obs.title)
      : "Layout reconstruction with placeholder content.",
    siteName: authorized ? obs.title.split(/[—|–-]/)[0]!.trim() || "Site" : "Site name",
    nav: (authorized && obs.nav.labels?.length
      ? obs.nav.labels
      : Array.from({ length: Math.min(5, obs.nav.itemCount) }, (_, i) => `Link ${i + 1}`)
    )
      .slice(0, 6)
      .map((label, i) => ({ label, href: `#${specs[i + 1]?.id ?? specs[0]?.id ?? "main"}` })),
    sections: specs.map((spec) => {
      const i = dna.layout.sections.indexOf(spec);
      const o = obs.outline[i] ?? obs.outline[firstOutline];
      const wantsItems = !!spec.itemCount || spec.composition === "index";
      // Authorized: real item labels or none. Unauthorized: labelled placeholders.
      const items = !wantsItems
        ? []
        : authorized
          ? (o?.items ?? [])
          : Array.from({ length: spec.itemCount ?? 3 }, (_, k) => `Item ${k + 1}`);
      return {
        id: spec.id,
        heading: authorized
          ? (o?.heading ?? `${spec.role} section`)
          : `${spec.role[0]!.toUpperCase()}${spec.role.slice(1)} heading`,
        body: authorized ? o?.text : "Placeholder text. Replace it with your own content.",
        ...(items.length
          ? { items: items.slice(0, spec.itemCount ?? 8).map((title) => ({ title })) }
          : {}),
        ...(spec.role === "hero"
          ? {
              action: {
                label: authorized ? (o?.action ?? "Primary action") : "Call to action",
                href: `#${specs.at(-1)?.id ?? "main"}`,
              },
            }
          : {}),
        ...(spec.media
          ? { media: { alt: "Image placeholder (reference imagery is not copied)" } }
          : {}),
      };
    }),
    footer: authorized ? `© ${obs.title}` : "Footer",
  };
}

function writeReport(
  title: string,
  extra: string[],
  runs: Array<{ label: string; iterations: Iteration[]; referenceShot?: string }>,
) {
  const rel = (p: string) => p.replace(`${outDir}/`, "");
  const md: string[] = [`# ${title}`, "", ...extra, ""];
  const html: string[] = [];
  for (const run of runs) {
    md.push(
      `## ${run.label}`,
      "",
      "| Iteration | Fidelity | Pixel mismatch | SSIM | a11y violations (1280/390) | Overflow px (1280/390) | Cramped text (1280/390) | Fixes |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const it of run.iterations)
      md.push(
        `| ${it.index} | ${it.fidelity ? `${it.fidelity.score}/100` : "—"} | ${it.pixels ? `${(it.pixels.mismatch * 100).toFixed(1)}%` : "—"} | ${it.pixels ? it.pixels.ssim.toFixed(3) : "—"} | ${it.qa.map((q) => q.a11y.map((v) => `${v.id}(${v.impact})`).join(", ") || "0").join(" / ")} | ${it.qa.map((q) => q.overflowX).join(" / ")} | ${it.qa.map((q) => q.cramped?.length ?? 0).join(" / ")} | ${it.fixes.length} |`,
      );
    md.push("");
    run.iterations.forEach((it) => {
      if (it.fixes.length)
        md.push(
          `Fixes after iteration ${it.index}:`,
          ...it.fixes.map(
            (f) =>
              `- **${f.kind}** \`${f.path}\`: ${JSON.stringify(f.from)} → ${JSON.stringify(f.to)} — ${f.reason}`,
          ),
          "",
        );
    });
    const last = run.iterations.at(-1)!;
    if (last.fidelity) {
      md.push(
        `Final fidelity by category: ${Object.entries(last.fidelity.categories)
          .map(([k, v]) => `${k} ${v}`)
          .join(", ")}.`,
        "",
        "Largest remaining differences:",
        ...last.fidelity.differences
          .slice(0, 8)
          .map((d) => `- \`${d.path}\`: reference ${d.reference}, generated ${d.candidate}`),
        "",
      );
    }
    const cols = [
      run.referenceShot
        ? `<figure><figcaption>Reference</figcaption><img src="${rel(run.referenceShot)}" alt="Reference page"></figure>`
        : "",
      ...run.iterations.map(
        (it) =>
          `<figure><figcaption>Iteration ${it.index}</figcaption><img src="${rel(it.shots[1280]!)}" alt="Generated page, iteration ${it.index}"></figure>`,
      ),
    ];
    html.push(`<section><h2>${run.label}</h2><div class="row">${cols.join("")}</div></section>`);
  }
  writeFileSync(join(outDir, "report.md"), md.join("\n"));
  writeFileSync(
    join(outDir, "report.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font:16px/1.5 system-ui,sans-serif;margin:2rem;color:#111;background:#fafafa}.row{display:flex;gap:1rem;overflow-x:auto;align-items:flex-start}figure{margin:0;flex:0 0 360px}img{width:100%;border:1px solid #ddd}figcaption{font-weight:600;margin-bottom:.25rem}</style><h1>${title}</h1>${html.join("")}<p>See report.md for scores and applied fixes.</p></html>`,
  );
}

async function reconstruct(browser: Browser, url: string) {
  const authorized = flag("authorized");
  if (!authorized)
    console.warn(
      "Without --authorized, text content is not copied: placeholders are used and only the visual system is measured.",
    );
  await guardTarget(url);
  mkdirSync(join(outDir, "reference"), { recursive: true });
  const shots: Record<number, string> = {};
  let obs: PageObservation | undefined;
  let referenceShot: Buffer | undefined;
  for (const width of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await guardPage(page);
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    const file = join(outDir, "reference", `screenshot-${width}.png`);
    const png = await screenshot(page, file);
    shots[width] = file;
    if (width === 1280) {
      referenceShot = png;
      obs = (await page.evaluate(collectPage, { authorized })) as PageObservation;
      writeFileSync(join(outDir, "reference", "observation.json"), JSON.stringify(obs, null, 2));
    }
    await page.close();
  }
  const refDna = dnaFromObservation(obs!, { authorized });
  writeFileSync(join(outDir, "reference", "dna.json"), JSON.stringify(refDna, null, 2));
  writeFileSync(
    join(outDir, "reference", "tokens.dtcg.json"),
    JSON.stringify(dnaToDtcg(refDna), null, 2),
  );
  writeFileSync(
    join(outDir, "reference", "ux-sting-theme.json"),
    JSON.stringify(dnaToUxStingTheme(refDna), null, 2),
  );
  const refIssues = validateDna(refDna);
  console.log(
    `Reference DNA: ${refDna.layout.sections.length} sections, display ${refDna.typography.scale.steps.display}px, accent ${refDna.color.accent}, ${refIssues.length} DNA issues.`,
  );
  // The working DNA starts as the reference, minus any accessibility failures it carries.
  const working = applyFixes(refDna, proposeFixes(refDna, {}));
  const iterations = await loop(
    browser,
    working,
    contentFromObservation(obs!, refDna, authorized),
    outDir,
    { dna: refDna, shot: referenceShot! },
  );
  writeReport(
    `Reconstruction of ${url}`,
    [
      `Authorized: ${authorized ? "yes (text outline copied, imagery replaced by placeholders)" : "no (placeholders only)"}.`,
      `Reference DNA issues: ${refIssues.map((i) => `${i.code} at ${i.path}`).join("; ") || "none"}.`,
      "Fidelity compares the reference DNA with DNA measured back from the generated page. Pixel mismatch compares 160px-wide downscaled full-page screenshots; it is expected to stay high when imagery and text differ.",
    ],
    [{ label: "Reference → generated", iterations, referenceShot: shots[1280] }],
  );
}

async function original(browser: Browser, briefFile: string) {
  const brief = JSON.parse(readFileSync(briefFile, "utf8")) as Brief & { content: PageContent };
  const directions = planDirections(brief, 3);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "directions.json"), JSON.stringify(directions, null, 2));
  const runs = [];
  for (const [i, d] of directions.entries()) {
    console.log(`Direction ${i + 1}: ${d.id} (score ${d.score})`);
    const dna = dnaFromDirection(brief, d);
    const iterations = await loop(browser, dna, brief.content, join(outDir, `direction-${i + 1}`));
    runs.push({ label: `Direction ${i + 1}: ${d.id} — score ${d.score}/100`, iterations });
  }
  writeReport(
    `Original design: ${brief.name}`,
    [
      "Directions were planned from the brief along three independent axes (type, palette, composition) and scored against it:",
      ...directions.map(
        (d, i) =>
          `${i + 1}. **${d.id}** (${d.score}/100). ${d.rationale.join(" ")}${d.risks.length ? ` Risks: ${d.risks.join(" ")}` : ""}`,
      ),
    ],
    runs,
  );
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
try {
  if (mode === "reconstruct" && target) await reconstruct(browser, target);
  else if (mode === "original" && target) await original(browser, target);
  else {
    console.error(
      "Usage: run.ts reconstruct <url> --authorized [--allow-host host:port] [--out dir]\n       run.ts original <brief.json> [--out dir]",
    );
    process.exitCode = 2;
  }
  console.log(`Report: ${join(outDir, "report.md")}`);
} finally {
  await browser.close();
}
