"use client";
import {
  Blockquote,
  Caption,
  Code,
  Heading,
  Kbd,
  Label,
  Link,
  Prose,
  Text,
} from "@ux-sting/react/typography";

export function Headings() {
  return (
    <div className="grid gap-2">
      <Heading level={1}>Discover your city</Heading>
      <Heading level={2}>Top places this week</Heading>
      <Heading level={3}>Cafés near you</Heading>
      <Heading level={2} size="sm">
        Semantic h2, small visual size
      </Heading>
    </div>
  );
}

export function TextStyles() {
  return (
    <div className="grid gap-2">
      <Text size="lg">Large body text for introductions.</Text>
      <Text>Default body text is 16px with a comfortable line height.</Text>
      <Text variant="muted" size="sm">
        Muted supporting text.
      </Text>
      <Text variant="success" weight="medium">
        Payment received
      </Text>
      <Caption>Updated 2 minutes ago</Caption>
      <Text tabular>1,234,567.89</Text>
    </div>
  );
}

export function Inline() {
  return (
    <Text>
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, run <Code>pnpm add @ux-sting/react</Code>, or read
      the <Link href="#docs">documentation</Link> and the{" "}
      <Link href="https://www.w3.org/WAI/" external>
        WCAG guide
      </Link>
      .
    </Text>
  );
}

export function Quote() {
  return (
    <div className="grid gap-4">
      <Blockquote>Good design is as little design as possible.</Blockquote>
      <Label htmlFor="demo-input" required>
        Email
      </Label>
    </div>
  );
}

export function LongForm() {
  return (
    <Prose>
      <h2>Getting around</h2>
      <p>The old medina is best explored on foot. Most attractions are within a 20-minute walk.</p>
      <ul>
        <li>Tram line T1 connects the station and the beach.</li>
        <li>Taxis are metered — ask the driver to start the meter.</li>
      </ul>
    </Prose>
  );
}
