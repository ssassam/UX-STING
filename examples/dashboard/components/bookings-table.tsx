"use client";
import { Badge } from "@ux-sting/react/badge";
import { Button } from "@ux-sting/react/button";
import { DataTable, type DataTableColumn } from "@ux-sting/react/data-table";
import { toast } from "@ux-sting/react/toast";
import { useState } from "react";
import { bookings as initial, type Booking } from "../lib/data";

const eur = (v: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(v);
const statusVariant = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
} as const;

const columns: DataTableColumn<Booking>[] = [
  { id: "id", header: "Booking", accessor: "id", sortable: true, className: "font-mono text-xs" },
  {
    id: "guest",
    header: "Guest",
    accessor: "guest",
    sortable: true,
    hideable: false,
    cell: (b) => (
      <div className="grid">
        <span className="font-medium">{b.guest}</span>
        <span className="text-xs text-muted-foreground">{b.email}</span>
      </div>
    ),
  },
  { id: "listing", header: "Listing", accessor: "listing", sortable: true },
  {
    id: "date",
    header: "Check-in",
    accessor: "date",
    sortable: true,
    cell: (b) => new Date(b.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
  },
  { id: "nights", header: "Nights", accessor: "nights", sortable: true, align: "end" },
  {
    id: "total",
    header: "Total",
    accessor: "total",
    sortable: true,
    align: "end",
    cell: (b) => eur(b.total),
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    cell: (b) => <Badge variant={statusVariant[b.status]}>{b.status}</Badge>,
  },
];

export function BookingsTable({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<Booking["status"] | null>(null);
  return (
    <DataTable
      label="Bookings"
      data={rows}
      columns={compact ? columns.filter((c) => c.id !== "id" && c.id !== "nights") : columns}
      getRowId={(b) => b.id}
      searchable
      searchPlaceholder="Search guests, listings…"
      selectable
      columnToggle={!compact}
      pageSize={compact ? 5 : 10}
      defaultSort={{ id: "date", direction: "desc" }}
      filter={status ? (b) => b.status === status : undefined}
      responsive="stack"
      toolbar={
        <div role="group" aria-label="Filter by status" className="flex gap-1">
          {(["confirmed", "pending", "cancelled"] as const).map((s) => (
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
              setRows((r) =>
                r.map((b) => (ids.includes(b.id) ? { ...b, status: "confirmed" } : b)),
              );
              toast.success(`${ids.length} bookings confirmed`);
              clear();
            }}
          >
            Confirm
          </Button>
          <Button
            size="xs"
            variant="destructive"
            onClick={() => {
              const removed = rows.filter((b) => ids.includes(b.id));
              setRows((r) => r.filter((b) => !ids.includes(b.id)));
              clear();
              toast(`${ids.length} bookings deleted`, {
                action: { label: "Undo", onClick: () => setRows((r) => [...r, ...removed]) },
              });
            }}
          >
            Delete
          </Button>
        </>
      )}
    />
  );
}
