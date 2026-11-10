import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import {
  Autocomplete,
  Collapsible,
  Combobox,
  CollapsibleContent,
  CollapsibleTrigger,
  DatePicker,
  DateRangePicker,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  MultiSelect,
  NavigationRail,
  NavigationRailItem,
  RangeSlider,
  SkipLink,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TimePicker,
} from "../index.js";

const cities = ["Casablanca", "Rabat", "Marrakech", "Paris", "Tangier"];

describe("Autocomplete", () => {
  it("exposes combobox/listbox semantics and has no axe violations when open", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="City" suggestions={cities} />);
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(cities.length);
    // The popup is portaled, so scan the whole document.
    expect(screen.getByRole("dialog", { name: "City" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });

  it("filters, moves aria-activedescendant with arrows and selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Autocomplete aria-label="City" suggestions={cities} onSelect={onSelect} />);
    const input = screen.getByRole("combobox", { name: "City" });
    await user.type(input, "ra");
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toContain("Rabat");
    expect(options).not.toContain("Paris");

    const first = screen.getAllByRole("option")[0]!;
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    expect(first).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowDown}");
    const second = screen.getAllByRole("option")[1]!;
    expect(input).toHaveAttribute("aria-activedescendant", second.id);

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(second.textContent);
    expect(input).toHaveValue(second.textContent);
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("wraps ArrowUp from the first option to the last", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="City" suggestions={cities} />);
    const input = screen.getByRole("combobox", { name: "City" });
    await user.click(input);
    await user.keyboard("{ArrowUp}");
    const options = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", options[options.length - 1]!.id);
  });

  it("closes on Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="City" suggestions={cities} />);
    const input = screen.getByRole("combobox", { name: "City" });
    await user.type(input, "Pa");
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveValue("Pa");
  });

  it("selects with the mouse and respects limit", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="City" suggestions={cities} limit={2} />);
    const input = screen.getByRole("combobox", { name: "City" });
    await user.click(input);
    expect(screen.getAllByRole("option")).toHaveLength(2);
    await user.click(screen.getByRole("option", { name: "Rabat" }));
    expect(input).toHaveValue("Rabat");
  });

  it("announces the empty state", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="City" suggestions={cities} emptyText="No city" />);
    await user.type(screen.getByRole("combobox", { name: "City" }), "zzzz");
    expect(screen.getByRole("status")).toHaveTextContent("No city");
  });
});

const tags = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

