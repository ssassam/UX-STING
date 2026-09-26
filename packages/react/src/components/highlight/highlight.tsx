import { cn } from "@ux-sting/utils";

export interface HighlightProps {
  text: string;
  /** Terms to highlight (case/accents-insensitive). */
  query: string | string[];
  className?: string;
  markClassName?: string;
}

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Highlights matched terms with `<mark>` (search results, command menus). */
export function Highlight({ text, query, className, markClassName }: HighlightProps) {
  const terms = (Array.isArray(query) ? query : query.split(/\s+/))
    .map((t) => normalize(t.trim()))
    .filter(Boolean);
  if (!terms.length) return <span className={className}>{text}</span>;
  const normalized = normalize(text);
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    let from = 0;
    let i: number;
    while ((i = normalized.indexOf(term, from)) !== -1) {
      ranges.push([i, i + term.length]);
      from = i + term.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const parts: Array<{ text: string; match: boolean }> = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start < cursor) continue;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), match: false });
    parts.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.match ? (
          <mark
            key={i}
            className={cn(
              "rounded-xs bg-warning-subtle px-0.5 text-warning-subtle-foreground",
              markClassName,
            )}
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </span>
  );
}
