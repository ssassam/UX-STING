import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon.js";
import { SearchIcon } from "./index.js";

describe("icons", () => {
  it("is decorative by default", () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "1em");
  });
  it("is labelled with a title", () => {
    render(<SearchIcon title="Search" size="lg" />);
    const svg = screen.getByRole("img", { name: "Search" });
    expect(svg).toHaveAttribute("width", "var(--ui-icon-lg)");
  });
  it("renders by name", () => {
    const { container } = render(<Icon name="map-pin" size={20} />);
    expect(container.querySelector(".ui-icon-map-pin")).toHaveAttribute("width", "20");
  });
});
