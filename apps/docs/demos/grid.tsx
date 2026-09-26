"use client";
import { Grid, GridItem } from "@unified-ui/react/grid";

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-20 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
    {children}
  </div>
);

export function Responsive() {
  return (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i}>{i + 1}</Cell>
      ))}
    </Grid>
  );
}

export function AutoFill() {
  return (
    <Grid minChildWidth="10rem" gap="3">
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i}>min 10rem</Cell>
      ))}
    </Grid>
  );
}

export function Spanning() {
  return (
    <Grid columns={3} gap="3">
      <GridItem span="full">
        <Cell>Full width</Cell>
      </GridItem>
      <GridItem span={2}>
        <Cell>Span 2</Cell>
      </GridItem>
      <Cell>1</Cell>
    </Grid>
  );
}
