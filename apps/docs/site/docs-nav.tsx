import type { ReactNode } from "react";
import { componentsByCategory, guides } from "./nav";

export function DocsNav({ current }: { current?: string }) {
  const linkClass =
    "block rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-primary-subtle aria-[current=page]:font-medium aria-[current=page]:text-primary-subtle-foreground";
  return (
    <nav aria-label="Documentation" className="grid gap-6 text-sm">
      <div>
        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Guides
        </p>
        <ul>
          {guides.map((g) => (
            <li key={g.slug}>
              <a
                href={`/docs/${g.slug}`}
                aria-current={current === `/docs/${g.slug}` ? "page" : undefined}
                className={linkClass}
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {componentsByCategory().map(({ category, label, items }) => (
        <div key={category}>
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <ul>
            {items.map((c) => (
              <li key={c.name}>
                <a
                  href={`/components/${c.name}`}
                  aria-current={current === `/components/${c.name}` ? "page" : undefined}
                  className={linkClass}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsLayout({
  current,
  children,
  toc,
}: {
  current?: string;
  children: ReactNode;
  toc?: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
      <aside aria-label="Documentation navigation" className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pe-2">
          <DocsNav current={current} />
        </div>
      </aside>
      <main id="main" tabIndex={-1} className="min-w-0 outline-none">
        {children}
      </main>
      {toc ? (
        <aside aria-label="Table of contents" className="hidden xl:block">
          <div className="sticky top-20">{toc}</div>
        </aside>
      ) : null}
    </div>
  );
}
