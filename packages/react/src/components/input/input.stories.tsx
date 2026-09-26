import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../field/field.js";
import { Input } from "./input.js";

const meta = { title: "Forms/Input", component: Input, args: { placeholder: "you@example.com" } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Field label="Email" className="max-w-sm"><Input type="email" {...args} /></Field> };
export const Sizes: Story = { render: () => <div className="grid max-w-sm gap-3">{(["sm", "md", "lg"] as const).map((s) => <Input key={s} size={s} aria-label={s} placeholder={`Size ${s}`} />)}</div> };
export const Hover: Story = { ...Default, parameters: { pseudo: { hover: true } } };
export const FocusVisible: Story = { ...Default, parameters: { pseudo: { focusVisible: true } } };
export const Disabled: Story = { render: () => <Field label="Email" disabled className="max-w-sm"><Input defaultValue="ada@example.com" /></Field> };
export const Error: Story = { render: () => <Field label="Email" error="Enter a valid email address." required className="max-w-sm"><Input defaultValue="ada@" /></Field> };
export const Filled: Story = { render: () => <Input variant="filled" aria-label="Search" placeholder="Filled variant" className="max-w-sm" /> };
export const DarkMode: Story = { ...Error, globals: { mode: "dark" } };
export const RTL: Story = { ...Error, globals: { locale: "ar" } };
