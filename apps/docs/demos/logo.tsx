"use client";
import { Logo } from "@ux-sting/react/logo";

/** An original sample mark: a quarter-circle "sting" cut from a rounded square. */
function SampleMark() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M64 16h128a48 48 0 0 1 48 48v128a48 48 0 0 1-48 48H64a48 48 0 0 1-48-48V64a48 48 0 0 1 48-48Zm8 168a112 112 0 0 1 112-112v56a56 56 0 0 0-56 56Z"
      />
    </svg>
  );
}

export function Layouts() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Logo name="Northwind" mark={<SampleMark />} />
      <Logo name="Northwind" mark={<SampleMark />} layout="stacked" />
      <Logo name="Northwind" mark={<SampleMark />} layout="mark" />
      <Logo name="Northwind" layout="wordmark" />
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Logo key={size} name="Northwind" mark={<SampleMark />} size={size} />
      ))}
    </div>
  );
}

export function Tones() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="rounded-lg border border-border p-4">
        <Logo name="Northwind" mark={<SampleMark />} tone="brand" />
      </div>
      <div className="rounded-lg border border-border p-4 text-foreground">
        <Logo name="Northwind" mark={<SampleMark />} tone="mono" />
      </div>
      <div className="rounded-lg bg-primary p-4">
        <Logo name="Northwind" mark={<SampleMark />} tone="reversed" />
      </div>
    </div>
  );
}

export function HomeLink() {
  return <Logo name="Northwind" label="Northwind home" mark={<SampleMark />} href="#" />;
}
