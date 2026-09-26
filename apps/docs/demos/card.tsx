"use client";
import { Badge } from "@ux-sting/react/badge";
import { Button, IconButton } from "@ux-sting/react/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardMedia,
  CardTitle,
} from "@ux-sting/react/card";
import { EllipsisIcon } from "@ux-sting/icons";
import { img } from "./_data";

export function Composition() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>March 2026</CardDescription>
        <CardAction>
          <IconButton aria-label="More options" size="sm" variant="ghost">
            <EllipsisIcon />
          </IconButton>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">€48,210</p>
      </CardContent>
      <CardFooter>
        <Badge variant="success">+12.4%</Badge>
        <span className="text-sm text-muted-foreground">vs last month</span>
      </CardFooter>
    </Card>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(["default", "elevated", "filled", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>Card variant</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function Clickable() {
  return (
    <Card interactive className="max-w-xs">
      <CardMedia>
        <img src={img("photo-1554118811-1e0d58224f24", 600)} alt="" />
      </CardMedia>
      <CardHeader>
        <CardTitle>
          <CardLink href="#">Café Atlas</CardLink>
        </CardTitle>
        <CardDescription>Specialty coffee · Gauthier</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="outline" className="relative z-10">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
