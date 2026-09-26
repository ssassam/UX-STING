import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../field/field.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

const meta = { title: "Forms/Select", component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj;

const Demo = (props: { invalid?: boolean; disabled?: boolean; open?: boolean }) => (
  <Field
    label="Sort by"
    className="max-w-xs"
    error={props.invalid ? "Choose a sort order." : undefined}
    disabled={props.disabled}
  >
    <Select defaultValue={props.invalid ? undefined : "rating"} defaultOpen={props.open}>
      <SelectTrigger>
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Relevance</SelectItem>
        <SelectItem value="rating">Highest rated</SelectItem>
        <SelectItem value="distance">Nearest</SelectItem>
        <SelectItem value="price" disabled>
          Price (soon)
        </SelectItem>
      </SelectContent>
    </Select>
  </Field>
);

export const Default: Story = { render: () => <Demo /> };
export const Open: Story = {
  render: () => (
    <div className="h-64">
      <Demo open />
    </div>
  ),
};
export const Error: Story = { render: () => <Demo invalid /> };
export const Disabled: Story = { render: () => <Demo disabled /> };
export const DarkMode: Story = { ...Open, globals: { mode: "dark" } };
