"use client";
import { useState } from "react";
import { Chip, Tag } from "@unified-ui/react/tag";

export function Tags() {
  const [tags, setTags] = useState(["Vegan", "Outdoor seating", "Free Wi-Fi"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Tag key={t} variant="primary" onRemove={() => setTags(tags.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
      <Tag variant="success">Open</Tag>
      <Tag variant="outline" size="sm">
        Small
      </Tag>
    </div>
  );
}

export function Chips() {
  const [selected, setSelected] = useState<string[]>(["Open now"]);
  const toggle = (c: string) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  return (
    <div role="group" aria-label="Quick filters" className="flex flex-wrap gap-2">
      {["Open now", "Top rated", "Delivery", "$$", "Kids friendly"].map((c) => (
        <Chip key={c} selected={selected.includes(c)} onClick={() => toggle(c)}>
          {c}
        </Chip>
      ))}
    </div>
  );
}
