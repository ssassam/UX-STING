"use client";
import { PhoneIcon } from "@ux-sting/icons";
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
import { DrivoLogo } from "./brand";

const links = [
  { href: "/cars", label: "Fleet" },
  { href: "/#stages", label: "How it works" },
  { href: "/#locations", label: "Locations" },
  { href: "/#reviews", label: "Drivers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <Navbar blurred>
      <NavbarBrand asChild>
        <NextLink
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <DrivoLogo size="md" />
        </NextLink>
      </NavbarBrand>
      <NavbarContent label="Main">
        {links.map((l) => (
          <NavbarLink key={l.href} asChild active={pathname.startsWith(l.href) && l.href !== "/"}>
            <NextLink href={l.href}>{l.label}</NextLink>
          </NavbarLink>
        ))}
      </NavbarContent>
      <NavbarActions>
        <ColorModeToggle />
        <Button
          asChild
          size="sm"
          variant="outline"
          startIcon={<PhoneIcon />}
          className="hidden lg:inline-flex"
        >
          <a href="tel:+33100000000">
            <span className="roadbook-label normal-case tracking-normal">
              24/7 · +33 1 00 00 00 00
            </span>
          </a>
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <NextLink href="/cars">Find a car</NextLink>
        </Button>
        <NavbarMobileMenu title="Drivo">
          {links.map((l) => (
            <NavbarMobileLink key={l.href} asChild>
              <NextLink href={l.href}>{l.label}</NextLink>
            </NavbarMobileLink>
          ))}
          <NavbarMobileLink asChild>
            <NextLink href="/cars">Find a car</NextLink>
          </NavbarMobileLink>
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
