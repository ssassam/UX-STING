import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "../form/form.js";
import { AddressFields, PaymentFields } from "./checkout-fields.js";

const meta = {
  title: "Commerce/Checkout fields",
  component: AddressFields,
  args: { legend: "Shipping address" },
  decorators: [(Story) => <Form className="max-w-xl">{Story()}</Form>],
} satisfies Meta<typeof AddressFields>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Address: Story = {};
export const Payment: Story = { render: () => <PaymentFields legend="Payment" /> };
export const DarkMode: Story = { globals: { mode: "dark" } };
