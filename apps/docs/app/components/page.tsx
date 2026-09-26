import { Card, CardDescription, CardHeader, CardLink, CardTitle } from "@unified-ui/react/card";
import { Heading, Text } from "@unified-ui/react/typography";
import type { Metadata } from "next";
import { DocsLayout } from "../../site/docs-nav";
import { componentsByCategory } from "../../site/nav";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsIndex() {
  return (
    <DocsLayout current="/components">
      <div className="grid gap-10">
        <header className="grid gap-2">
          <Heading level={1}>Components</Heading>
          <Text variant="muted">
            Every component works from the package (`@unified-ui/react/&lt;name&gt;`) or as copied
            source via the CLI.
          </Text>
        </header>
        {componentsByCategory().map(({ category, label, items }) => (
          <section
            key={category}
            id={category}
            aria-labelledby={`${category}-h`}
            className="grid gap-4"
          >
            <Heading id={`${category}-h`} level={2} size="md">
              {label}
            </Heading>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => (
                <Card key={c.name} interactive>
                  <CardHeader>
                    <CardTitle as="h3" className="text-md">
                      <CardLink href={`/components/${c.name}`}>{c.title}</CardLink>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  );
}
