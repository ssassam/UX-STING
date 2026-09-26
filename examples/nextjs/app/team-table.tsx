"use client";
import { Badge } from "@/components/ui/components/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/components/data-table";

interface Member {
  id: string;
  name: string;
  role: string;
  status: "active" | "invited";
}

const members: Member[] = [
  { id: "1", name: "Ada Lovelace", role: "Owner", status: "active" },
  { id: "2", name: "Grace Hopper", role: "Admin", status: "active" },
  { id: "3", name: "Alan Turing", role: "Editor", status: "invited" },
  { id: "4", name: "Katherine Johnson", role: "Viewer", status: "active" },
];

const columns: DataTableColumn<Member>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    cell: (m) => <Badge variant={m.status === "active" ? "success" : "warning"}>{m.status}</Badge>,
  },
];

export function TeamTable() {
  return (
    <DataTable
      label="Team members"
      data={members}
      columns={columns}
      getRowId={(m) => m.id}
      searchable
      selectable
      pageSize={false}
    />
  );
}
