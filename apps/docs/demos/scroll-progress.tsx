"use client";
import { ScrollProgress } from "@ux-sting/react/scroll-progress";

export function ReadingProgress() {
  return (
    <div className="grid gap-2">
      <ScrollProgress />
      <p className="text-sm text-muted-foreground">
        Scroll the page: the bar at the very top of the window tracks your reading progress.
      </p>
    </div>
  );
}
