import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const meta = { title: "Navigation/Tabs", component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj;

const Demo = ({
  variant,
  orientation,
}: {
  variant: "line" | "pills" | "enclosed";
  orientation?: "horizontal" | "vertical";
}) => (
  <Tabs defaultValue="a" variant={variant} orientation={orientation}>
    <TabsList aria-label="Sections">
      <TabsTrigger value="a">Overview</TabsTrigger>
      <TabsTrigger value="b">Menu</TabsTrigger>
      <TabsTrigger value="c">Reviews</TabsTrigger>
      <TabsTrigger value="d" disabled>
        Photos
      </TabsTrigger>
    </TabsList>
    <TabsContent value="a">Overview panel</TabsContent>
    <TabsContent value="b">Menu panel</TabsContent>
    <TabsContent value="c">Reviews panel</TabsContent>
  </Tabs>
);

export const Variants: Story = {
  render: () => (
    <div className="grid gap-8">
      <Demo variant="line" />
      <Demo variant="pills" />
      <Demo variant="enclosed" />
    </div>
  ),
};
export const Vertical: Story = { render: () => <Demo variant="line" orientation="vertical" /> };
export const FocusVisible: Story = { ...Variants, parameters: { pseudo: { focusVisible: true } } };
export const Mobile: Story = {
  ...Variants,
  parameters: { viewport: { defaultViewport: "mobile" } },
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
export const RTL: Story = { ...Variants, globals: { locale: "ar" } };
