import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import { DataTable } from "./data-table.js";
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
