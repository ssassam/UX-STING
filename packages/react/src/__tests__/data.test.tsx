import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test-utils.js";
import { Button, DataGrid, DataTable, Pagination, Tree, type DataTableColumn } from "../index.js";

interface Place {
  id: string;
  name: string;
  city: string;
  rating: number;
}

const places: Place[] = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  name: `Place ${String(i + 1).padStart(2, "0")}`,
  city: i % 2 ? "Rabat" : "Casablanca",
  rating: (i % 5) + 1,
}));

const columns: DataTableColumn<Place>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "city", header: "City", accessor: "city", sortable: true },
  { id: "rating", header: "Rating", accessor: "rating", sortable: true, align: "end" },
];

function bodyRows() {
  const [, body] = screen.getAllByRole("rowgroup");
  return within(body!).getAllByRole("row");
}

describe("DataTable", () => {
  it("keeps a custom page size selectable in the rows-per-page menu", () => {
    render(
      <DataTable
        label="Places"
        data={places}
        columns={columns}
        getRowId={(p) => p.id}
        pageSize={12}
      />,
    );
    expect(bodyRows()).toHaveLength(12);
    const select = screen.getByRole("combobox", { name: /rows per page/i }) as HTMLSelectElement;
    expect(select.value).toBe("12");
    expect([...select.options].map((o) => o.value)).toEqual(["10", "12", "25", "50"]);
  });

  it("paginates and sorts with aria-sort", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        label="Places"
        data={places}
        columns={columns}
        getRowId={(r) => r.id}
        pageSize={10}
      />,
    );
    expect(bodyRows()).toHaveLength(10);
    const ratingHeader = screen.getByRole("columnheader", { name: /Rating/ });
    expect(ratingHeader).toHaveAttribute("aria-sort", "none");
    await user.click(within(ratingHeader).getByRole("button"));
    expect(ratingHeader).toHaveAttribute("aria-sort", "ascending");
    expect(within(bodyRows()[0]!).getAllByRole("cell")[2]).toHaveTextContent("1");
    await user.click(within(ratingHeader).getByRole("button"));
    expect(ratingHeader).toHaveAttribute("aria-sort", "descending");
    expect(within(bodyRows()[0]!).getAllByRole("cell")[2]).toHaveTextContent("5");
    await user.click(screen.getByRole("button", { name: "Go to page 3" }));
    expect(bodyRows()).toHaveLength(3);
  });

  it("searches across columns", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        label="Places"
        data={places}
        columns={columns}
        getRowId={(r) => r.id}
        searchable
      />,
    );
    await user.type(screen.getByRole("searchbox"), "Place 07");
    expect(bodyRows()).toHaveLength(1);
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("selects rows and exposes bulk actions", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <DataTable
        label="Places"
        data={places.slice(0, 5)}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        bulkActions={(ids, clear) => (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              onDelete(ids);
              clear();
            }}
          >
            Delete
          </Button>
        )}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(screen.getByText("5 selected")).toBeInTheDocument();
    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(["2", "3", "4", "5"]);
  });

  it("shows skeleton rows while loading", () => {
    render(<DataTable label="Places" data={[]} columns={columns} getRowId={(r) => r.id} loading />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  });

  it("DataGrid moves focus between cells with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        label="Places"
        data={places.slice(0, 3)}
        columns={columns}
        getRowId={(r) => r.id}
        pageSize={false}
      />,
    );
    const grid = screen.getByRole("grid");
    const firstCell = within(grid).getAllByRole("gridcell")[0]!;
    firstCell.focus();
    await user.keyboard("{ArrowRight}");
    expect(within(grid).getAllByRole("gridcell")[1]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(within(grid).getAllByRole("gridcell")[4]).toHaveFocus();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <DataTable
        label="Places"
        data={places}
        columns={columns}
        getRowId={(r) => r.id}
        searchable
        selectable
      />,
    );
    await act(async () => expectNoA11yViolations(container));
  });
});

describe("Pagination", () => {
  it("renders crawlable links with aria-current", () => {
    render(<Pagination totalPages={20} page={10} getHref={(p) => `/search?page=${p}`} />);
    const current = screen.getByRole("link", { name: "Go to page 10" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("href", "/search?page=10");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/search?page=11");
  });

  it("disables previous on the first page", () => {
    render(<Pagination totalPages={5} defaultPage={1} />);
    expect(
      screen.getByText(
        (_, el) => el?.getAttribute("aria-disabled") === "true" && el.tagName === "SPAN",
      ),
    ).toBeInTheDocument();
  });
});

describe("Tree", () => {
  const nodes = [
    {
      id: "src",
      label: "src",
      children: [
        { id: "app", label: "app.tsx" },
        { id: "lib", label: "lib", children: [{ id: "utils", label: "utils.ts" }] },
      ],
    },
    { id: "readme", label: "README.md" },
  ];

  it("expands with arrows and supports typeahead", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Tree aria-label="Files" nodes={nodes} onAction={onAction} />);
    const src = screen.getByRole("treeitem", { name: "src" });
    expect(src).toHaveAttribute("aria-expanded", "false");
    src.focus();
    await user.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: "app.tsx" })).toHaveFocus();
    await user.keyboard("r");
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: "readme" }));
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
