import { cn } from "@unified-ui/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { Highlight } from "../highlight/highlight.js";

export interface SearchResultProps {
  title: string;
  href: string;
  description?: string;
  /** Breadcrumb or display URL. */
  path?: ReactNode;
  /** Terms to highlight. */
  query?: string;
  meta?: ReactNode;
  thumbnail?: ReactNode;
  className?: string;
}

/** One search hit: title link, path, snippet with highlighted terms. */
export function SearchResult({ title, href, description, path, query = "", meta, thumbnail, className }: SearchResultProps) {
  return (
    <article className={cn("group relative flex gap-4 rounded-lg p-3 transition-colors hover:bg-surface has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring", className)}>
      {thumbnail ? <div className="shrink-0">{thumbnail}</div> : null}
      <div className="grid min-w-0 flex-1 gap-1">
        {path ? <div className="truncate text-xs text-muted-foreground">{path}</div> : null}
        <h3 className="text-md font-semibold leading-snug">
          <a href={href} className="text-primary outline-none after:absolute after:inset-0 group-hover:underline">
            <Highlight text={title} query={query} />
          </a>
        </h3>
        {description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            <Highlight text={description} query={query} />
          </p>
        ) : null}
        {meta ? <div className="relative z-[1] mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{meta}</div> : null}
      </div>
    </article>
  );
}

export interface SearchResultsProps extends HTMLAttributes<HTMLElement> {
  /** e.g. "248 results for “pizza”" — announced politely. */
  summary?: ReactNode;
  /** Sort control / view toggle. */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** Results container with an announced summary and toolbar. */
export function SearchResults({ summary, toolbar, className, children, ...props }: SearchResultsProps) {
  return (
    <section className={cn("grid gap-4", className)} {...props}>
      {summary || toolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {summary}
          </p>
          {toolbar}
        </div>
      ) : null}
      {children}
    </section>
  );
}
