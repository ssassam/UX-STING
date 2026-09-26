import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "./avatar.js";

const meta = { title: "Data display/Avatar", component: Avatar, args: { name: "Yasmine Benali" } } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = { render: (args) => <div className="flex items-end gap-3">{(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Avatar key={s} {...args} size={s} />)}</div> };
export const Status: Story = { render: () => <div className="flex gap-3">{(["online", "offline", "busy", "away"] as const).map((s) => <Avatar key={s} name={s} status={s} statusLabel={s} />)}</div> };
export const EdgeCases: Story = { render: () => <div className="flex gap-3"><Avatar name="" /><Avatar name="Émile Zoé" /><Avatar name="محمد علي" /><Avatar name="Broken" src="https://example.invalid/x.png" /><Avatar name="Square" shape="square" /></div> };
export const Group: Story = { render: () => <AvatarGroup max={3}>{["A B", "C D", "E F", "G H", "I J"].map((n) => <Avatar key={n} name={n} />)}</AvatarGroup> };
export const DarkMode: Story = { ...EdgeCases, globals: { mode: "dark" } };
