import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProvider } from "../test-utils.js";
import {
  AnimatedNumber,
  DotPattern,
  Grain,
  GridPattern,
  ImageComparison,
  Marquee,
  MeshGradient,
  ProgressiveBlur,
  Reveal,
  RotatingText,
  ScrollProgress,
  Spotlight,
  TextEffect,
  TextShimmer,
  Tilt,
  Typewriter,
} from "../index.js";

function mockReducedMotion(reduce: boolean) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

afterEach(() => vi.useRealTimers());

describe("TextEffect", () => {
  it("reads the sentence once and staggers hidden pieces", async () => {
    const { container } = render(
      <TextEffect as="h1" per="word" preset="blur" stagger={80}>
        Design with intent
      </TextEffect>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Design with intent");
    const pieces = container.querySelectorAll(".ui-text-effect-piece");
    expect(pieces).toHaveLength(3);
    expect((pieces[2] as HTMLElement).style.getPropertyValue("--ui-i")).toBe("2");
    expect(pieces[0]!.closest("[aria-hidden]")).not.toBeNull();
    expect(container.firstElementChild).toHaveAttribute("data-preset", "blur");
    await expectNoA11yViolations(container);
  });

  it("splits per character but keeps words together", () => {
    const { container } = render(<TextEffect per="char">Hi you</TextEffect>);
    expect(container.querySelectorAll(".ui-text-effect-piece")).toHaveLength(5);
    expect(container.querySelectorAll(".whitespace-nowrap")).toHaveLength(2);
  });

  it("TextShimmer renders its children", () => {
    render(<TextShimmer>Generating…</TextShimmer>);
    expect(screen.getByText("Generating…")).toHaveClass("ui-text-shimmer");
  });
});

describe("RotatingText", () => {
  it("cycles words and exposes the full list once", () => {
    vi.useFakeTimers();
    const { container } = render(
      <RotatingText words={["fast", "safe", "yours"]} interval={1000} />,
    );
    expect(screen.getByText("fast, safe, yours")).toHaveClass("sr-only");
    const active = () => container.querySelector("[data-active]")?.textContent;
    expect(active()).toBe("fast");
    act(() => vi.advanceTimersByTime(1000));
    expect(active()).toBe("safe");
    act(() => vi.advanceTimersByTime(2000));
    expect(active()).toBe("fast");
  });

  it("stays on the first word under reduced motion", () => {
    const restore = mockReducedMotion(true);
    vi.useFakeTimers();
    const { container } = render(<RotatingText words={["a", "b"]} interval={500} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(container.querySelector("[data-active]")?.textContent).toBe("a");
    restore();
  });
});

describe("Typewriter", () => {
  it("types the text and reserves space for it", () => {
    vi.useFakeTimers();
    const { container } = render(<Typewriter text="Hello" speed={10} />);
    expect(screen.getByText("Hello", { selector: ".sr-only" })).toBeInTheDocument();
    expect(container.querySelector(".ui-typewriter-ghost")).toHaveTextContent("Hello");
    const tick = (times: number) => {
      for (let i = 0; i < times; i++) act(() => vi.advanceTimersByTime(10));
    };
    tick(3);
    expect(container.querySelector(".ui-typewriter-text")).toHaveTextContent(/^Hel$/);
    tick(10);
    expect(container.querySelector(".ui-typewriter-text")).toHaveTextContent(/^Hello$/);
  });

  it("shows the full text under reduced motion", () => {
    const restore = mockReducedMotion(true);
    const { container } = render(<Typewriter text="Instant" />);
    expect(container.querySelector(".ui-typewriter-text")).toHaveTextContent("Instant");
    expect(container.querySelector(".ui-typewriter-caret")).toBeNull();
    restore();
  });
});

describe("AnimatedNumber", () => {
  it("announces the final formatted value", () => {
    renderWithProvider(
      <AnimatedNumber value={1234.5} format={{ style: "currency", currency: "EUR" }} />,
      { providerProps: { locale: "fr" } },
    );
    expect(screen.getByText(/1\s234,50\s€/, { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("jumps to the value under reduced motion", () => {
    const restore = mockReducedMotion(true);
    const { container } = render(<AnimatedNumber value={42} />);
    expect(container.querySelector("[aria-hidden]")).toHaveTextContent("42");
    restore();
  });
});

describe("Reveal", () => {
  it("marks content visible (no IntersectionObserver falls back to visible)", async () => {
    const { container } = render(
      <Reveal as="section" aria-label="Features" stagger={80}>
        <p>One</p>
        <p>Two</p>
      </Reveal>,
    );
    const section = screen.getByRole("region", { name: "Features" });
    expect(section).toHaveAttribute("data-visible");
    expect(section).toHaveAttribute("data-stagger");
    expect(section.style.getPropertyValue("--ui-reveal-stagger")).toBe("80ms");
    await expectNoA11yViolations(container);
  });
});

describe("Marquee", () => {
  it("renders items once for assistive tech and can be paused", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(
      <Marquee label="Customer logos">
        <a href="/a">Acme</a>
        <a href="/b">Globex</a>
      </Marquee>,
    );
    const region = screen.getByRole("region", { name: "Customer logos" });
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(container.querySelector(".ui-marquee-clone")).toHaveAttribute("inert");
    await user.click(screen.getByRole("button", { name: "Pause animation" }));
    expect(region).toHaveAttribute("data-paused");
    expect(screen.getByRole("button", { name: "Play animation" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("can hide the control", () => {
    renderWithProvider(
      <Marquee label="Tags" controls={false}>
        <span>One</span>
      </Marquee>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("ScrollProgress", () => {
  it("is a decorative bar pinned to the top", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar).toHaveAttribute("aria-hidden");
    expect(bar).toHaveClass("ui-scroll-progress", "fixed");
  });
});

describe("Spotlight and Tilt", () => {
  it("track the mouse but ignore touch", () => {
    render(
      <>
        <Spotlight data-testid="spot">Card</Spotlight>
        <Tilt data-testid="tilt" max={10}>
          Media
        </Tilt>
      </>,
    );
    const spot = screen.getByTestId("spot");
    fireEvent.pointerMove(spot, { clientX: 30, clientY: 40, pointerType: "mouse" });
    expect(spot.style.getPropertyValue("--ui-spotlight-x")).toBe("30px");
    fireEvent.pointerMove(spot, { clientX: 99, clientY: 99, pointerType: "touch" });
    expect(spot.style.getPropertyValue("--ui-spotlight-x")).toBe("30px");

    const tilt = screen.getByTestId("tilt");
    fireEvent.pointerMove(tilt, { clientX: 0, clientY: 0, pointerType: "mouse" });
    fireEvent.pointerLeave(tilt);
    expect(tilt.style.getPropertyValue("--ui-tilt-x")).toBe("0deg");
  });
});

describe("ImageComparison", () => {
  it("is a labelled native slider, controlled or not", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithProvider(
      <ImageComparison
        before={<img src="/before.jpg" alt="Kitchen before renovation" />}
        after={<img src="/after.jpg" alt="Kitchen after renovation" />}
        defaultValue={40}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Compare images" });
    expect(slider).toHaveValue("40");
    expect(slider).toHaveAttribute("aria-valuetext", "40%");
    fireEvent.change(slider, { target: { value: "70" } });
    expect(onValueChange).toHaveBeenCalledWith(70);
    const root = container.querySelector<HTMLElement>(".ui-image-comparison")!;
    expect(root.style.getPropertyValue("--ui-compare")).toBe("70%");
    expect(screen.getByText("Before")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("mirrors in RTL and localizes captions", () => {
    const { container } = renderWithProvider(
      <ImageComparison before={<span>a</span>} after={<span>b</span>} afterLabel={null} />,
      { providerProps: { locale: "ar" } },
    );
    expect(container.querySelector(".ui-image-comparison")).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("قبل")).toBeInTheDocument();
    expect(screen.queryByText("بعد")).toBeNull();
  });
});

describe("Backgrounds", () => {
  it("are decorative token-colored layers", async () => {
    const { container } = render(
      <div className="relative isolate">
        <MeshGradient tones={["primary", "success"]} animate />
        <DotPattern size={16} />
        <GridPattern fade={false} />
        <Grain opacity={0.1} />
        <ProgressiveBlur side="top" />
        <p>Content</p>
      </div>,
    );
    const layers = container.querySelectorAll("[aria-hidden]");
    expect(layers).toHaveLength(5);
    const mesh = layers[0] as HTMLElement;
    expect(mesh.style.backgroundImage).toContain("var(--ui-success)");
    expect(mesh).toHaveAttribute("data-animate");
    expect(layers[2]).not.toHaveAttribute("data-fade");
    await expectNoA11yViolations(container);
  });
});
