import { describe, expect, it } from "vitest";
import ember from "./__fixtures__/ember-observation.json";
import {
  applyFixes,
  checkTargetUrl,
  compareDna,
  compareImages,
  contrast,
  deltaE,
  dnaFromDirection,
  dnaFromObservation,
  dnaToCss,
  dnaToDtcg,
  dnaToUxStingTheme,
  ensureContrast,
  generatePage,
  isPrivateAddress,
  parseColor,
  planDirections,
  proposeFixes,
  remixDna,
  scoreDirection,
  validateDna,
  type Brief,
  type PageContent,
  type PageObservation,
} from "./index.js";

const observation = ember as unknown as PageObservation;

const brief: Brief = {
  name: "Atelier Noor",
  industry: "beauty salon and hammam",
  audience: "women in Marrakech",
  goals: ["bookings", "trust"],
  tone: ["refined", "warm", "calm"],
  language: "fr",
  avoid: ["dark"],
  sections: [
    { id: "accueil", role: "hero", media: true },
    { id: "soins", role: "list", items: 5 },
    { id: "reserver", role: "cta" },
  ],
};

const content: PageContent = {
  lang: "fr",
  title: "Atelier Noor",
  description: "Salon de beauté à Marrakech",
  siteName: "Atelier Noor",
  nav: [
    { label: "Soins", href: "#soins" },
    { label: "Évil", href: "javascript:alert(1)" },
  ],
  sections: [
    {
      id: "accueil",
      heading: "Le temps d'un rituel",
      body: "Hammam & soins",
      action: { label: "Réserver", href: "#reserver" },
      media: { alt: "Cabine de soin" },
    },
    {
      id: "soins",
      heading: "Soins",
      items: [
        { title: "Hammam", meta: "60 min" },
        { title: "Visage" },
        { title: "<b>Massage</b>" },
      ],
    },
    { id: "reserver", heading: "Réserver" },
  ],
};

