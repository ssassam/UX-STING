import { render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fadeUp, useScrollReveal, useSplitHeading, type ScrollRevealOptions } from "./index.js";

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

function RevealDemo({ options }: { options?: ScrollRevealOptions }) {
  const scope = useRef<HTMLDivElement>(null);
  useScrollReveal(scope, options);
  return (
    <div ref={scope}>
      <p data-reveal>one</p>
      <p data-reveal>two</p>
    </div>
  );
}

function HeadingDemo({ type }: { type?: "lines" | "words" | "chars" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useSplitHeading(ref, { type });
  return <h1 ref={ref}>Book the trip</h1>;
}

// anime.js's text splitter waits for web fonts through document.fonts, which
// jsdom does not implement. Browsers always have it, so stub the minimum here.
if (!("fonts" in document)) {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: {
      status: "loaded",
      ready: Promise.resolve(),
      addEventListener() {},
      removeEventListener() {},
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useScrollReveal", () => {
  it("hides revealable elements until they enter when motion is allowed", () => {
    setReduced(false);
    const { container } = render(<RevealDemo />);
    const [first, second] = Array.from(container.querySelectorAll<HTMLElement>("p"));
    expect(first!.style.opacity).toBe("0");
    expect(second!.style.opacity).toBe("0");
  });

  it("never hides content under reduced motion", () => {
    setReduced(true);
    const { container } = render(<RevealDemo />);
    for (const p of container.querySelectorAll<HTMLElement>("p")) {
      expect(p.style.opacity).toBe("");
      expect(p.style.transform).toBe("");
    }
  });

  it("reverts its inline styles on unmount", () => {
    setReduced(false);
    const { container, unmount } = render(<RevealDemo />);
    const first = container.querySelector<HTMLElement>("p")!;
    expect(first.style.opacity).toBe("0");
    unmount();
    expect(first.style.opacity).toBe("");
    expect(first.style.transform).toBe("");
  });
});

describe("useSplitHeading", () => {
  it("splits words, then restores the original markup on unmount", () => {
    setReduced(false);
    const { container, unmount } = render(<HeadingDemo />);
    const h1 = container.querySelector("h1")!;
    expect(h1.querySelectorAll("span").length).toBeGreaterThan(0);
    unmount();
    expect(h1.textContent).toBe("Book the trip");
    expect(h1.querySelectorAll("span")).toHaveLength(0);
  });

  it("leaves the heading untouched under reduced motion", () => {
    setReduced(true);
    const { container } = render(<HeadingDemo type="chars" />);
    const h1 = container.querySelector("h1")!;
    expect(h1.querySelectorAll("span")).toHaveLength(0);
    expect(h1.textContent).toBe("Book the trip");
  });
});

describe("fadeUp", () => {
  it("jumps to the final state under reduced motion", () => {
    setReduced(true);
    const el = document.createElement("div");
    document.body.append(el);
    fadeUp(el);
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("translateY(0px)");
  });

  it("sets the hidden start state when motion is allowed", () => {
    setReduced(false);
    const el = document.createElement("div");
    document.body.append(el);
    const anim = fadeUp(el, { y: 30 });
    expect(el.style.opacity).toBe("0");
    expect(anim).toBeDefined();
    anim.cancel();
  });
});
