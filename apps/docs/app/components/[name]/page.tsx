import { Badge } from "@unified-ui/react/badge";
import { Heading, Text } from "@unified-ui/react/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import api from "../../../../../registry/api.json";
import { CodeBlock } from "../../../site/code-block";
import { ComponentDemos } from "../../../site/demo";
import { DocsLayout } from "../../../site/docs-nav";
import { CATEGORY_LABELS, components } from "../../../site/nav";
import { PropsTable, type ExportDoc } from "../../../site/props-table";

const apiDocs = api as Record<string, Record<string, ExportDoc>>;

export function generateStaticParams() {
  return components.map((c) => ({ name: c.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const meta = components.find((c) => c.name === name);
  return meta ? { title: meta.title, description: meta.description } : {};
}

const sections = [
  ["overview", "Overview"],
  ["installation", "Installation"],
  ["examples", "Examples"],
  ["accessibility", "Accessibility"],
  ["composition", "Composition"],
  ["customization", "Customization"],
  ["dark-mode", "Dark mode"],
  ["responsive", "Responsive behavior"],
  ["api", "API"],
] as const;

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const meta = components.find((c) => c.name === name);
  if (!meta) notFound();
  const exports = apiDocs[name] ?? {};
  const componentExports = Object.entries(exports).filter(([, d]) => d.kind === "component");
  const primary = meta.primary ?? meta.title.replace(/\s/g, "");
  componentExports.sort(([a], [b]) => (a === primary ? -1 : b === primary ? 1 : 0));
  const importNames = componentExports.slice(0, 4).map(([n]) => n).join(", ") || primary;

  const toc = (
    <nav aria-label="On this page" className="grid gap-1 text-sm">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      {sections.map(([id, label]) => (
        <a key={id} href={`#${id}`} className="rounded-sm py-0.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none">
          {label}
        </a>
      ))}
    </nav>
  );

  return (
    <DocsLayout current={`/components/${name}`} toc={toc}>
      <article className="grid grid-cols-[minmax(0,1fr)] gap-12">
        <header id="overview" className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{CATEGORY_LABELS[meta.category]}</Badge>
            <Badge variant="outline">@unified-ui/react/{meta.name}</Badge>
          </div>
          <Heading level={1}>{meta.title}</Heading>
          <Text size="lg" variant="muted">{meta.description}</Text>
          <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-semibold">When to use</p>
              <p className="text-muted-foreground">{meta.when}</p>
            </div>
            {meta.avoid ? (
              <div>
                <p className="font-semibold">Consider instead</p>
                <p className="text-muted-foreground">{meta.avoid}</p>
              </div>
            ) : null}
          </div>
        </header>

        <section id="installation" aria-labelledby="installation-h" className="grid gap-2">
          <Heading id="installation-h" level={2} size="md">Installation</Heading>
          <Text size="sm" variant="muted">Import the package entry point (tree-shakeable) …</Text>
          <CodeBlock language="tsx" code={`import { ${importNames} } from "@unified-ui/react/${meta.name}";`} className="my-0" />
          <Text size="sm" variant="muted">… or copy the source into your project and own it:</Text>
          <CodeBlock language="bash" code={`npx unified-ui add ${meta.name}`} className="my-0" />
        </section>

        <section id="examples" aria-labelledby="examples-h" className="grid gap-4">
          <Heading id="examples-h" level={2} size="md">Examples</Heading>
          <Text size="sm" variant="muted">Each example can be previewed in light/dark mode, LTR/RTL and at mobile, tablet or desktop widths.</Text>
          <ComponentDemos name={meta.name} />
        </section>

        <section id="accessibility" aria-labelledby="a11y-h" className="grid gap-3">
          <Heading id="a11y-h" level={2} size="md">Accessibility</Heading>
          <ul className="grid list-disc gap-1 ps-5 text-sm">
            {meta.a11y.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          {meta.keyboard?.length ? (
            <div tabIndex={0} role="region" aria-label="Keyboard interactions" className="overflow-x-auto rounded-lg border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <table className="w-full text-sm">
                <caption className="sr-only">Keyboard interactions</caption>
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-start">Keys</th>
                    <th scope="col" className="px-3 py-2 text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.keyboard.map(([k, a]) => (
                    <tr key={k} className="border-t border-border">
                      <td className="px-3 py-2"><kbd className="font-mono text-xs">{k}</kbd></td>
                      <td className="px-3 py-2">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section id="composition" aria-labelledby="composition-h" className="grid gap-2">
          <Heading id="composition-h" level={2} size="md">Composition</Heading>
          <Text size="sm" variant="muted">Build UIs by composing these parts rather than configuring one large component:</Text>
          <div className="flex flex-wrap gap-2">
            {componentExports.map(([n]) => (
              <Badge key={n} variant="outline" className="font-mono">{n}</Badge>
            ))}
          </div>
        </section>

        <section id="customization" aria-labelledby="customization-h" className="grid gap-2">
          <Heading id="customization-h" level={2} size="md">Customization</Heading>
          <Text size="sm">
            Every part accepts <code>className</code>, merged with <code>cn()</code> so your classes win. Change the look globally through
            tokens (<code>--ui-primary</code>, <code>--ui-radius</code>, density variables) or a theme; change structure by copying the source
            with the CLI.
          </Text>
        </section>

        <section id="dark-mode" aria-labelledby="dark-h" className="grid gap-2">
          <Heading id="dark-h" level={2} size="md">Dark mode</Heading>
          <Text size="sm">
            {meta.title} only uses semantic tokens, so it adapts automatically under <code>data-theme=&quot;dark&quot;</code> or
            <code> high-contrast</code>. Use the moon toggle on any example above to preview it.
          </Text>
        </section>

        <section id="responsive" aria-labelledby="responsive-h" className="grid gap-2">
          <Heading id="responsive-h" level={2} size="md">Responsive behavior</Heading>
          <Text size="sm">
            {meta.responsive ??
              "Fluid by default: widths follow the container, text stays readable and touch targets expand to 44px on coarse pointers. Preview mobile and tablet widths with the device toggle on each example."}
          </Text>
        </section>

        <section id="api" aria-labelledby="api-h" className="grid gap-6">
          <Heading id="api-h" level={2} size="md">API</Heading>
          {componentExports.map(([n, doc]) => (
            <PropsTable key={n} name={n} doc={doc} />
          ))}
        </section>

        {meta.related?.length ? (
          <nav aria-label="Related components" className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Related:</span>
            {meta.related.map((r) => (
              <a key={r} href={`/components/${r}`} className="text-primary underline underline-offset-4">
                {components.find((c) => c.name === r)?.title ?? r}
              </a>
            ))}
          </nav>
        ) : null}
      </article>
    </DocsLayout>
  );
}
