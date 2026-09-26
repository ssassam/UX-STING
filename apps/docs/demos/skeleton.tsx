"use client";
import { Skeleton, SkeletonText } from "@unified-ui/react/skeleton";

export function CardPlaceholder() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading places" className="grid max-w-sm gap-3 rounded-xl border border-border p-4">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" className="size-10" />
        <div className="grid flex-1 gap-2">
          <Skeleton shape="text" className="w-2/3" />
          <Skeleton shape="text" className="w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
