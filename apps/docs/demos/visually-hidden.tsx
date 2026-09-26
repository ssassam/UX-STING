"use client";
import { VisuallyHidden } from "@unified-ui/react/visually-hidden";
import { Trash2Icon } from "@unified-ui/icons";

export function Basic() {
  return (
    <button type="button" className="inline-flex size-9 items-center justify-center rounded-md border border-border">
      <Trash2Icon />
      <VisuallyHidden>Delete photo</VisuallyHidden>
    </button>
  );
}
