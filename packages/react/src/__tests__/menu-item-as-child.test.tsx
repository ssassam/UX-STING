import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../index.js";

// Regression: menu items always rendered [icon, children, shortcut], so
// `asChild` crashed with "Primitive.div failed to slot onto its children".
describe("menu items with asChild", () => {
  it("renders the child element and puts icon + shortcut inside it", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild icon={<svg data-testid="icon" />} shortcut="⌘P">
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/plain">Plain</a>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem asChild checked>
            <a href="/checked">Checked</a>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const link = await screen.findByRole("menuitem", { name: /Profile/ });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/profile");
    expect(link.querySelector("[data-testid=icon]")).not.toBeNull();
    expect(link.textContent).toContain("⌘P");
    expect(screen.getByRole("menuitem", { name: "Plain" }).tagName).toBe("A");
    expect(screen.getByRole("menuitemcheckbox", { name: "Checked" }).tagName).toBe("A");
  });

  it("still renders decorations without asChild", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<svg data-testid="icon" />} shortcut="⌘S">
            Save
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const item = await screen.findByRole("menuitem", { name: /Save/ });
    expect(item.tagName).toBe("DIV");
    expect(item.querySelector("[data-testid=icon]")).not.toBeNull();
  });
});
