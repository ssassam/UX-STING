import { createTheme, themeToCss } from "@ux-sting/themes";
import { brief, briefToDtcg, findStyle, renderBrief, styleRadius } from "./brief.js";
import { briefCommand, searchCommand } from "./command.js";
import { DOMAINS, load, stats } from "./data.js";
import { search, tokenize } from "./search.js";

describe("catalog data", () => {
  it("ships every domain with records", () => {
    const counts = stats();
    for (const d of DOMAINS) expect(counts[d]).toBeGreaterThan(10);
    expect(counts.products).toBe(counts.reasoning);
    expect(counts.products).toBe(counts.colors);
  });

  it("lines up products, reasoning and palettes 1:1", () => {
    const reasoning = new Set(load("reasoning").map((r) => r.uiCategory));
    const colors = new Set(load("colors").map((c) => c.productType));
    for (const p of load("products")) {
      expect(reasoning.has(p.productType)).toBe(true);
      expect(colors.has(p.productType)).toBe(true);
    }
  });

  it("has valid hex colors in every palette", () => {
    for (const c of load("colors"))
      for (const v of [c.primary, c.onPrimary, c.background, c.foreground])
        expect(v).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("search", () => {
  it("tokenizes with light stemming and stop words", () => {
    expect(tokenize("Build my dashboards for the SaaS")).toEqual(["dashboard", "saas"]);
  });

  it("ranks the obvious match first", () => {
    expect(search("styles", "glassmorphism frosted blur")[0]?.record.styleCategory).toBe(
      "Glassmorphism",
    );
    expect(search("charts", "trend over time")[0]?.record.bestChartType).toBe("Line Chart");
  });

  it("filters stacks and hides deprecated styles", () => {
    const hits = search("stacks", "image loading", { stack: "nextjs", limit: 10 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h.record.stack === "nextjs")).toBe(true);
    expect(
      search("styles", "hero centric", { limit: 50 }).some((h) => h.record.status === "deprecated"),
    ).toBe(false);
  });
});

describe("brief", () => {
  it("maps an idea to a full design system", () => {
    const b = brief("beauty spa booking");
    expect(b.product.productType).toMatch(/Spa/);
    expect(b.style?.styleCategory).toBe("Soft UI Evolution");
    expect(b.palette?.primary).toMatch(/^#/);
    expect(b.typography?.headingFont).toBeTruthy();
    expect(b.landing?.patternName).toBeTruthy();
    expect(b.antiPatterns.length).toBeGreaterThan(0);
  });

  it("builds a UX-STING theme that renders to CSS", () => {
    const b = brief("crypto exchange dashboard", { name: "vault" });
    expect(b.theme?.config.name).toBe("vault");
    const css = themeToCss(createTheme(b.theme!.config));
    expect(css).toContain('[data-ui-theme="vault"]');
    expect(css).toContain("--ui-primary");
  });

  it("honours a forced style and reads its radius", () => {
    const b = brief("bakery", { style: "neubrutalism" });
    expect(b.style?.styleCategory).toBe("Neubrutalism");
    expect(findStyle("Glassmorphism")?.styleCategory).toBe("Glassmorphism");
    expect(
      styleRadius({ styleCategory: "x", designSystemVariables: "--border-radius: 14px" }),
    ).toBe("14px");
  });

  it("emits DTCG the theme importer understands", () => {
    const doc = briefToDtcg(brief("law firm")) as Record<string, Record<string, unknown>>;
    expect(Object.keys(doc.color!)).toEqual(
      expect.arrayContaining(["background", "primary", "foreground"]),
    );
    expect(doc.font).toBeDefined();
  });

  it("renders Markdown with the checklist", () => {
    const md = renderBrief(brief("saas analytics", { stack: "react" }));
    expect(md).toContain("## Colors");
    expect(md).toContain("## react guidelines");
    expect(md).toContain("ux-sting qa");
  });
});

describe("commands", () => {
  it("prints help without a query", async () => {
    const out: string[] = [];
    expect(await briefCommand([], (l) => out.push(l))).toBe(1);
    expect(out.join("\n")).toContain("ux-sting brief");
  });

  it("searches a domain and rejects unknown ones", async () => {
    const out: string[] = [];
    expect(await searchCommand(["typography", "elegant", "luxury"], (l) => out.push(l))).toBe(0);
    expect(out[0]).toMatch(/^## /);
    expect(await searchCommand(["nope", "x"], () => {})).toBe(1);
  });
});
