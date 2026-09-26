"use client";
import { CarIcon, PhoneIcon } from "@ux-sting/icons";
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
  { href: "/cars", label: "Our fleet" },
  { href: "/#locations", label: "Locations" },
  { href: "/#faq", label: "Help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <Navbar blurred>
      <NavbarBrand asChild>
        <NextLink
          href="/"
          className="rounded-sm text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CarIcon className="size-6 text-primary" /> Drivo
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
          className="hidden sm:inline-flex"
        >
          <a href="tel:+33100000000">24/7 support</a>
        </Button>
        <NavbarMobileMenu title="Drivo">
          {links.map((l) => (
            <NavbarMobileLink key={l.href} asChild>
              <NextLink href={l.href}>{l.label}</NextLink>
            </NavbarMobileLink>
          ))}
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
