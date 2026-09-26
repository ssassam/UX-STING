"use client";
import { Avatar } from "@ux-sting/react/avatar";
import { Badge } from "@ux-sting/react/badge";
import { List, ListItem } from "@ux-sting/react/list";
import { Switch } from "@ux-sting/react/switch";
import { ChevronRightIcon } from "@ux-sting/icons";

export function Rows() {
  return (
    <List variant="bordered" className="max-w-md">
      <ListItem
        start={<Avatar size="sm" name="Nadia Amrani" />}
        title="Nadia Amrani"
        description="Booked 2 nights"
        end={<Badge variant="success">Paid</Badge>}
      />
      <ListItem
        start={<Avatar size="sm" name="Tom Becker" />}
        title="Tom Becker"
        description="Requested a quote"
        end={<Badge variant="warning">New</Badge>}
      />
      <ListItem asChild>
        <a href="#customers">
          <span className="flex-1 text-sm font-medium">View all customers</span>
          <ChevronRightIcon className="size-4 rtl:rotate-180" />
        </a>
      </ListItem>
    </List>
  );
}

export function Settings() {
  return (
    <List variant="divided" className="max-w-md">
      <ListItem
        title="Booking requests"
        description="Allow guests to request bookings"
        end={<Switch aria-label="Booking requests" defaultChecked />}
      />
      <ListItem
        title="Instant book"
        description="Confirm automatically"
        end={<Switch aria-label="Instant book" />}
      />
    </List>
  );
}
