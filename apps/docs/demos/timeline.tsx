"use client";
import { Timeline, TimelineItem } from "@ux-sting/react/timeline";
import { CheckIcon, PackageIcon, TruckIcon } from "@ux-sting/icons";

export function Tracking() {
  return (
    <Timeline className="max-w-md">
      <TimelineItem
        title="Order confirmed"
        time="Apr 2, 09:12"
        dateTime="2026-04-02T09:12"
        variant="success"
        icon={<CheckIcon />}
      />
      <TimelineItem
        title="Packed"
        time="Apr 2, 14:30"
        dateTime="2026-04-02T14:30"
        variant="primary"
        icon={<PackageIcon />}
        description="Warehouse Casablanca"
      />
      <TimelineItem
        title="Out for delivery"
        time="Apr 3, 08:05"
        dateTime="2026-04-03T08:05"
        variant="primary"
        icon={<TruckIcon />}
      />
      <TimelineItem title="Delivered" description="Estimated by 18:00" />
    </Timeline>
  );
}
