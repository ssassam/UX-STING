"use client";
import { CheckIcon, CopyIcon } from "@ux-sting/icons";
import { toast } from "@ux-sting/react/toast";
import { useState } from "react";

/** A shell command with a copy button (copy confirms with a toast). */
export function Command({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      toast.success("Command copied");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed — select the text instead");
    }
  };
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-sm border border-border bg-surface py-2 ps-3 pe-2 font-mono text-sm">
      <span aria-hidden="true" className="text-primary select-none">
        $
      </span>
      <code className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={copied ? "Copied" : `Copy command: ${children}`}
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </button>
    </div>
  );
}
