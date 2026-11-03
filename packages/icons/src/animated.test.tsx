import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AnimatedArrowRightIcon,
  AnimatedCheckIcon,
  AnimatedIcon,
  ICON_ANCHOR_CLASS,
  withIconMotion,
} from "./animated.js";
import { BellIcon } from "./index.js";

describe("animated icons", () => {
  it("stays decorative by default and keeps the base icon classes", () => {
    const { container } = render(<AnimatedIcon icon={BellIcon} preset="ring" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("ui-icon", "ui-icon-bell", "ui-icon-anim");
    expect(svg).toHaveAttribute("data-ico-anim", "ring");
    expect(svg).toHaveAttribute("data-ico-trigger", "hover");
  });

  it("is labelled when given a title", () => {
    render(<AnimatedIcon icon={BellIcon} title="Notifications" trigger="in" />);
    const svg = screen.getByRole("img", { name: "Notifications" });
    expect(svg).toHaveAttribute("data-ico-trigger", "in");
  });

  it("merges a custom className and forwards props", () => {
    const { container } = render(<AnimatedIcon icon={BellIcon} className="ml-2" size={20} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("ui-icon-anim", "ml-2");
    expect(svg).toHaveAttribute("width", "20");
  });

  it("binds a preset through withIconMotion and allows per-instance overrides", () => {
    const AnimatedBell = withIconMotion(BellIcon, "ring", "hover", "bell");
    const { container } = render(<AnimatedBell preset="beat" />);
    expect(container.querySelector("svg")).toHaveAttribute("data-ico-anim", "beat");
  });

  it("ships flagship components with their intent preset", () => {
    const { container } = render(
      <div>
        <AnimatedArrowRightIcon />
        <AnimatedCheckIcon />
      </div>,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs[0]).toHaveClass("ui-icon-arrow-right");
    expect(svgs[0]).toHaveAttribute("data-ico-anim", "nudge");
    expect(svgs[1]).toHaveAttribute("data-ico-anim", "draw");
    expect(svgs[1]).toHaveAttribute("data-ico-trigger", "in");
  });

  it("exports the anchor class used by the stylesheet", () => {
    expect(ICON_ANCHOR_CLASS).toBe("us-ico-anchor");
  });
});
