import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../field/field.js";
import { MultiSelect } from "../multi-select/multi-select.js";
import { Combobox } from "./combobox.js";

const options = ["Casablanca", "Rabat", "Marrakech", "Paris", "Lyon", "Madrid"].map((label, i) => ({ value: label.toLowerCase(), label, group: i < 3 ? "Morocco" : i < 5 ? "France" : "Spain" }));

const meta = { title: "Forms/Combobox", component: Combobox, args: { options } } satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Field label="City" className="max-w-xs"><Combobox {...args} /></Field> };
export const Loading: Story = { render: (args) => <Field label="City" className="max-w-xs"><Combobox {...args} loading onSearchChange={() => {}} /></Field> };
export const Multi: Story = { render: () => <Field label="Cities" className="max-w-md"><MultiSelect options={options} defaultValue={["rabat", "paris", "lyon", "madrid"]} maxVisible={2} /></Field> };
export const DarkMode: Story = { ...Multi, globals: { mode: "dark" } };
