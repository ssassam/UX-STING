import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCard, RadioGroup, Radio } from "../radio-group/radio-group.js";
import { Switch } from "../switch/switch.js";
import { Checkbox, CheckboxGroup } from "./checkbox.js";

const meta = { title: "Forms/Choice controls", component: Checkbox } satisfies Meta<
  typeof Checkbox
>;
export default meta;
type Story = StoryObj;

export const States: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="grid gap-3">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Invalid" invalid />
      </div>
      <RadioGroup aria-label="Plan" defaultValue="pro">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" description="Most popular" />
        <Radio value="team" label="Disabled" disabled />
      </RadioGroup>
      <div className="grid gap-3">
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
        <Switch label="Small" size="sm" defaultChecked />
        <Switch label="Disabled" disabled />
      </div>
    </div>
  ),
};
export const FocusVisible: Story = { ...States, parameters: { pseudo: { focusVisible: true } } };
export const Group: Story = {
  render: () => (
    <CheckboxGroup
      legend="Amenities"
      defaultValue={["wifi"]}
      orientation="horizontal"
      error="Choose at least two amenities."
    >
      <Checkbox value="wifi" label="Wi-Fi" />
      <Checkbox value="parking" label="Parking" />
      <Checkbox value="terrace" label="Terrace" />
    </CheckboxGroup>
  ),
};
export const Cards: Story = {
  render: () => (
    <RadioGroup
      aria-label="Plan"
      defaultValue="pro"
      className="grid max-w-2xl gap-3 sm:grid-cols-3"
    >
      <RadioCard value="free" label="Free" description="1 listing" />
      <RadioCard value="pro" label="Pro" description="10 listings" />
      <RadioCard value="biz" label="Business" description="Unlimited" />
    </RadioGroup>
  ),
};
export const DarkMode: Story = { ...States, globals: { mode: "dark" } };
export const RTL: Story = { ...States, globals: { locale: "ar" } };
