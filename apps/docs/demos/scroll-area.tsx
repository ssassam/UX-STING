"use client";
import { ScrollArea } from "@unified-ui/react/scroll-area";

export function Basic() {
  return (
    <ScrollArea
      aria-label="Release notes"
      className="h-56 w-full max-w-xs rounded-lg border border-border"
    >
      <ul className="p-4 text-sm">
        {Array.from({ length: 30 }, (_, i) => (
          <li key={i} className="border-b border-border py-2 last:border-0">
            v1.{30 - i}.0 — improvements
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
