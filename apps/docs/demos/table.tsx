"use client";
import { Badge } from "@unified-ui/react/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@unified-ui/react/table";
import { placeRows } from "./_places";

export function Basic() {
  return (
    <Table label="Recent places" striped>
      <TableCaption>Places updated in the last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead align="end">Rating</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {placeRows.slice(0, 5).map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.city}</TableCell>
            <TableCell align="end">{p.rating.toFixed(1)}</TableCell>
            <TableCell>
              <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "secondary" : "warning"}>{p.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function StackedOnMobile() {
  return (
    <Table label="Bookings" responsive="stack">
      <TableHeader>
        <TableRow>
          <TableHead>Guest</TableHead>
          <TableHead>Date</TableHead>
          <TableHead align="end">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[["Nadia", "Apr 12", "€240"], ["Tom", "Apr 14", "€120"], ["Aya", "Apr 20", "€360"]].map(([g, d, t]) => (
          <TableRow key={g}>
            <TableCell data-label="Guest">{g}</TableCell>
            <TableCell data-label="Date">{d}</TableCell>
            <TableCell data-label="Total" align="end">{t}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
