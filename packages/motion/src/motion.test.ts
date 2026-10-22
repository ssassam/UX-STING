import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  TRANSITIONS,
  animateSize,
  flip,
  popNumber,
  reorder,
  tokenDuration,
  trackIndicator,
} from "./index.js";
import { countUp, fadeUp } from "./gsap/presets.js";

const cssDir = new URL("../css/", pathToFileURL(`${__dirname}/`));
const css = Object.fromEntries(
  readdirSync(cssDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => [f.replace(/\.css$/, ""), readFileSync(new URL(f, cssDir), "utf8")]),
);

const setReduced = (reduce: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (q: string) =>
      ({
        matches: reduce && q.includes("reduce"),
        media: q,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  );

const rect = (el: Element, r: { left?: number; top?: number; width?: number; height?: number }) => {
  const full = { left: 0, top: 0, width: 100, height: 20, ...r };
  el.getBoundingClientRect = () =>
    ({ ...full, right: full.left + full.width, bottom: full.top + full.height }) as DOMRect;
};

const mockAnimate = (el: Element) => {
  const calls: Keyframe[][] = [];
  (el as HTMLElement).animate = ((frames: Keyframe[]) => {
    calls.push(frames);
    return { finished: Promise.resolve() } as unknown as Animation;
  }) as HTMLElement["animate"];
  return calls;
};

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("CSS catalog", () => {
  it("ships one file per transition", () => {
    expect(Object.keys(css).sort()).toEqual([...TRANSITIONS].sort());
  });

  it.each(TRANSITIONS)("%s respects reduced motion, tokens and logical properties", (name) => {
    const src = css[name]!;
    expect(src).toContain("prefers-reduced-motion");
    expect(src).toMatch(/var\(--ui-(duration|ease)/);
    // No physical directions (RTL) and no raw colors.
    expect(src).not.toMatch(/\b(margin|padding|border)-(left|right)\b|[^-]\b(left|right)\s*:/);
    expect(src).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i);
  });
});

describe("core helpers", () => {
  it("tokenDuration reads ms and s tokens with a fallback", () => {
    const el = document.createElement("div");
    el.style.setProperty("--a", "120ms");
    el.style.setProperty("--b", "0.45s");
    document.body.append(el);
    expect(tokenDuration(el, "--a")).toBe(120);
    expect(tokenDuration(el, "--b")).toBe(450);
    expect(tokenDuration(el, "--missing", 77)).toBe(77);
  });

  it("flip animates moved elements from their old box and fades in new ones", async () => {
    setReduced(false);
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.append(a);
    rect(a, { top: 0 });
    const calls = mockAnimate(a);
    const callsB = mockAnimate(b);
    await flip(
      () => document.body.children,
      () => {
        document.body.prepend(b);
        rect(a, { top: 40 });
        rect(b, { top: 0 });
      },
    );
    expect(calls[0]?.[0]?.transform).toBe("translate(0px, -40px) scale(1, 1)");
    expect(callsB[0]).toEqual([{ opacity: 0 }, { opacity: 1 }]);
  });

  it("flip, animateSize and reorder only mutate under reduced motion", async () => {
    setReduced(true);
    const el = document.createElement("div");
    document.body.append(el);
    const calls = mockAnimate(el);
    const mutate = vi.fn();
    await flip([el], mutate);
    await animateSize(el, mutate);
    await reorder(document.body, mutate);
    expect(mutate).toHaveBeenCalledTimes(3);
    expect(calls).toHaveLength(0);
  });

  it("animateSize tweens between measured sizes and restores overflow", async () => {
    setReduced(false);
    const el = document.createElement("div");
    el.style.overflow = "auto";
    rect(el, { height: 100 });
    const calls = mockAnimate(el);
    await animateSize(el, () => rect(el, { height: 240 }));
    expect(calls[0]).toEqual([
      { height: "100px", width: "100px" },
      { height: "240px", width: "100px" },
    ]);
    expect(el.style.overflow).toBe("auto");
  });

  it("reorder names items for a View Transition and clears the names after", async () => {
    setReduced(false);
    const list = document.createElement("ul");
    list.innerHTML = '<li data-key="a b"></li><li id="z"></li>';
    document.body.append(list);
    const seen: string[] = [];
    (document as Document & { startViewTransition?: unknown }).startViewTransition = (
      update: () => Promise<void>,
    ) => {
      seen.push(
        ...Array.from(list.children, (li) =>
          (li as HTMLElement).style.getPropertyValue("view-transition-name"),
        ),
      );
      return { finished: update() };
    };
    await reorder(list, () => list.append(list.firstElementChild!));
    delete (document as Document & { startViewTransition?: unknown }).startViewTransition;
    expect(seen).toEqual(["us-a_b", "us-z"]);
    expect(
      (list.firstElementChild as HTMLElement).style.getPropertyValue("view-transition-name"),
    ).toBe("");
  });

  it("popNumber sets text and restarts data-pop", () => {
    const el = document.createElement("span");
    popNumber(el, "1,204");
    expect(el.textContent).toBe("1,204");
    expect(el.hasAttribute("data-pop")).toBe(true);
  });

  it("trackIndicator measures the selected tab from inline-start, LTR and RTL", () => {
    const list = document.createElement("div");
    list.innerHTML =
      '<button role="tab" aria-selected="false"></button><button role="tab" aria-selected="true"></button>';
    document.body.append(list);
    rect(list, { left: 10, width: 300 });
    rect(list.children[1]!, { left: 110, width: 80 });
    const stop = trackIndicator(list);
    expect(list.style.getPropertyValue("--us-indicator-start")).toBe("100px");
    expect(list.style.getPropertyValue("--us-indicator-size")).toBe("80px");
    expect(list.hasAttribute("data-us-indicator")).toBe(true);
    stop();
    expect(list.hasAttribute("data-us-indicator")).toBe(false);

    list.dir = "rtl";
    list.style.direction = "rtl";
    trackIndicator(list)();
    // right edge of list 310 − right edge of tab 190
    expect(list.style.getPropertyValue("--us-indicator-start")).toBe("120px");
  });
});

describe("GSAP presets", () => {
  it("jump to the end state under reduced motion", () => {
    setReduced(true);
    const el = document.createElement("div");
    document.body.append(el);
    const tween = fadeUp(el);
    expect(tween.progress()).toBe(1);
    const n = document.createElement("strong");
    countUp(n, 1234, { format: new Intl.NumberFormat("en-US") });
    expect(n.textContent).toBe("1,234");
    expect(n.getAttribute("aria-label")).toBe("1,234");
  });

  it("animate when motion is allowed", () => {
    setReduced(false);
    const el = document.createElement("div");
    document.body.append(el);
    const tween = fadeUp(el);
    expect(tween.progress()).toBeLessThan(1);
    tween.kill();
  });
});
