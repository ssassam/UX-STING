import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "./code-block";

/**
 * Minimal Markdown renderer for the guides (headings, paragraphs, lists,
 * tables, code fences, blockquotes, inline code/bold/italic/links). Keeps
 * the docs dependency-free.
 */
function inline(text: string, keyPrefix = ""): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*|_[^_]+_)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("`")) out.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (token.startsWith("**")) out.push(<strong key={key}>{inline(token.slice(2, -2), key)}</strong>);
    else if (token.startsWith("[")) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)!;
      const url = href!.replace(/^\.\/(.+)\.md$/, "/docs/$1").replace(/^\.\.\/.*?([\w-]+)\.md$/, "/docs/$1");
      out.push(
        <a key={key} href={url}>
          {inline(label!, key)}
        </a>,
      );
    } else out.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.startsWith("```")) code.push(lines[i++]!);
      i++;
      blocks.push(<CodeBlock key={key++} code={code.join("\n")} language={lang} />);
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const text = heading[2]!;
      if (level === 1) {
        i++;
        continue;
      }
      const Tag = `h${level}` as "h2";
      blocks.push(
        <Tag key={key++} id={slugify(text)}>
          {inline(text)}
        </Tag>,
      );
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith("|")) {
        const cells = lines[i]!.split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={key++} tabIndex={0} role="region" aria-label="Table" className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <table>
            <thead>
              <tr>{head?.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i]!)) {
        items.push(lines[i]!.replace(/^\s*([-*]|\d+\.)\s/, ""));
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={key++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it.replace(/^\[( |x)\]\s/, (_, c) => (c === "x" ? "✅ " : "☐ ")))}</li>
          ))}
        </List>,
      );
      continue;
    }
    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i]!.startsWith(">")) quote.push(lines[i++]!.replace(/^>\s?/, ""));
      blocks.push(<blockquote key={key++}>{inline(quote.join(" "))}</blockquote>);
      continue;
    }
    if (line.trim() === "" || line.trim() === "---") {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i]!.trim() !== "" && !/^(#|```|\||>|\s*([-*]|\d+\.)\s)/.test(lines[i]!)) para.push(lines[i++]!);
    blocks.push(<p key={key++}>{inline(para.join(" "))}</p>);
  }
  return <Fragment>{blocks}</Fragment>;
}
