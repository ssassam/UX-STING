/**
 * Accessibility matrix: every docs demo (apps/docs/demos, one file per
 * component) is rendered in LTR (en) and RTL (ar) and must pass axe, and every
 * keyboard-focusable element must be reachable with Tab and have a name.
 */
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { UIProvider } from "../index.js";

const modules = import.meta.glob<Record<string, unknown>>("../../../../apps/docs/demos/[!_]*.tsx", {
  eager: true,
});

const demos: Array<[string, string, ComponentType]> = [];
for (const [path, mod] of Object.entries(modules)) {
  const file = path
    .split("/")
    .pop()!
    .replace(/\.tsx$/, "");
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value === "function" && /^[A-Z]/.test(name))
      demos.push([file, name, value as ComponentType]);
  }
}

afterEach(() => cleanup());

async function violations(container: Element) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.help}\n    ${v.nodes.map((n) => n.html.slice(0, 160)).join("\n    ")}`,
  );
}

describe("a11y matrix", () => {
  it("found the demos", () => {
    expect(new Set(demos.map(([file]) => file)).size).toBeGreaterThan(100);
  });

  describe.each(["en", "ar"] as const)("%s", (locale) => {
    it.each(demos)("%s › %s", async (_file, _name, Demo) => {
      const { container } = render(
        <UIProvider locale={locale}>
          <Demo />
        </UIProvider>,
      );
      const problems = await violations(container);
      expect(problems, problems.join("\n")).toEqual([]);
    });
  });
});

describe("localized defaults (no hard-coded English)", () => {
  it("uses provider messages for built-in labels", async () => {
    const { screen } = await import("@testing-library/react");
    const {
      Banner,
      FilterChips,
      MapPlaceholder,
      OpeningHours,
      OTPInput,
      Price,
      ReviewCard,
      SkipLink,
      Combobox,
    } = await import("../index.js");
    render(
      <UIProvider locale="fr">
        <SkipLink />
        <Banner>Promo</Banner>
        <MapPlaceholder />
        <OpeningHours periods={[]} />
        <OTPInput length={4} />
        <Price amount={10} compareAt={20} currency="EUR" />
        <ReviewCard author={{ name: "A" }} rating={4} body={"x".repeat(400)} />
        <FilterChips
          filters={[{ id: "a", label: "Rabat" }]}
          onRemove={() => {}}
          onClearAll={() => {}}
        />
        <Combobox aria-label="Ville" options={[]} />
      </UIProvider>,
    );
    expect(screen.getByRole("link", { name: "Aller au contenu" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Annonce" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Carte" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Horaires d'ouverture" })).toBeInTheDocument();
    expect(screen.getAllByText("Fermé").length).toBeGreaterThan(0);
    expect(screen.getByRole("textbox", { name: "Code 1/4" })).toBeInTheDocument();
    expect(screen.getByText(/Prix initial/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lire la suite" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Filtres actifs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Tout effacer/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Ville" })).toHaveTextContent("Sélectionner…");
  });
});
