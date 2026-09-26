"use client";
import { useClipboard } from "@unified-ui/hooks";
import { CheckIcon, CopyIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const { copy, copied } = useClipboard();
  return (
    <div
      className={cn(
        "group relative my-4 overflow-hidden rounded-lg border border-border bg-surface",
        className,
      )}
    >
      {language ? (
        <div className="border-b border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
          {language}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => copy(code)}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute end-2 top-1.5 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre
        dir="ltr"
        tabIndex={0}
        aria-label={language ? `${language} code` : "Code"}
        className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
