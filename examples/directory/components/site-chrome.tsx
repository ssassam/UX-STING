"use client";
import { HeartIcon, HomeIcon, MapPinIcon, SearchIcon, UserIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { ColorModeToggle } from "@ux-sting/react/color-mode-toggle";
import { MobileNavigation, MobileNavigationItem } from "@ux-sting/react/mobile-navigation";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@ux-sting/react/navbar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <Navbar>
      <NavbarBrand asChild>
        <NextLink
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MapPinIcon className="size-5 text-primary" /> Citywise
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarLink asChild active={pathname === "/"}>
          <NextLink href="/">Explore</NextLink>
        </NavbarLink>
        <NavbarLink asChild active={pathname.startsWith("/search")}>
          <NextLink href="/search">Search</NextLink>
        </NavbarLink>
        <NavbarLink asChild>
          <NextLink href="/search?category=hotels">Stays</NextLink>
        </NavbarLink>
      </NavbarContent>
      <NavbarActions>
        <ColorModeToggle />
        <Button size="sm" variant="outline" className="hidden sm:inline-flex">
          List your business
        </Button>
        <NavbarMobileMenu title="Citywise">
          <NavbarMobileLink asChild>
            <NextLink href="/">Explore</NextLink>
          </NavbarMobileLink>
          <NavbarMobileLink asChild>
            <NextLink href="/search">Search</NextLink>
          </NavbarMobileLink>
          <NavbarMobileLink asChild>
            <NextLink href="/search?category=hotels">Stays</NextLink>
          </NavbarMobileLink>
          <Button fullWidth className="mt-4">
            List your business
          </Button>
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <MobileNavigation label="Primary">
      <MobileNavigationItem asChild icon={<HomeIcon />} active={pathname === "/"}>
        <NextLink href="/">Explore</NextLink>
      </MobileNavigationItem>
      <MobileNavigationItem asChild icon={<SearchIcon />} active={pathname.startsWith("/search")}>
        <NextLink href="/search">Search</NextLink>
      </MobileNavigationItem>
      <MobileNavigationItem asChild icon={<HeartIcon />}>
        <NextLink href="/search?saved=1">Saved</NextLink>
      </MobileNavigationItem>
      <MobileNavigationItem asChild icon={<UserIcon />}>
        <NextLink href="/">Profile</NextLink>
      </MobileNavigationItem>
    </MobileNavigation>
  );
}
