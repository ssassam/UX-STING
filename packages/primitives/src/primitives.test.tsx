import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { addMonths, getMonthGrid, getWeekStart, parseISODate, Slot, Slottable, toISODate, VisuallyHidden } from "./index.js";

describe("Slot", () => {
  it("merges props, classes, handlers and refs onto the child", () => {
    const slotClick = vi.fn();
    const childClick = vi.fn();
    const ref = createRef<HTMLElement>();
    render(
      <Slot className="px-4 a" onClick={slotClick} ref={ref} data-x="1">
        <a href="/x" className="px-2" onClick={childClick}>
          link
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("a", "px-2");
    expect(link).not.toHaveClass("px-4");
    expect(link).toHaveAttribute("data-x", "1");
    fireEvent.click(link);
    expect(childClick).toHaveBeenCalled();
    expect(slotClick).toHaveBeenCalled();
    expect(ref.current).toBe(link);
  });

  it("supports Slottable siblings", () => {
    render(
      <Slot className="btn">
        <span>icon</span>
        <Slottable>
          <a href="/y">text</a>
        </Slottable>
      </Slot>,
    );
    expect(screen.getByRole("link")).toHaveTextContent("icontext");
    expect(screen.getByRole("link")).toHaveClass("btn");
  });
});

describe("VisuallyHidden", () => {
  it("keeps text accessible", () => {
    render(<button><VisuallyHidden>Close</VisuallyHidden></button>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});

describe("calendar math", () => {
  it("builds a 6-week grid starting on the week start", () => {
    const grid = getMonthGrid(new Date(2026, 1, 1), 1);
    expect(grid).toHaveLength(6);
    expect(grid[0]![0]!.getDay()).toBe(1);
  });
  it("clamps month overflow", () => {
    expect(toISODate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
  });
  it("parses ISO dates strictly", () => {
    expect(parseISODate("2026-02-30")).toBeNull();
    expect(parseISODate("2026-02-03")?.getDate()).toBe(3);
  });
  it("detects locale week start", () => {
    expect(getWeekStart("en-US")).toBe(0);
    expect(getWeekStart("fr-FR")).toBe(1);
  });
});