describe("MultiSelect", () => {
  it("toggles options, renders removable chips and hidden inputs", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <MultiSelect
          aria-label="Frameworks"
          name="fw"
          options={tags}
          onValueChange={onValueChange}
        />
      </form>,
    );
    await user.click(screen.getByRole("combobox", { name: "Frameworks" }));
    await user.click(await screen.findByRole("option", { name: /React/ }));
    await user.click(screen.getByRole("option", { name: /Svelte/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "svelte"]);
    expect(screen.getByRole("option", { name: /React/ })).toHaveAttribute("aria-selected", "true");

    const hidden = container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="fw"]');
    expect([...hidden].map((i) => i.value)).toEqual(["react", "svelte"]);

    await user.keyboard("{Escape}");
    const remove = screen.getByRole("button", { name: /React/ });
    await user.click(remove);
    expect(onValueChange).toHaveBeenLastCalledWith(["svelte"]);
  });

  it("disables unselected options once maxSelected is reached", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        aria-label="Frameworks"
        options={tags}
        defaultValue={["react", "vue"]}
        maxSelected={2}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Frameworks" }));
    expect(await screen.findByRole("option", { name: /Svelte/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("option", { name: /React/ })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("collapses chips past maxVisible into a +N counter", () => {
    render(
      <MultiSelect
        aria-label="Frameworks"
        options={tags}
        defaultValue={["react", "vue", "svelte", "solid"]}
        maxVisible={2}
      />,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("has no axe violations open or closed", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelect aria-label="Frameworks" options={tags} defaultValue={["vue"]} />,
    );
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole("combobox", { name: "Frameworks" }));
    await screen.findByRole("listbox");
    await expectNoA11yViolations(document.body);
  });
});

describe("TimePicker", () => {
  it("generates step options within min/max and emits HH:mm", async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState<string | null>(null);
      return (
        <>
          <TimePicker
            aria-label="Start"
            step={60}
            min="09:00"
            max="12:00"
            hour12={false}
            value={v}
            onValueChange={setV}
          />
          <output>{v}</output>
        </>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole("combobox", { name: "Start" }));
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(4);
    await user.click(options[2]!);
    await waitFor(() =>
      expect(screen.getByText("11:00", { selector: "output" })).toBeInTheDocument(),
    );
  });
});

describe("Slider", () => {
  it("labels thumbs and moves with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider aria-label="Volume" defaultValue={[20]} step={10} onValueChange={onValueChange} />,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "20");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([30]);
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
  });

  it("keeps aria-valuetext and the visible value in sync when uncontrolled", async () => {
    const user = userEvent.setup();
    render(
      <Slider
        aria-label="Price"
        defaultValue={[20]}
        step={10}
        showValue
        formatValue={(v) => `$${v}`}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "Price" });
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuetext", "$30");
    expect(screen.getByText("$30", { selector: "output" })).toBeInTheDocument();
  });

  it("RangeSlider renders two independently labelled thumbs", async () => {
    const { container } = render(
      <RangeSlider thumbLabels={["Minimum price", "Maximum price"]} min={0} max={500} />,
    );
    expect(screen.getByRole("slider", { name: "Minimum price" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByRole("slider", { name: "Maximum price" })).toHaveAttribute(
      "aria-valuenow",
      "500",
    );
    await expectNoA11yViolations(container);
  });
});

describe("Table", () => {
  function SortableTable({ onSort }: { onSort: () => void }) {
    return (
      <Table label="Orders">
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc" onSort={onSort}>
              Date
            </TableHead>
            <TableHead onSort={onSort}>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2026-11-10</TableCell>
            <TableCell>$40</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  it("labels the scroll region, makes it focusable and exposes aria-sort", async () => {
    const onSort = vi.fn();
    const { container } = render(<SortableTable onSort={onSort} />);
    const region = screen.getByRole("region", { name: "Orders" });
    expect(region).toHaveAttribute("tabindex", "0");
    const [date, total, status] = screen.getAllByRole("columnheader");
    expect(date).toHaveAttribute("aria-sort", "ascending");
    expect(total).toHaveAttribute("aria-sort", "none");
    expect(status).not.toHaveAttribute("aria-sort");
    await userEvent.setup().click(screen.getByRole("button", { name: "Total" }));
    expect(onSort).toHaveBeenCalledOnce();
    await expectNoA11yViolations(container);
  });
});

describe("Drawer", () => {
  it("opens as a labelled dialog, traps focus and closes with Escape and the close button", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Filters</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow the results.</DrawerDescription>
          <DrawerBody>
            <input aria-label="Keyword" />
          </DrawerBody>
          <DrawerClose>Done</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveAccessibleDescription("Narrow the results.");
    await expectNoA11yViolations(document.body);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Cart</DrawerTitle>
          <DrawerDescription>Your items</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByRole("dialog", { name: "Cart" })).toBeInTheDocument();
    await userEvent.setup().keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Collapsible", () => {
  it("toggles aria-expanded and content visibility", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden body</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden body")).toBeNull();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden body")).toBeVisible();
    expect(trigger).toHaveAttribute(
      "aria-controls",
      screen.getByText("Hidden body").closest("[id]")!.id,
    );
  });
});

describe("SkipLink", () => {
  it("is the first tab stop and targets #main by default", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <nav>
          <a href="/a">A</a>
        </nav>
        <main id="main">Body</main>
      </>,
    );
    await user.tab();
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#main");
  });
});

describe("NavigationRail", () => {
  it("marks the active item with aria-current and passes axe", async () => {
    const { container } = render(
      <NavigationRail aria-label="Main">
        <NavigationRailItem href="/" icon={<span />} active>
          Home
        </NavigationRailItem>
        <NavigationRailItem href="/search" icon={<span />}>
          Search
        </NavigationRailItem>
      </NavigationRail>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
    await expectNoA11yViolations(container);
  });
});

describe("picker popups are named dialogs (portaled axe scan)", () => {
  it("Combobox names its popup from aria-label and falls back to a localized label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Combobox aria-label="Country" options={[{ value: "ma", label: "Morocco" }]} />
        <span id="ext">Language</span>
        <Combobox aria-labelledby="ext" options={[{ value: "fr", label: "French" }]} />
      </>,
    );
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    expect(await screen.findByRole("dialog", { name: "Country" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("combobox", { name: "Language" }));
    expect(await screen.findByRole("dialog", { name: "Language" })).toBeInTheDocument();
  });

  it("DatePicker and DateRangePicker popups pass axe", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatePicker aria-label="Check-in" />
        <DateRangePicker aria-label="Stay" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: /Check-in/ }));
    expect(await screen.findByRole("dialog", { name: "Check-in" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /Stay/ }));
    expect(await screen.findByRole("dialog", { name: "Stay" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });
});
