"use client";
import { cn } from "@unified-ui/utils";
import { useState, type ReactNode } from "react";
import { Avatar } from "../avatar/avatar.js";
import { ReviewStars } from "../rating/rating.js";

export interface ReviewCardProps {
  author: { name: string; avatar?: string; subtitle?: ReactNode };
  rating: number;
  date?: { display: ReactNode; dateTime: string };
  title?: ReactNode;
  body: string;
  /** Characters shown before "Read more". */
  truncateAt?: number;
  /** Owner response, photos, helpful votes… */
  footer?: ReactNode;
  badges?: ReactNode;
  readMoreLabel?: string;
  readLessLabel?: string;
  className?: string;
}

/** Customer review with rating, expandable text and optional owner reply. */
export function ReviewCard({ author, rating, date, title, body, truncateAt = 280, footer, badges, readMoreLabel = "Read more", readLessLabel = "Show less", className }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const long = body.length > truncateAt;
  const text = long && !expanded ? `${body.slice(0, truncateAt).trimEnd()}…` : body;
  return (
    <article className={cn("grid gap-3 rounded-xl border border-border bg-card p-card-p", className)}>
      <header className="flex items-start gap-3">
        <Avatar src={author.avatar} name={author.name} alt="" size="sm" />
        <div className="grid min-w-0 flex-1">
          <p className="text-sm font-semibold">{author.name}</p>
          {author.subtitle ? <p className="text-xs text-muted-foreground">{author.subtitle}</p> : null}
        </div>
        {badges}
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <ReviewStars value={rating} size="sm" />
        {date ? (
          <time dateTime={date.dateTime} className="text-xs text-muted-foreground">
            {date.display}
          </time>
        ) : null}
      </div>
      {title ? <h3 className="font-semibold">{title}</h3> : null}
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{text}</p>
      {long ? (
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="justify-self-start rounded-xs text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">
          {expanded ? readLessLabel : readMoreLabel}
        </button>
      ) : null}
      {footer}
    </article>
  );
}
