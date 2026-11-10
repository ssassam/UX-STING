import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import { DataGrid, DataTable } from "./data-table.js";
import type { DataTableColumn } from "./data-table.types.js";

interface Row {
  id: string;
  name: string;
  city: string;
  rating: number;
  status: "published" | "draft";
}
const rows: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  name: `Place ${i + 1}`,
  city: ["Casablanca", "Rabat", "Paris"][i % 3]!,
  rating: 3 + (i % 20) / 10,
  status: i % 3 ? "published" : "draft",
}));
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "city", header: "City", accessor: "city", sortable: true },
  { id: "rating", header: "Rating", accessor: "rating", sortable: true, align: "end" },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    cell: (r) => (
      <Badge variant={r.status === "published" ? "success" : "secondary"}>{r.status}</Badge>
    ),
  },
];

const meta = {
  title: "Data display/DataTable",
  component: DataTable,
  tags: ["no-visual"],
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj;

export const FullFeatured: Story = {
  render: () => (
    <DataTable
      label="Places"
      data={rows}
      columns={columns}
      getRowId={(r) => r.id}
      searchable
      selectable
      columnToggle
      pageSize={5}
      defaultSort={{ id: "rating", direction: "desc" }}
      bulkActions={(ids, clear) => (
        <Button size="xs" variant="destructive" onClick={clear}>
          Delete {ids.length}
        </Button>
      )}
    />
  ),
};
export const Loading: Story = {
  ...FullFeatured,
  render: () => (
    <DataTable
      label="Places"
      data={[]}
      columns={columns}
      getRowId={(r) => r.id}
      loading
      pageSize={5}
    />
  ),
};
export const Empty: Story = {
  ...FullFeatured,
  render: () => <DataTable label="Places" data={[]} columns={columns} getRowId={(r) => r.id} />,
};
export const MobileStacked: Story = {
  ...FullFeatured,
  render: () => (
    <DataTable
      label="Places"
      data={rows.slice(0, 4)}
      columns={columns}
      getRowId={(r) => r.id}
      responsive="stack"
      pageSize={false}
    />
  ),
  parameters: { viewport: { defaultViewport: "mobile" } },
};

/** Shift+click headers for multi-sort, Shift+click checkboxes for ranges, drag column edges. */
export const PowerGrid: Story = {
  ...FullFeatured,
  render: () => (
    <DataGrid
      label="Places"
      data={rows}
      columns={columns}
      getRowId={(r) => r.id}
      selectable
      multiSort
      resizableColumns
      defaultSortBy={[
        { id: "city", direction: "asc" },
        { id: "rating", direction: "desc" },
      ]}
      renderRowDetail={(r) => (
        <p className="text-sm text-muted-foreground">
          {r.name} in {r.city}, rated {r.rating.toFixed(1)}.
        </p>
      )}
      pageSize={10}
    />
  ),
};

const manyRows: Row[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: String(i + 1),
  name: `Place ${i + 1}`,
  city: ["Casablanca", "Rabat", "Paris", "Fes"][i % 4]!,
  rating: 3 + (i % 20) / 10,
  status: i % 3 ? "published" : "draft",
}));

/** 10,000 rows, only the visible window is in the DOM. */
export const Virtualized: Story = {
  ...FullFeatured,
  render: () => (
    <DataGrid
      label="Places"
      data={manyRows}
      columns={columns}
      getRowId={(r) => r.id}
      searchable
      selectable
      virtual={{ rowHeight: 44, height: 480 }}
    />
  ),
};