describe("color", () => {
  it("parses, measures contrast and distance", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("rgba(0, 0, 0, 0.5)")?.a).toBe(0.5);
    expect(parseColor("oklch(0.5 0.1 200)")).toBeNull();
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(deltaE("#ff0000", "#ff0000")).toBe(0);
    expect(contrast(ensureContrast("#999999", "#ffffff"), "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("observation → DNA", () => {
  const dna = dnaFromObservation(observation, { authorized: true });

  it("measures the Ember reference", () => {
    expect(dna.color.scheme).toBe("dark");
    expect(dna.color.accent).toBe("#ca8200");
    expect(dna.typography.scale.steps.display).toBe(72);
    expect(dna.layout.container).toBe(1232);
    expect(dna.layout.sections[0]?.role).toBe("navigation");
    expect(dna.layout.sections[1]?.role).toBe("hero");
    expect(dna.layout.sections.at(-1)?.role).toBe("footer");
    expect(dna.sources[0]).toMatchObject({ kind: "url", authorized: true });
  });

  it("separates observed from inferred values", () => {
    expect(dna.provenance["color.background"]?.source).toBe("observed");
    expect(dna.provenance["layout.sections"]?.source).toBe("inferred");
    expect(dna.provenance["personality"]?.source).toBe("inferred");
    expect(dna.provenance["typography.scale.ratio"]?.confidence).toBeLessThan(0.9);
  });

  it("never picks a colored text as the muted color", () => {
    expect(dna.color.muted).not.toBe("#ff8e87");
  });
});

describe("planning original directions", () => {
  const directions = planDirections(brief, 3);

  it("returns three directions that differ on at least two axes", () => {
    expect(directions).toHaveLength(3);
    for (const [i, a] of directions.entries())
      for (const b of directions.slice(i + 1))
        expect(
          Number(a.type !== b.type) +
            Number(a.palette !== b.palette) +
            Number(a.composition !== b.composition),
        ).toBeGreaterThanOrEqual(2);
    expect(directions[0]!.score).toBeGreaterThanOrEqual(directions[2]!.score);
    expect(directions[0]!.rationale.length).toBeGreaterThan(0);
  });

  it("respects things the brief asks to avoid", () => {
    expect(directions.every((d) => d.palette !== "dark-field")).toBe(true);
  });

  it("builds accessible DNA with content-driven sections", () => {
    const dna = dnaFromDirection(brief, directions[0]!);
    expect(dna.mode).toBe("original");
    expect(dna.layout.sections.map((s) => s.id)).toEqual(["accueil", "soins", "reserver"]);
    expect(validateDna(dna).filter((i) => i.severity === "error")).toEqual([]);
    expect(dna.provenance.color?.source).toBe("brief");
  });

  it("penalises the generic AI landing page", () => {
    const generic: Brief = {
      ...brief,
      industry: "B2B SaaS platform",
      tone: ["modern"],
      goals: ["sign up"],
      avoid: [],
    };
    const defaultLook = scoreDirection(generic, "grotesk-tight", "stark-mono", "clear-conversion");
    const alternative = scoreDirection(generic, "grotesk-tight", "stark-mono", "dense-utility");
    expect(defaultLook.risks.join(" ")).toMatch(/generic AI/);
    expect(alternative.risks.join(" ")).not.toMatch(/generic AI/);
  });
});

describe("generation", () => {
  const dna = dnaFromDirection(brief, planDirections(brief, 1)[0]!);
  const page = generatePage(dna, content);

  it("renders a semantic, single-h1 page in the content language", () => {
    expect(page.html).toMatch(/<html lang="fr" dir="ltr">/);
    expect(page.html.match(/<h1\b/g)).toHaveLength(1);
    expect(page.html).toContain('<a class="skip" href="#main">');
    expect(page.html).toContain('<main id="main"');
    expect(page.html).toContain('<nav aria-label="Main">');
    expect(page.html).toContain('aria-labelledby="accueil-h"');
  });

  it("escapes content and refuses unsafe links", () => {
    expect(page.html).toContain("&lt;b&gt;Massage&lt;/b&gt;");
    expect(page.html).not.toContain("javascript:");
  });

  it("lays out the same content differently per direction", () => {
    const [a, b] = planDirections(brief, 3);
    const one = generatePage(dnaFromDirection(brief, a!), content).html;
    const other = generatePage(dnaFromDirection(brief, b!), content).html;
    const layouts = (html: string) =>
      [...html.matchAll(/layout--([a-z-]+)/g)].map((m) => m[1]).join();
    expect(layouts(one) !== layouts(other) || one !== other).toBe(true);
  });

  it("exports tokens for CSS, DTCG and UX-STING themes", () => {
    expect(dnaToCss(dna)).toMatch(/--ui-primary: #[0-9a-f]{6};/);
    expect(dnaToDtcg(dna).color.accent.$type).toBe("color");
    expect(dnaToUxStingTheme(dna).colors.light.primary).toBe(dna.color.accent);
  });
});

describe("comparison and improvement", () => {
  const reference = dnaFromObservation(observation);

  it("scores identical DNA at 100", () => {
    expect(compareDna(reference, reference).score).toBe(100);
  });

  it("compares screenshots pixel by pixel and structurally", () => {
    const solid = (v: number) => ({ width: 16, height: 16, data: new Array(16 * 16 * 4).fill(v) });
    expect(compareImages(solid(200), solid(200))).toMatchObject({ mismatch: 0, heightRatio: 1 });
    expect(compareImages(solid(0), solid(255)).mismatch).toBe(1);
  });

  it("moves type sizes towards the reference and fixes the page padding", () => {
    const measured = structuredClone(reference);
    measured.typography.scale.steps.h1 = 60;
    measured.layout.container = 1184;
    const working = structuredClone(reference);
    const fixes = proposeFixes(working, {
      reference,
      measured,
      fidelity: compareDna(reference, measured),
    });
    expect(fixes.find((f) => f.path === "typography.scale.steps.h1")?.to).toBe(86);
    expect(fixes.find((f) => f.path === "layout.pagePadding")).toBeTruthy();
    const next = applyFixes(working, fixes);
    expect(next.typography.scale.steps.h1).toBe(86);
    expect(next.provenance["typography.scale.steps.h1"]?.source).toBe("edited");
    expect(working.typography.scale.steps.h1).toBe(reference.typography.scale.steps.h1);
  });

  it("always fixes contrast first and never pads a section past the section gap", () => {
    const bad = structuredClone(reference);
    bad.color.muted = bad.color.background;
    const measured = structuredClone(reference);
    measured.layout.sections.forEach((s) => (s.heightPx = 50));
    const fixes = proposeFixes(bad, {
      reference,
      measured,
      fidelity: compareDna(reference, measured),
    });
    expect(fixes[0]).toMatchObject({ kind: "accessibility", path: "color.muted" });
    for (const f of fixes.filter((x) => x.path.endsWith("paddingBlock")))
      expect(f.to).toBeLessThanOrEqual(bad.layout.sectionGap);
  });

  it("shrinks a cramped mobile headline", () => {
    const dna = dnaFromDirection(brief, planDirections(brief, 1)[0]!);
    const fixes = proposeFixes(dna, {
      qa: [{ viewport: 390, overflowX: 0, overflowing: [], a11y: [], cramped: ['h1 "Le temps"'] }],
    });
    expect(fixes[0]).toMatchObject({ kind: "layout", path: "typography.scale.mobileDisplay" });
    expect(Number(fixes[0]!.to)).toBeLessThanOrEqual(41);
  });

  it("remixes facets and re-checks contrast", () => {
    const original = dnaFromDirection(brief, planDirections(brief, 1)[0]!);
    const mixed = remixDna(original, [{ dna: reference, take: ["color"] }]);
    expect(mixed.mode).toBe("remix");
    expect(mixed.color.accent).toBe(reference.color.accent);
    expect(mixed.layout.sections).toEqual(original.layout.sections);
    expect(mixed.provenance.color?.source).toBe("remix");
    expect(contrast(mixed.color.muted, mixed.color.background)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("target safety", () => {
  it("blocks private, local and metadata targets unless allowlisted", () => {
    for (const ip of [
      "127.0.0.1",
      "10.1.2.3",
      "172.20.0.1",
      "192.168.1.1",
      "169.254.169.254",
      "100.64.0.1",
      "::1",
      "fd12::1",
      "fe80::1",
      "::ffff:127.0.0.1",
    ])
      expect(isPrivateAddress(ip)).toBe(true);
    expect(isPrivateAddress("93.184.216.34")).toBe(false);
    expect(checkTargetUrl("http://localhost:4100/").ok).toBe(false);
    expect(
      checkTargetUrl("http://localhost:4100/", { allowHosts: ["localhost:4100"] }),
    ).toMatchObject({ ok: true, allowlisted: true });
    expect(checkTargetUrl("http://localhost:5000/", { allowHosts: ["localhost:4100"] }).ok).toBe(
      false,
    );
    expect(
      checkTargetUrl("http://169.254.169.254/latest", { allowHosts: ["169.254.169.254:80"] }).ok,
    ).toBe(false);
    expect(checkTargetUrl("file:///etc/passwd").ok).toBe(false);
    expect(checkTargetUrl("https://user:pw@example.org/").ok).toBe(false);
    expect(checkTargetUrl("https://ux-sting.example.org/").ok).toBe(true);
  });
});
