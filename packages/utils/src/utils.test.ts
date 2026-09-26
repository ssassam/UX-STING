import { describe, expect, it } from "vitest";
import {
  cn,
  createVariants,
  formatCurrency,
  formatShortcut,
  fuzzyScore,
  getDirection,
  getThemeScript,
  getNextIndex,
  getPaginationRange,
  matchesShortcut,
  mergeClasses,
  resolveResponsive,
  responsiveVars,
  snapToStep,
} from "./index.js";

describe("cn / mergeClasses", () => {
  it("joins and resolves conflicts", () => {
    expect(mergeClasses("a", false, ["b", { c: true, d: false }])).toBe("a b c");
    expect(cn("px-4 py-2", "px-2")).toBe("py-2 px-2");
    expect(cn("text-sm text-muted-foreground", "text-primary")).toBe("text-sm text-primary");
  });
});

describe("createVariants", () => {
  const button = createVariants({
    base: "btn",
    variants: {
      variant: { default: "bg-primary", outline: "border" },
      size: { sm: "h-8", md: "h-10" },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "default", size: "md" },
    compoundVariants: [{ variant: "outline", size: "sm", className: "border-dashed" }],
  });

  it("applies defaults", () => expect(button()).toBe("btn bg-primary h-10"));
  it("applies variants, booleans and compounds", () => {
    expect(button({ variant: "outline", size: "sm", block: true })).toBe(
      "btn border h-8 w-full border-dashed",
    );
  });
  it("merges className last", () =>
    expect(button({ className: "h-12" })).toBe("btn bg-primary h-12"));
});

describe("keyboard", () => {
  it("navigates with wrap and RTL mirroring", () => {
    expect(getNextIndex("ArrowDown", 2, 3)).toBe(0);
    expect(getNextIndex("ArrowUp", 0, 3, { loop: false })).toBe(0);
    expect(getNextIndex("ArrowRight", 0, 3, { orientation: "horizontal" })).toBe(1);
    expect(getNextIndex("ArrowRight", 1, 3, { orientation: "horizontal", dir: "rtl" })).toBe(0);
    expect(getNextIndex("End", 0, 5)).toBe(4);
    expect(getNextIndex("a", 0, 5)).toBeNull();
  });

  it("matches and formats shortcuts", () => {
    const e = { key: "k", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
    expect(matchesShortcut(e, "mod+k", true)).toBe(true);
    expect(matchesShortcut(e, "mod+k", false)).toBe(false);
    expect(formatShortcut("mod+k", true)).toBe("⌘K");
    expect(formatShortcut("mod+shift+p", false)).toBe("Ctrl+Shift+P");
  });
});

describe("responsive", () => {
  it("creates css vars", () => {
    expect(responsiveVars("cols", 3)).toEqual({ "--cols-base": "3" });
    expect(responsiveVars("cols", { base: 1, md: 2 })).toEqual({
      "--cols-base": "1",
      "--cols-md": "2",
    });
  });
  it("resolves mobile-first", () => {
    expect(resolveResponsive({ base: 1, md: 3 }, "lg")).toBe(3);
    expect(resolveResponsive({ base: 1, md: 3 }, "sm")).toBe(1);
  });
});

describe("format / locale", () => {
  it("detects direction", () => {
    expect(getDirection("ar-MA")).toBe("rtl");
    expect(getDirection("fr-FR")).toBe("ltr");
    expect(getDirection("en")).toBe("ltr");
  });
  it("formats currency per locale", () => {
    expect(formatCurrency(1234.5, "USD", "en-US")).toBe("$1,234.50");
    expect(formatCurrency(1234.5, "EUR", "fr-FR")).toMatch(/1\s?234,50\s?€/);
  });
});

describe("misc", () => {
  it("fuzzy scores", () => {
    expect(fuzzyScore("set", "Settings")).toBeGreaterThan(fuzzyScore("set", "Reset password"));
    expect(fuzzyScore("xyz", "Settings")).toBe(0);
    expect(fuzzyScore("prf", "Profile")).toBeGreaterThan(0);
    expect(fuzzyScore("cafe", "Café")).toBe(1);
  });
  it("snaps to step", () => expect(snapToStep(0.30000004, 0.1)).toBe(0.3));
  it("paginates", () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
  });
});

describe("getThemeScript", () => {
  it("escapes values so they cannot close the script element", () => {
    const js = getThemeScript("</script><script>alert(1)</script>");
    expect(js).not.toContain("</script>");
    expect(js).toContain("\\u003c/script>");
  });
});
