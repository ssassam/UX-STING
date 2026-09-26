import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Heading } from "@unified-ui/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsLayout } from "../../../site/docs-nav";
import { Markdown, slugify } from "../../../site/markdown";
import { guides } from "../../../site/nav";

const docsDir = join(process.cwd(), "../../docs");

function load(slug: string) {
  try {
    return readFileSync(join(docsDir, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: guides.find((g) => g.slug === slug)?.title ?? "Docs" };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  const source = guide ? load(slug) : null;
  if (!guide || !source) notFound();
  const headings = [...source.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]!);
  const index = guides.findIndex((g) => g.slug === slug);
  const prev = guides[index - 1];
  const next = guides[index + 1];
  return (
    <DocsLayout
      current={`/docs/${slug}`}
      toc={
        headings.length ? (
          <nav aria-label="On this page" className="grid gap-1 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              On this page
            </p>
            {headings.map((h) => (
              <a
                key={h}
                href={`#${slugify(h)}`}
                className="rounded-sm py-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {h.replace(/`/g, "")}
              </a>
            ))}
          </nav>
        ) : undefined
      }
    >
      <article className="docs-prose max-w-3xl">
        <Heading level={1}>{guide.title}</Heading>
        <Markdown source={source} />
        <nav
          aria-label="Pagination"
          className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm"
        >
          {prev ? <a href={`/docs/${prev.slug}`}>← {prev.title}</a> : <span />}
          {next ? <a href={`/docs/${next.slug}`}>{next.title} →</a> : <span />}
        </nav>
      </article>
    </DocsLayout>
  );
}
