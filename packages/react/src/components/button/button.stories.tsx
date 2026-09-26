import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ArrowRightIcon, PlusIcon, Trash2Icon } from "@unified-ui/icons";
import { Button, IconButton } from "./button.js";
import { ButtonGroup } from "./button-group.js";

const meta = {
  title: "Buttons/Button",
  component: Button,
  args: { children: "Save changes" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline", "ghost", "link", "destructive", "success", "warning"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive", "success", "warning"] as const;
const Row = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => <Row>{variants.map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}</Row>,
};

export const Sizes: Story = {
  render: (args) => <Row>{(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Button key={s} {...args} size={s}>Size {s}</Button>)}</Row>,
};

export const Hover: Story = { ...Variants, parameters: { pseudo: { hover: true } } };
export const FocusVisible: Story = { ...Variants, parameters: { pseudo: { focusVisible: true } } };
export const Active: Story = { ...Variants, parameters: { pseudo: { active: true } } };
export const Disabled: Story = { render: (args) => <Row>{variants.map((v) => <Button key={v} {...args} variant={v} disabled>{v}</Button>)}</Row> };
export const Loading: Story = { args: { loading: true, loadingText: "Saving…" } };
export const WithIcons: Story = {
  render: () => (
    <Row>
      <Button startIcon={<PlusIcon />}>New listing</Button>
      <Button variant="outline" endIcon={<ArrowRightIcon className="rtl:rotate-180" />}>Continue</Button>
      <IconButton aria-label="Delete" variant="outline"><Trash2Icon /></IconButton>
      <ButtonGroup attached aria-label="Format">
        <Button variant="outline">CSV</Button>
        <Button variant="outline">PDF</Button>
      </ButtonGroup>
    </Row>
  ),
};
export const LongContent: Story = {
  args: { children: "A very long label that should never overflow its container on small screens", fullWidth: true },
  parameters: { viewport: { defaultViewport: "mobile" } },
};
export const DarkMode: Story = { ...Variants, globals: { mode: "dark" } };
export const RTL: Story = { ...WithIcons, globals: { locale: "ar" } };
