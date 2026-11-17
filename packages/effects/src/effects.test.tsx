import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { CountUp, Marquee, SplitText, TiltCard, ScrollProgress } from "./index.js";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("decorative effects", () => {
  it("keeps split text accessible once and marquee paused by default", () => {
    const view = render(
      <>
        <SplitText>Hello world</SplitText>
        <Marquee>
          <a href="/">News</a>
        </Marquee>
      </>,
    );
    expect(view.container.querySelector(".us-fx-sr")?.textContent).toBe("Hello world");
    expect(view.container.querySelector(".us-fx-marquee")?.getAttribute("data-paused")).toBe(
      "true",
    );
    expect(view.container.querySelector("[inert]")?.getAttribute("aria-hidden")).toBe("true");
  });
  it("uses the final number and no movement under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const view = render(
      <>
        <CountUp value={42} />
        <TiltCard>Card</TiltCard>
      </>,
    );
    expect(view.container.querySelector(".us-fx-count .us-fx-sr")?.textContent).toBe("42");
    const card = view.getByText("Card");
    fireEvent.pointerMove(card, { clientX: 30, clientY: 30 });
    expect(card.style.transform).toBe("");
  });
  it("removes scroll listeners and scheduled frames on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const cancel = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancel);
    vi.stubGlobal("requestAnimationFrame", () => 123);
    const view = render(<ScrollProgress />);
    view.unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(cancel).toHaveBeenCalledWith(123);
    remove.mockRestore();
  });
});
