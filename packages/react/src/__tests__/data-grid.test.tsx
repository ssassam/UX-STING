import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import { DataGrid, DataTable, UIProvider, type DataTableColumn } from "../index.js";

interface Row {
  id: number;
  name: string;
  city: string;
  score: number;
}

const people: Row[] = [
  { id: 1, name: "Lina", city: "Rabat", score: 3 },
  { id: 2, name: "Reda", city: "Casablanca", score: 9 },
  { id: 3, name: "Amal", city: "Rabat", score: 9 },
  { id: 4, name: "Omar", city: "Casablanca", score: 1 },
];

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", sortable: true },
  { id: "city", header: "City", sortable: true },
  { id: "score", header: "Score", sortable: true, align: "end" },
];

const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((r) => r.querySelector("td")?.textContent);

describe("DataTable: row ids", () => {
  it("passes the index in `data` (not within the page) to getRowId", async () => {
    const getRowId = vi.fn((_row: Row, i: number) => String(i));
    render(
      <DataTable data={people} columns={columns} getRowId={getRowId} label="People" pageSize={2} />,
    );
    expect(getRowId.mock.calls.map((c) => c[1])).toEqual([0, 1, 2, 3]);
  });

  it("keeps selection on the right rows across pages", async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <DataTable
        data={people}
        columns={columns}
        getRowId={(_r, i) => `row-${i}`}
        label="People"
        pageSize={2}
        selectable
        onSelectedIdsChange={onSelectedIdsChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /2/ }));
    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["row-2"]);
  });
});

describe("DataTable: multi-sort", () => {
  it("Shift+click adds a secondary sort; aria-sort stays on the primary column", async () => {
    const user = userEvent.setup();
    const onSortByChange = vi.fn();
    render(
      <DataTable
        data={people}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        multiSort
        onSortByChange={onSortByChange}
        pageSize={false}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Score/ }));
    await user.click(screen.getByRole("button", { name: /Score/ })); // desc
    await user.keyboard("{Shift>}");
    await user.click(screen.getByRole("button", { name: /Name/ }));
    await user.keyboard("{/Shift}");
    expect(onSortByChange).toHaveBeenLastCalledWith([
      { id: "score", direction: "desc" },
      { id: "name", direction: "asc" },
    ]);
    // score desc, ties broken by name asc
    expect(names()).toEqual(["Amal", "Reda", "Lina", "Omar"]);
    const [name, , score] = screen.getAllByRole("columnheader");
    expect(score).toHaveAttribute("aria-sort", "descending");
    expect(name).not.toHaveAttribute("aria-sort");
    expect(name).toHaveTextContent("sort priority 2");
  });

  it("a plain click replaces the multi-sort and keeps the single-sort API working", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        data={people}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        multiSort
        defaultSortBy={[
          { id: "city", direction: "asc" },
          { id: "name", direction: "asc" },
        ]}
        onSortChange={onSortChange}
        pageSize={false}
      />,
    );
    expect(names()).toEqual(["Omar", "Reda", "Amal", "Lina"]);
    await user.click(screen.getByRole("button", { name: /Score/ }));
    expect(onSortChange).toHaveBeenLastCalledWith({ id: "score", direction: "asc" });
    expect(names()).toEqual(["Omar", "Lina", "Reda", "Amal"]);
  });
});

describe("DataTable: range selection", () => {
  it("Shift+click selects the range from the last clicked row", async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <DataTable
        data={people}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        selectable
        onSelectedIdsChange={onSelectedIdsChange}
      />,
    );
    const boxes = screen.getAllByRole("checkbox", { name: "Select row" });
    await user.click(boxes[0]!);
    await user.keyboard("{Shift>}");
    await user.click(boxes[2]!);
    await user.keyboard("{/Shift}");
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1", "2", "3"]);
  });
});

describe("DataTable: expandable rows", () => {
  it("toggles a detail row wired with aria-expanded/aria-controls", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataTable
        data={people}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        renderRowDetail={(r) => <p>Details for {r.name}</p>}
      />,
    );
    const toggle = screen.getAllByRole("button", { name: "Expand" })[1]!;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    const collapse = screen.getByRole("button", { name: "Collapse" });
    expect(collapse).toHaveAttribute("aria-expanded", "true");
    const detail = document.getElementById(collapse.getAttribute("aria-controls")!);
    expect(detail).toHaveTextContent("Details for Reda");
    await expectNoA11yViolations(container);
  });
});

