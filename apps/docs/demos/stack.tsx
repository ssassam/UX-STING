"use client";
import { Button } from "@unified-ui/react/button";
import { HStack, Spacer, Stack } from "@unified-ui/react/stack";

const Item = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md bg-primary-subtle px-4 py-3 text-sm font-medium text-primary-subtle-foreground">{children}</div>
);

export function Basic() {
  return (
    <Stack gap="3">
      <Item>First</Item>
      <Item>Second</Item>
      <Item>Third</Item>
    </Stack>
  );
}

export function Responsive() {
  return (
    <Stack gap={{ base: "2", md: "6" }} direction={{ base: "column", md: "row" }}>
      <Item>Column on mobile</Item>
      <Item>Row from md</Item>
      <Item>Gap grows too</Item>
    </Stack>
  );
}

export function Toolbar() {
  return (
    <HStack gap="2" className="rounded-lg border border-border p-2">
      <Button size="sm" variant="ghost">Back</Button>
      <Spacer />
      <Button size="sm" variant="outline">Preview</Button>
      <Button size="sm">Publish</Button>
    </HStack>
  );
}
