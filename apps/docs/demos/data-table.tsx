"use client";
import { useState } from "react";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { DataGrid, DataTable, type DataTableColumn } from "@ux-sting/react/data-table";
import { ReviewStars } from "@ux-sting/react/rating";
import { toast } from "@ux-sting/react/toast";
import { placeRows, type PlaceRow } from "./_places";

const columns: DataTableColumn<PlaceRow>[] = [
  {
    id: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    hideable: false,
    className: "font-medium",
  },
  { id: "category", header: "Category", accessor: "category", sortable: true },
  { id: "city", header: "City", accessor: "city", sortable: true },
  {
    id: "rating",
    header: "Rating",
    accessor: "rating",
    sortable: true,
    cell: (r) => <ReviewStars value={r.rating} size="sm" showValue />,
  },
  { id: "reviews", header: "Reviews", accessor: "reviews", sortable: true, align: "end" },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    cell: (r) => (
      <Badge
        variant={
          r.status === "published" ? "success" : r.status === "draft" ? "secondary" : "warning"
        }
      >
        {r.status}
      </Badge>
    ),
  },
  {
    id: "updated",
    header: "Updated",
    accessor: "updated",
    sortable: true,
    hidden: true,
    cell: (r) => r.updated.toLocaleDateString(),
  },
];

export function FullFeatured() {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <DataTable
      label="Places"
      data={placeRows}
      columns={columns}
      getRowId={(r) => r.id}
      searchable
      searchPlaceholder="Search places…"
      selectable
      columnToggle
      pageSize={5}
      pageSizeOptions={[5, 10, 25]}
      filter={status ? (r) => r.status === status : undefined}
      toolbar={
        <div role="group" aria-label="Status filter" className="flex gap-1">
          {["published", "draft", "pending"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "secondary" : "ghost"}
              aria-pressed={status === s}
              onClick={() => setStatus(status === s ? null : s)}
            >
              {s}
            </Button>
          ))}
        </div>
      }
      bulkActions={(ids, clear) => (
        <>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              toast.success(`${ids.length} places published`);
              clear();
            }}
          >
            Publish
          </Button>
          <Button
            size="xs"
            variant="destructive"
            onClick={() => {
              toast(`${ids.length} places deleted`);
              clear();
            }}
          >
            Delete
          </Button>
        </>
      )}
      responsive="stack"
    />
  );
}

export function Loading() {
  return (
    <DataTable
      label="Places (loading)"
      data={[]}
      columns={columns.slice(0, 4)}
      getRowId={(r) => r.id}
      loading
      pageSize={4}
    />
  );
}

export function Grid() {
  return (
    <DataGrid
      label="Places grid"
      data={placeRows.slice(0, 5)}
      columns={columns.slice(0, 5)}
      getRowId={(r) => r.id}
      pageSize={false}
    />
  );
}
