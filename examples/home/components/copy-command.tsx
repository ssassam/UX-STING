"use client";
import { CheckIcon, CopyIcon } from "@ux-sting/icons";
import { toast } from "@ux-sting/react/toast";
import { useState } from "react";

/** The install command as a copyable terminal line — the page's primary action. */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Copied — paste it in your project's terminal");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — select the command instead");
    }
  };
  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-sm border border-border-strong bg-background/70 py-1.5 ps-4 pe-1.5 ${className ?? ""}`}
    >
      <span aria-hidden className="measure text-primary">
        $
      </span>
      <code className="measure min-w-0 flex-1 truncate text-sm sm:text-base">{command}</code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-primary px-3 text-sm font-semibold text-primary-foreground outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {copied ? (
          <CheckIcon aria-hidden className="size-4" />
        ) : (
          <CopyIcon aria-hidden className="size-4" />
        )}
        {copied ? "Copied" : "Copy"}
        <span className="sr-only"> install command</span>
      </button>
    </div>
  );
}
