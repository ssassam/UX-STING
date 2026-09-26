import type { ReactNode } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Group heading this option belongs to. */
  group?: string;
  keywords?: string[];
}

export function groupOptions(
  options: ComboboxOption[],
): Array<[string | undefined, ComboboxOption[]]> {
  const map = new Map<string | undefined, ComboboxOption[]>();
  for (const option of options) {
    const list = map.get(option.group) ?? [];
    list.push(option);
    map.set(option.group, list);
  }
  return Array.from(map.entries());
}
