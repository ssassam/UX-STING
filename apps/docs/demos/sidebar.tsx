"use client";
import { Badge } from "@unified-ui/react/badge";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarItem, SidebarProvider, SidebarTrigger } from "@unified-ui/react/sidebar";

import { CalendarIcon, ChartBarIcon as BarChart, InboxIcon, LayoutDashboardIcon, SettingsIcon, StoreIcon, UsersIcon } from "@unified-ui/icons";

export function AppShell() {
  return (
    <div className="h-[28rem] overflow-hidden rounded-lg border border-border">
      <SidebarProvider className="min-h-0 h-full" shortcut={false}>
        <Sidebar label="Dashboard" className="h-full">
          <SidebarHeader>
            <StoreIcon className="size-5 text-primary" />
            <span className="truncate font-semibold group-data-collapsed/sidebar:sr-only">Atlas Admin</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Overview">
              <SidebarItem href="#" icon={<LayoutDashboardIcon />} active>Dashboard</SidebarItem>
              <SidebarItem href="#" icon={<InboxIcon />} badge={<Badge size="sm">12</Badge>}>Inbox</SidebarItem>
              <SidebarItem href="#" icon={<BarChart />}>Analytics</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Manage">
              <SidebarItem href="#" icon={<StoreIcon />}>Listings</SidebarItem>
              <SidebarItem href="#" icon={<CalendarIcon />}>Bookings</SidebarItem>
              <SidebarItem href="#" icon={<UsersIcon />}>Customers</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<SettingsIcon />}>Settings</SidebarItem>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset as="div">
          <div className="flex h-14 items-center gap-2 border-b border-border px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="p-4 text-sm text-muted-foreground">Content area. Collapse the sidebar to see the icon rail with tooltips.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
