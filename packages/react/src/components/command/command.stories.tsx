import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "./command.js";

const meta = { title: "Command/Command", component: Command } satisfies Meta<typeof Command>;
export default meta;
type Story = StoryObj;

const Demo = ({ loading, search }: { loading?: boolean; search?: string }) => (
  <Command
    label="Commands"
    loading={loading}
    defaultSearch={search}
    className="max-w-md rounded-lg border border-border"
  >
    <CommandInput />
    <CommandList>
      <CommandLoading />
      <CommandEmpty />
      <CommandGroup heading="Suggestions">
        <CommandItem value="Add a place" shortcut="⌘N" />
        <CommandItem value="Bookings" keywords={["reservations"]} />
        <CommandItem value="Billing" disabled />
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Account">
        <CommandItem value="Profile" />
        <CommandItem value="Settings" shortcut="⌘," />
      </CommandGroup>
    </CommandList>
  </Command>
);

export const Default: Story = { render: () => <Demo /> };
export const Filtered: Story = { render: () => <Demo search="set" /> };
export const Empty: Story = { render: () => <Demo search="zzzz" /> };
export const Loading: Story = { render: () => <Demo loading /> };
export const DarkMode: Story = { render: () => <Demo />, globals: { mode: "dark" } };
