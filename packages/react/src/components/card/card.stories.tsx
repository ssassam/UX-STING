import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from "./card.js";

const meta = { title: "Data display/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(["default", "elevated", "filled", "ghost"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader>
            <CardTitle>{v}</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      ))}
    </div>
  ),
};
export const Interactive: Story = {
  render: () => (
    <Card interactive className="max-w-xs">
      <CardHeader>
        <CardTitle>
          <CardLink href="#">Café Atlas</CardLink>
        </CardTitle>
        <CardDescription>Whole card is clickable via one link.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
export const FocusVisible: Story = {
  ...Interactive,
  parameters: { pseudo: { focusVisible: ["a"] } },
};
export const Mobile: Story = {
  ...Variants,
  parameters: { viewport: { defaultViewport: "mobile" } },
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
