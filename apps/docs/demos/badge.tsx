"use client";
import { Badge, CountBadge } from "@unified-ui/react/badge";
import { CheckIcon } from "@unified-ui/icons";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success" dot>Open</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Closed</Badge>
      <Badge variant="info" icon={<CheckIcon />}>Verified</Badge>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <CountBadge count={7} label="7 unread messages" />
      <CountBadge count={240} label="240 notifications" />
    </div>
  );
}
