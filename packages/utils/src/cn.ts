import { twMerge } from "tailwind-merge";

export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];
export type ClassDictionary = Record<string, unknown>;

function toVal(value: ClassValue): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (Array.isArray(value)) return mergeClasses(...value);
  if (typeof value === "object") {
    let out = "";
    for (const key in value) {
      if (value[key]) out += (out ? " " : "") + key;
    }
    return out;
  }
  return "";
}

/**
 * Joins class values (strings, arrays, `{ class: condition }` objects) without
 * resolving conflicts. Use when you do not need Tailwind-aware merging.
 */
export function mergeClasses(...inputs: ClassValue[]): string {
  let out = "";
  for (const input of inputs) {
    const val = toVal(input);
    if (val) out += (out ? " " : "") + val;
  }
  return out;
}

/**
 * Joins class values and resolves Tailwind CSS conflicts so that consumer
 * classes (passed last) win: `cn("px-4", "px-2") === "px-2"`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(mergeClasses(...inputs));
}
