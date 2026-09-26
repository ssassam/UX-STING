import { Heading, Text } from "@ux-sting/react/typography";
import { BookingsTable } from "../../components/bookings-table";

export const metadata = { title: "Bookings" };

export default function BookingsPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div>
        <Heading level={1} size="lg">
          Bookings
        </Heading>
        <Text variant="muted" size="sm">
          Search, filter, sort and act on bookings in bulk.
        </Text>
      </div>
      <BookingsTable />
    </div>
  );
}
