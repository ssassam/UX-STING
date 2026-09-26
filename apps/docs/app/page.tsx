import { Badge } from "@unified-ui/react/badge";
import { Button } from "@unified-ui/react/button";
import { Card, CardDescription, CardHeader, CardLink, CardTitle } from "@unified-ui/react/card";
import { Container } from "@unified-ui/react/container";
import { Heading, Text } from "@unified-ui/react/typography";
import { CodeBlock } from "../site/code-block";
import { FirstDemo } from "../site/demo";
import { componentsByCategory } from "../site/nav";

const pillars = [
  [
    "Accessible by default",
    "WCAG 2.2 AA: focus management, keyboard support, ARIA patterns and contrast-tested tokens.",
  ],
  ["Own your components", "Import from the package or copy source with `npx unified-ui add`."],
  [
    "Tokens & themes",
    "Semantic CSS variables, 13 presets including enterprise styles, custom themes, dark, high-contrast and density modes.",
  ],
  [
    "Global-ready",
    "RTL layouts with logical properties, localized labels (en/fr/ar) and Intl formatting.",
  ],
  [
    "Next.js & RSC",
    "Server components where possible, `use client` only where needed, per-component entry points.",
  ],
  [
    "Built for real products",
    "Dashboards, marketplaces, directories and editorial sites — patterns included.",
  ],
];

export default function Home() {
  const categories = componentsByCategory();
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section className="border-b border-border bg-surface">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-6">
            <Badge variant="primary" className="justify-self-start">
              v0.1 · {total} component families
            </Badge>
            <Heading level={1} size="3xl">
              One coherent, accessible UI system for React.
            </Heading>
            <Text size="lg" variant="muted">
              The customization of copy-paste components, the accessibility of proven primitives,
              the breadth of a full library, a real token system and a modern, light-first visual
              language.
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="/docs/installation">Get started</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/components">Browse components</a>
              </Button>
            </div>
          </div>
          <div className="min-w-0">
            <CodeBlock
              language="bash"
              code={"npx unified-ui init\nnpx unified-ui add button dialog data-table"}
            />
            <CodeBlock
              language="tsx"
              code={
                'import { Button } from "@unified-ui/react/button";\n\n<Button loading>Save</Button>'
              }
            />
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16">
        <section aria-labelledby="pillars" className="grid gap-6">
          <Heading id="pillars" level={2}>
            Why unified-ui
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(([title, text]) => (
              <Card key={title} variant="filled">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="preview" className="grid gap-6">
          <Heading id="preview" level={2}>
            Live preview
          </Heading>
          <FirstDemo name="business-card" />
        </section>

        <section aria-labelledby="catalog" className="grid gap-6">
          <Heading id="catalog" level={2}>
            Components
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ category, label, items }) => (
              <Card key={category} interactive>
                <CardHeader>
                  <CardTitle>
                    <CardLink href={`/components#${category}`}>{label}</CardLink>
                  </CardTitle>
                  <CardDescription>
                    {items
                      .map((i) => i.title)
                      .slice(0, 5)
                      .join(", ")}
                    {items.length > 5 ? "…" : ""}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
