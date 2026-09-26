import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, PencilIcon, Trash2Icon } from "@ux-sting/icons";
import { Button } from "../button/button.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

const meta = { title: "Overlays/DropdownMenu", component: DropdownMenu } satisfies Meta<
  typeof DropdownMenu
>;
export default meta;
type Story = StoryObj;

const Demo = ({ open }: { open?: boolean }) => (
  <div className="h-72">
    <DropdownMenu defaultOpen={open} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Listing</DropdownMenuLabel>
        <DropdownMenuItem icon={<PencilIcon />} shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem icon={<CopyIcon />} shortcut="⌘D">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Show on map</DropdownMenuCheckboxItem>
        <DropdownMenuItem disabled>Archive (disabled)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" icon={<Trash2Icon />}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const Closed: Story = { render: () => <Demo /> };
export const Open: Story = { render: () => <Demo open /> };
export const DarkMode: Story = { render: () => <Demo open />, globals: { mode: "dark" } };
export const RTL: Story = { render: () => <Demo open />, globals: { locale: "ar" } };
