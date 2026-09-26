import { Avatar } from "@ux-sting/react/avatar";
import { Badge } from "@ux-sting/react/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ux-sting/react/table";
import { Heading } from "@ux-sting/react/typography";
import { bookings } from "../../lib/data";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  const customers = [...new Map(bookings.map((b) => [b.guest, b])).values()];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">
        Customers
      </Heading>
      <div className="rounded-lg border border-border">
        <Table label="Customers" responsive="stack">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead align="end">Bookings</TableHead>
              <TableHead>Segment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c, i) => (
              <TableRow key={c.guest}>
                <TableCell data-label="Name">
                  <span className="flex items-center gap-2">
                    <Avatar size="xs" name={c.guest} />
                    {c.guest}
                  </span>
                </TableCell>
                <TableCell data-label="Email">{c.email}</TableCell>
                <TableCell data-label="Bookings" align="end">
                  {bookings.filter((b) => b.guest === c.guest).length}
                </TableCell>
                <TableCell data-label="Segment">
                  <Badge variant={i % 3 ? "secondary" : "primary"}>
                    {i % 3 ? "Regular" : "VIP"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
