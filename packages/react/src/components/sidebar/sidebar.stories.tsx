import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeIcon, InboxIcon, SettingsIcon } from "@ux-sting/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar.js";

const meta = { title: "Navigation/Sidebar", component: SidebarProvider } satisfies Meta<
  typeof SidebarProvider
>;
export default meta;
type Story = StoryObj;

const Shell = ({ collapsed }: { collapsed?: boolean }) => (
  <SidebarProvider defaultCollapsed={collapsed} className="min-h-[28rem]">
    <Sidebar label="App">
      <SidebarHeader>Atlas</SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Main">
          <SidebarItem href="#" icon={<HomeIcon />} active>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#" icon={<InboxIcon />}>
            Inbox
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem icon={<SettingsIcon />}>Settings</SidebarItem>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <div className="flex h-14 items-center border-b border-border px-3">
        <SidebarTrigger />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Expanded: Story = { render: () => <Shell /> };
export const Collapsed: Story = { render: () => <Shell collapsed /> };
export const DarkMode: Story = { render: () => <Shell />, globals: { mode: "dark" } };
export const RTL: Story = { render: () => <Shell />, globals: { locale: "ar" } };
