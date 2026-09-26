"use client";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@unified-ui/react/toggle";
import { BoldIcon, ItalicIcon, LayoutGridIcon, ListIcon, UnderlineIcon } from "@unified-ui/icons";

export function Basic() {
  return (
    <Toggle aria-label="Bold">
      <BoldIcon />
    </Toggle>
  );
}

export function Group() {
  return (
    <div className="flex flex-wrap gap-6">
      <ToggleGroup type="multiple" aria-label="Text formatting" variant="outline">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="grid" aria-label="View">
        <ToggleGroupItem value="grid">
          <LayoutGridIcon /> Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <ListIcon /> List
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
