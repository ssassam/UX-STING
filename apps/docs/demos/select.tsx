"use client";
import { Field } from "@unified-ui/react/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@unified-ui/react/select";

export function Basic() {
  return (
    <Field label="Sort by" className="max-w-xs">
      <Select defaultValue="relevance">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="rating">Highest rated</SelectItem>
          <SelectItem value="distance">Nearest</SelectItem>
          <SelectItem value="price">Price: low to high</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function Grouped() {
  return (
    <Select>
      <SelectTrigger className="max-w-xs" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="paris">Paris (CET)</SelectItem>
          <SelectItem value="london">London (GMT)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Africa</SelectLabel>
          <SelectItem value="casablanca">Casablanca</SelectItem>
          <SelectItem value="cairo">Cairo (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
