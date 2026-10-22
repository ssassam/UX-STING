import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { analyze, passed, rank, score } from "./analyze.js";
import { qaCommand } from "./command.js";
import { toMarkdown } from "./report.js";
import { serveStatic } from "./serve.js";
import type { Finding, LayoutMeasurement, QaReport, ViewportResult } from "./types.js";

const layout = (over: Partial<LayoutMeasurement> = {}): LayoutMeasurement => ({
  width: 375,
  height: 812,
  documentHeight: 2000,
  overflow: { px: 0, offenders: [] },
  title: { text: "Hello", top: 120, bottom: 180, visible: true, tag: "h1" },
  sections: [],
  orphanItems: [],
  emptyStretches: [],
  contrast: { checked: 10, skipped: 0, failing: [] },
  ...over,
});

const vp = (
  width: number,
  over: Partial<LayoutMeasurement> = {},
  rest: Partial<ViewportResult> = {},
) =>
  ({
    width,
    layout: layout({ width, ...over }),
    axe: [],
    vitals: { lcp: 900, cls: 0 },
    screenshots: {},
    ...rest,
  }) satisfies ViewportResult;

describe("analyze", () => {
  it("reports nothing for a clean page", () => {
    const findings = analyze([vp(375), vp(1440)]);
    expect(findings).toEqual([]);
    expect(score(findings)).toBe(100);
    expect(passed(findings)).toBe(true);
  });

  it("flags overflow, hidden or missing titles, margins, orphans and empty stretches", () => {
    const findings = analyze([
      vp(375, {
        overflow: { px: 40, offenders: ["div.wide"] },
        title: { text: "T", top: 900, bottom: 960, visible: true, tag: "h1" },
        sections: [
          {
            target: "section.a",
            top: 0,
            height: 400,
            marginStart: 40,
            marginEnd: 200,
            textChars: 300,
            childCount: 3,
            hasMedia: false,
            hasControls: false,
          },
          {
            target: "section.b",
            top: 400,
            height: 60,
            marginStart: 16,
            marginEnd: 16,
            textChars: 5,
            childCount: 1,
            hasMedia: false,
            hasControls: false,
          },
        ],
        orphanItems: [{ target: "ul.cards", perRow: 3, lastRow: 1 }],
        emptyStretches: [
          { top: 1000, height: 700 },
          { top: 2000, height: 900 },
        ],
      }),
      vp(1440, { title: null }),
    ]);
    const ids = findings.map((f) => f.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "overflow-x",
        "title-below-fold",
        "title-missing",
        "unequal-margins",
        "orphan-section",
        "orphan-grid-item",
        "empty-stretch",
      ]),
    );
    const empty = findings.find((f) => f.id === "empty-stretch")!;
    expect(empty.message).toContain("largest 900px");
    expect(passed(findings)).toBe(false);
  });

  it("never calls a short navigation band an orphan", () => {
    const section = {
      target: "nav.breadcrumb",
      top: 0,
      height: 24,
      marginStart: 16,
      marginEnd: 16,
      textChars: 14,
      childCount: 1,
      hasMedia: false,
      hasControls: false,
    };
    expect(analyze([vp(375, { sections: [{ ...section, isNav: true }] })])).toEqual([]);
    expect(analyze([vp(375, { sections: [section] })]).map((f) => f.id)).toEqual([
      "orphan-section",
    ]);
  });

  it("merges the same rule across viewports and keeps the worst severity", () => {
    const failing = [{ target: "p.muted", ratio: 4.1, required: 4.5, text: "x" }];
    const findings = analyze([
      vp(375, { contrast: { checked: 5, skipped: 0, failing } }),
      vp(1440, {
        contrast: { checked: 5, skipped: 0, failing: [{ ...failing[0]!, ratio: 2.2 }] },
      }),
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      id: "contrast",
      severity: "serious",
      viewports: [375, 1440],
      targets: ["p.muted"],
    });
  });

  it("drops axe color-contrast in favour of the measured contrast check", () => {
    const axe = [
      {
        id: "color-contrast",
        impact: "serious" as const,
        help: "c",
        helpUrl: "",
        targets: ["p"],
        count: 1,
      },
      {
        id: "image-alt",
        impact: "critical" as const,
        help: "Images must have alt text",
        helpUrl: "u",
        targets: ["img"],
        count: 2,
      },
    ];
    const findings = analyze([vp(375, {}, { axe })]);
    expect(findings.map((f) => f.id)).toEqual(["axe:image-alt"]);
    expect(findings[0]!.count).toBe(2);
  });

  it("grades LCP and CLS against web.dev thresholds", () => {
    const f = analyze([vp(1440, {}, { vitals: { lcp: 4800, cls: 0.15 } })]);
    expect(f.find((x) => x.id === "lcp")?.severity).toBe("serious");
    expect(f.find((x) => x.id === "cls")?.severity).toBe("moderate");
    expect(analyze([vp(1440, {}, { vitals: { lcp: null, cls: null } })])).toEqual([]);
  });

  it("reports console errors and failed requests once", () => {
    const f = analyze([vp(375)], {
      errors: ["TypeError: x is undefined"],
      failedRequests: ["404 /a.png"],
    });
    expect(f.map((x) => x.id)).toEqual(["console-error", "failed-request"]);
  });
});

