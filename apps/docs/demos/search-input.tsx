"use client";
import { useState } from "react";
import { SearchInput } from "@ux-sting/react/search-input";

export function Basic() {
  return <SearchInput className="max-w-sm" placeholder="Search restaurants, cafés…" shortcut="/" />;
}

export function Loading() {
  const [loading, setLoading] = useState(false);
  return (
    <SearchInput
      className="max-w-sm"
      loading={loading}
      onValueChange={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 600);
      }}
    />
  );
}
