import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test-utils.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command.js";

function Palette({ onSelect = vi.fn(), loading = false }: { onSelect?: (v: string) => void; loading?: boolean }) {
  return (
    <Command label="Commands" loading={loading}>
      <CommandInput />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Pages">
          <CommandItem value="Dashboard" onSelect={onSelect} />
          <CommandItem value="Settings" keywords={["preferences"]} onSelect={onSelect} />
          <CommandItem value="Billing" disabled onSelect={onSelect} />
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="Create project" onSelect={onSelect} />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("filters with fuzzy search and keywords", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByRole("combobox"), "pref");
    expect(screen.getByRole("option", { name: "Settings" })).toBeVisible();
    expect(screen.queryByRole("option", { name: "Dashboard" })).toBeNull();
    expect(screen.getByText("Actions").closest("[role=group]")).not.toBeVisible();
  });

  it("navigates with arrows, skips disabled items, selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Dashboard" }).id);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Create project" }).id);
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("Create project");
    await user.keyboard("{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Dashboard" }).id);
  });

  it("shows empty state", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByRole("combobox"), "zzzz");
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("marks the list busy while loading", () => {
    render(<Palette loading />);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Palette />);
    await act(async () => expectNoA11yViolations(container));
  });
});
