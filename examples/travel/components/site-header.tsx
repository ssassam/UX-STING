"use client";
import { CompassIcon, UserIcon } from "@ux-sting/icons";
import { Button } from "@ux-sting/react/button";
import { ColorModeToggle } from "@ux-sting/react/color-mode-toggle";
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

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/search", label: "Stays" },
  { href: "/tours", label: "Tours" },
  { href: "/trips", label: "My trips" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/search" && pathname.startsWith("/stays"));
  return (
    <Navbar blurred>
      <NavbarBrand asChild>
        <NextLink
          href="/"
          className="rounded-sm text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CompassIcon className="size-6 text-primary" /> Wayfare
        </NextLink>
      </NavbarBrand>
      <NavbarContent label="Main">
        {links.map((l) => (
          <NavbarLink key={l.href} asChild active={isActive(l.href)}>
            <NextLink href={l.href}>{l.label}</NextLink>
          </NavbarLink>
        ))}
      </NavbarContent>
      <NavbarActions>
        <ColorModeToggle />
        <Button
          size="sm"
          variant="outline"
          startIcon={<UserIcon />}
          className="hidden sm:inline-flex"
        >
          Sign in
        </Button>
        <NavbarMobileMenu title="Wayfare">
          {links.map((l) => (
            <NavbarMobileLink key={l.href} asChild active={isActive(l.href)}>
              <NextLink href={l.href}>{l.label}</NextLink>
            </NavbarMobileLink>
          ))}
          <Button fullWidth className="mt-4" startIcon={<UserIcon />}>
            Sign in
          </Button>
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
