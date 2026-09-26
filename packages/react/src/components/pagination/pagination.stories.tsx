import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination.js";

const meta = { title: "Navigation/Pagination", component: Pagination, args: { totalPages: 24, defaultPage: 8 } } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstPage: Story = { args: { defaultPage: 1 } };
export const Links: Story = { args: { page: 3, totalPages: 10, getHref: (p: number) => `?page=${p}` } };
export const Compact: Story = { args: { variant: "compact", size: "sm" } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile" } } };
export const RTL: Story = { globals: { locale: "ar" } };
