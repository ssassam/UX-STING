"use client";
import { Avatar, AvatarGroup } from "@unified-ui/react/avatar";

export function Sizes() {
  return (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size} name="Yasmine Benali" src="https://i.pravatar.cc/160?img=47" />
      ))}
    </div>
  );
}

export function Fallbacks() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Omar Haddad" />
      <Avatar name="Broken Image" src="https://example.invalid/x.png" />
      <Avatar name="Atlas Café" shape="square" />
      <Avatar name="Lina" src="https://i.pravatar.cc/160?img=32" status="online" statusLabel="Online" />
      <Avatar name="Karim" status="busy" statusLabel="Busy" />
    </div>
  );
}

export function Group() {
  return (
    <AvatarGroup max={4} size="sm">
      {[12, 15, 22, 32, 47, 5].map((i) => (
        <Avatar key={i} name={`Guest ${i}`} src={`https://i.pravatar.cc/80?img=${i}`} />
      ))}
    </AvatarGroup>
  );
}
