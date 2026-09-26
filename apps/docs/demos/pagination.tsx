"use client";
import { Pagination } from "@unified-ui/react/pagination";

export function Buttons() {
  return <Pagination totalPages={24} defaultPage={8} />;
}

export function Links() {
  return <Pagination totalPages={10} page={3} getHref={(p) => `?page=${p}`} />;
}

export function Compact() {
  return <Pagination totalPages={12} defaultPage={2} variant="compact" size="sm" />;
}
