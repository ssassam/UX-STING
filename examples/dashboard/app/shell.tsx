"use client";
import {
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  StoreIcon,
  UserIcon,
  UsersIcon,
} from "@unified-ui/icons";
import { Avatar } from "@unified-ui/react/avatar";
import { Badge, CountBadge } from "@unified-ui/react/badge";
import { Button, IconButton } from "@unified-ui/react/button";
import { ColorModeToggle } from "@unified-ui/react/color-mode-toggle";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@unified-ui/react/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@unified-ui/react/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarItem, SidebarProvider, SidebarTrigger } from "@unified-ui/react/sidebar";
import { Kbd } from "@unified-ui/react/typography";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const nav = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboardIcon /> },
  { href: "/bookings", label: "Bookings", icon: <CalendarIcon />, badge: 4 },
  { href: "/analytics", label: "Analytics", icon: <ChartBarIcon /> },
  { href: "/listings", label: "Listings", icon: <StoreIcon /> },
  { href: "/customers", label: "Customers", icon: <UsersIcon /> },
  { href: "/inbox", label: "Inbox", icon: <InboxIcon />, badge: 12 },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <SidebarProvider>
      <Sidebar label="Main navigation">
        <SidebarHeader>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground [&_svg]:size-4">
            <StoreIcon />
          </span>
          <span className="truncate font-semibold group-data-collapsed/sidebar:sr-only">Atlas Admin</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Workspace">
            {nav.map((item) => (
              <SidebarItem
                key={item.href}
                asChild
                active={pathname === item.href}
                tooltip={item.label}
              >
                <NextLink href={item.href}>
                  {item.icon}
                  <span className="flex-1 truncate group-data-collapsed/sidebar:sr-only">{item.label}</span>
                  {item.badge ? <Badge size="sm" variant="secondary" className="group-data-collapsed/sidebar:hidden">{item.badge}</Badge> : null}
                </NextLink>
              </SidebarItem>
            ))}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem asChild active={pathname === "/settings"} tooltip="Settings">
            <NextLink href="/settings">
              <SettingsIcon />
              <span className="group-data-collapsed/sidebar:sr-only">Settings</span>
            </NextLink>
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-(--ui-z-header) flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger />
          <Button variant="outline" size="sm" className="ms-1 w-full min-w-0 max-w-64 shrink justify-start text-muted-foreground" startIcon={<SearchIcon />} onClick={() => setPaletteOpen(true)} aria-label="Search">
            <span className="flex-1 text-start">Search…</span>
            <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
          </Button>
          <div className="ms-auto flex items-center gap-1">
            <ColorModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton aria-label="Notifications, 3 unread" variant="ghost" className="relative">
                  <BellIcon />
                  <CountBadge count={3} className="absolute -end-0.5 -top-0.5 h-4 min-w-4 px-1 text-[0.625rem]" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuItem>New booking from Aya Tazi</DropdownMenuItem>
                <DropdownMenuItem>Review received on Riad Zitoun</DropdownMenuItem>
                <DropdownMenuItem>Payout of €4,210 sent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Account menu" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar size="sm" name="Salma Idrissi" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Salma Idrissi</DropdownMenuLabel>
                <DropdownMenuItem icon={<UserIcon />}>Profile</DropdownMenuItem>
                <DropdownMenuItem icon={<SettingsIcon />} onSelect={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<LogOutIcon />} variant="destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} title="Search Atlas Admin">
        <CommandInput placeholder="Jump to a page or action…" />
        <CommandList>
          <CommandEmpty />
          <CommandGroup heading="Pages">
            {nav.map((item) => (
              <CommandItem key={item.href} value={item.label} icon={item.icon} onSelect={() => { setPaletteOpen(false); router.push(item.href); }} />
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="Create listing" keywords={["new", "add"]} onSelect={() => { setPaletteOpen(false); router.push("/?new=1"); }} />
            <CommandItem value="Settings" icon={<SettingsIcon />} onSelect={() => { setPaletteOpen(false); router.push("/settings"); }} />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}