describe("DataTable: column resizing", () => {
  it("exposes focusable separators that resize with the keyboard", async () => {
    const user = userEvent.setup();
    const onColumnWidthsChange = vi.fn();
    const { container } = render(
      <DataTable
        data={people}
        columns={[...columns.slice(0, 2), { ...columns[2]!, resizable: false }]}
        getRowId={(r) => String(r.id)}
        label="People"
        resizableColumns
        onColumnWidthsChange={onColumnWidthsChange}
      />,
    );
    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(2); // Score is locked
    const name = screen.getByRole("separator", { name: "Resize Name column" });
    expect(name).toHaveAttribute("aria-valuenow", "160");
    name.focus();
    await user.keyboard("{ArrowRight}");
    expect(name).toHaveAttribute("aria-valuenow", "170");
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(name).toHaveAttribute("aria-valuenow", "120");
    await user.keyboard("{Home}");
    expect(name).toHaveAttribute("aria-valuenow", "60");
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ name: 60 });
    expect(container.querySelector("col:nth-child(1)")).toHaveStyle({ width: "60px" });
    await expectNoA11yViolations(container);
  });

  it("resizes by dragging and mirrors in RTL", () => {
    render(
      <UIProvider locale="ar">
        <DataTable
          data={people}
          columns={columns}
          getRowId={(r) => String(r.id)}
          label="People"
          resizableColumns
        />
      </UIProvider>,
    );
    const handle = screen.getAllByRole("separator")[0]!;
    fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 60, pointerId: 1 }); // dragging left widens in RTL
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(handle).toHaveAttribute("aria-valuenow", "200");
  });
});

describe("DataGrid: keyboard model", () => {
  it("is a single Tab stop with roving focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>before</button>
        <DataGrid
          data={people}
          columns={[
            { id: "name", header: "Name" },
            { id: "city", header: "City" },
          ]}
          getRowId={(r) => String(r.id)}
          label="People"
          pageSize={false}
        />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "before" }));
    await user.tab(); // focus the scroll region
    await user.tab();
    const first = screen.getAllByRole("gridcell")[0]!;
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("tabindex", "0");
    expect(screen.getAllByRole("gridcell").filter((c) => c.tabIndex === 0)).toHaveLength(1);

    await user.keyboard("{ArrowRight}{ArrowDown}");
    const cell = screen.getAllByRole("gridcell")[3]!; // row 2, col 2
    expect(cell).toHaveFocus();
    expect(cell).toHaveAttribute("tabindex", "0");
    expect(first).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{Control>}{End}{/Control}");
    expect(screen.getAllByRole("gridcell").at(-1)).toHaveFocus();
    await user.keyboard("{Control>}{Home}{/Control}");
    expect(screen.getAllByRole("columnheader")[0]).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getAllByRole("columnheader")[1]).toHaveFocus();
  });

  it("does not hijack arrow keys while typing in a cell input", async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        data={people.slice(0, 2)}
        columns={[
          {
            id: "name",
            header: "Name",
            cell: (r) => <input aria-label={`Edit ${r.name}`} defaultValue={r.name} />,
          },
          { id: "city", header: "City" },
        ]}
        getRowId={(r) => String(r.id)}
        label="People"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Edit Lina" });
    await user.click(input);
    await user.keyboard("{ArrowLeft}{ArrowDown}");
    expect(input).toHaveFocus();
  });
});

describe("DataTable: virtualization", () => {
  const many: Row[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Person ${i}`,
    city: i % 2 ? "Rabat" : "Fes",
    score: i,
  }));

  it("renders only the visible window with correct aria-rowcount/rowindex", () => {
    render(
      <DataTable
        data={many}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        virtual={{ rowHeight: 40, height: 400, overscan: 2 }}
      />,
    );
    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-rowcount", "1001");
    let rows = screen.getAllByRole("row").slice(1);
    expect(rows.length).toBeLessThan(20);
    expect(rows[0]).toHaveAttribute("aria-rowindex", "2");
    // No pagination in virtual mode.
    expect(screen.queryByRole("navigation")).toBeNull();

    const scroller = screen.getByRole("region", { name: "People" });
    scroller.scrollTop = 40 * 500;
    fireEvent.scroll(scroller);
    rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveAttribute("aria-rowindex", String(500 - 2 + 2));
    expect(screen.getByText("Person 500")).toBeInTheDocument();
    expect(screen.queryByText("Person 0")).toBeNull();
  });

  it("scrolls the target row into the window during grid navigation", async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        data={many}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        virtual={{ rowHeight: 40, height: 400, overscan: 2 }}
      />,
    );
    const scroller = screen.getByRole("region", { name: "People" });
    screen.getByText("Person 0").focus();
    await user.keyboard("{Control>}{End}{/Control}");
    await waitFor(() => expect(screen.getAllByRole("gridcell").at(-1)).toHaveFocus());
    expect(screen.getAllByRole("gridcell").at(-1)).toHaveTextContent("999");
    expect(scroller.scrollTop).toBeGreaterThan(39_000);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DataGrid
        data={many}
        columns={columns}
        getRowId={(r) => String(r.id)}
        label="People"
        virtual={{ rowHeight: 40, height: 400 }}
      />,
    );
    await expectNoA11yViolations(container);
  });
});
