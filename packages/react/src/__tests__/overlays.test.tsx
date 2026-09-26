import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  UIProvider,
} from "../index.js";

function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your details.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Name" />
        </DialogBody>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens, traps focus, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<EditDialog />);
    const trigger = screen.getByRole("button", { name: "Edit profile" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Edit profile" });
    expect(dialog).toHaveAccessibleDescription("Update your details.");
    expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 5; i++) await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("has a labelled close button and no axe violations", async () => {
    const user = userEvent.setup();
    render(<EditDialog />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    await act(async () => expectNoA11yViolations(document.body));
  });

  it("portals into the provider so theme variables apply", async () => {
    const user = userEvent.setup();
    render(
      <UIProvider theme="modern" colorMode="dark">
        <EditDialog />
      </UIProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("dialog").closest("[data-ui-theme]")).toHaveAttribute("data-theme", "dark");
  });
});

describe("AlertDialog", () => {
  it("focuses Cancel first and confirms with the action", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe("Sheet", () => {
  it("opens from a logical side", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Filters</SheetTrigger>
        <SheetContent side="start">
          <SheetTitle>Filters</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "start");
  });
});

describe("Tabs", () => {
  it("switches with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">Overview</TabsTrigger>
          <TabsTrigger value="b">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Overview panel</TabsContent>
        <TabsContent value="b">Reviews panel</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Reviews" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Reviews panel");
  });
});

describe("Accordion", () => {
  it("expands with aria-expanded and headings", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>Is parking available?</AccordionTrigger>
          <AccordionContent>Yes, free parking.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Is parking available?" });
    expect(trigger.closest("h3")).not.toBeNull();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Yes, free parking.")).toBeVisible();
  });
});

describe("DropdownMenu", () => {
  it("opens with keyboard and selects an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Duplicate</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    screen.getByRole("button", { name: "Actions" }).focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    // Opening with Enter focuses the first item; arrows move between items.
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});

describe("Popover & Tooltip", () => {
  it("popover toggles and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent aria-label="Share options">Copy link</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("dialog", { name: "Share options" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("tooltip shows on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copy to clipboard" delayDuration={0}>
        <button aria-label="Copy">⧉</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy to clipboard");
  });
});