describe("rank", () => {
  const base: Finding = {
    id: "a",
    category: "layout",
    severity: "minor",
    message: "",
    fix: "",
    viewports: [375],
    targets: [],
    count: 1,
  };
  it("puts severity first, then breadth", () => {
    const ranked = rank([
      { ...base, id: "minor-everywhere", viewports: [375, 768, 1440], count: 50 },
      { ...base, id: "serious-once", severity: "serious" },
      { ...base, id: "serious-everywhere", severity: "serious", viewports: [375, 768, 1440] },
    ]);
    expect(ranked.map((f) => f.id)).toEqual([
      "serious-everywhere",
      "serious-once",
      "minor-everywhere",
    ]);
  });
});

describe("toMarkdown", () => {
  it("stays short: table, top 3 and capped other findings", () => {
    const findings = analyze([
      vp(375, {
        overflow: { px: 12, offenders: ["pre"] },
        orphanItems: [{ target: "ul", perRow: 3, lastRow: 1 }],
      }),
    ]);
    const report: QaReport = {
      target: "index.html",
      url: "http://127.0.0.1:1/",
      createdAt: "2026-01-01T00:00:00.000Z",
      viewports: [vp(375)],
      console: { errors: [], failedRequests: [] },
      findings,
      top: findings.slice(0, 3),
      score: score(findings),
      passed: passed(findings),
    };
    const md = toMarkdown(report);
    expect(md).toContain("**FAIL**");
    expect(md).toContain("## Top 3 fixes");
    expect(md).toContain("1. **[serious] overflow-x**");
    expect(md.split("\n").length).toBeLessThan(40);
  });
});

describe("serveStatic", () => {
  it("serves a folder and refuses paths outside it", async () => {
    const dir = mkdtempSync(join(tmpdir(), "uxqa-"));
    writeFileSync(join(dir, "index.html"), "<h1>hi</h1>");
    writeFileSync(join(dir, "about.html"), "<h1>about</h1>");
    const server = await serveStatic(dir);
    try {
      expect(await (await fetch(server.url)).text()).toBe("<h1>hi</h1>");
      expect(await (await fetch(`${server.url}about`)).text()).toBe("<h1>about</h1>");
      expect((await fetch(`${server.url}..%2F..%2Fetc%2Fpasswd`)).status).toBe(403);
      expect((await fetch(`${server.url}missing.png`)).status).toBe(404);
    } finally {
      await server.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("qaCommand", () => {
  it("prints help and fails without a target", async () => {
    const out: string[] = [];
    expect(await qaCommand([], (s) => out.push(s))).toBe(1);
    expect(out.join("")).toContain("ux-sting qa <url|path>");
  });
  it("refuses cloud metadata endpoints before launching a browser", async () => {
    await expect(qaCommand(["http://169.254.169.254/latest"], () => {})).rejects.toThrow(
      /metadata/i,
    );
  });
});

describe("taste (anti-slop)", () => {
  const clean = {
    purpleGradients: [],
    gradientText: [],
    emojiIcons: [],
    genericCopy: [],
    fakeStats: [],
    lorem: false,
    glass: 0,
    centeredHeroCards: null,
    numbers: { cells: 0, misaligned: 0, proportional: 0 },
  };
  it("is silent on a clean page", () => {
    expect(analyze([vp(1440, {}, { taste: clean })])).toEqual([]);
  });
  it("flags generic AI-page patterns without ever failing the run", () => {
    const findings = analyze([
      vp(
        1440,
        {},
        {
          taste: {
            ...clean,
            purpleGradients: ["section.hero"],
            emojiIcons: [{ target: "h3", text: "🚀 Fast" }],
            genericCopy: ["seamless"],
            fakeStats: ["10,000+ teams"],
            lorem: true,
            glass: 6,
            centeredHeroCards: "section.cards",
            numbers: { cells: 8, misaligned: 8, proportional: 0 },
          },
        },
      ),
    ]);
    expect(findings.map((f) => f.id).sort()).toEqual([
      "data:numbers-misaligned",
      "slop:centered-hero-3-cards",
      "slop:emoji-icons",
      "slop:generic-copy",
      "slop:glass-everywhere",
      "slop:lorem-ipsum",
      "slop:purple-gradient",
      "slop:unsourced-stats",
    ]);
    expect(findings.every((f) => f.category === "taste")).toBe(true);
    expect(passed(findings)).toBe(true);
  });
});
