"use client";
import { ChartCandlestickIcon } from "@ux-sting/icons";
import { Badge } from "@ux-sting/react/badge";
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
  { href: "/", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/coin/bitcoin", label: "Bitcoin" },
  { href: "/coin/ethereum", label: "Ethereum" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <Navbar blurred maxWidth="full">
      <NavbarBrand asChild>
        <NextLink
          href="/"
          className="rounded-sm text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChartCandlestickIcon className="size-6 text-primary" /> Chainlens
        </NextLink>
      </NavbarBrand>
      <NavbarContent label="Main">
        {links.map((l) => (
          <NavbarLink key={l.href} asChild active={active(l.href)}>
            <NextLink href={l.href}>{l.label}</NextLink>
          </NavbarLink>
        ))}
      </NavbarContent>
      <NavbarActions>
        <Badge variant="warning" className="hidden sm:inline-flex">
          Sample data
        </Badge>
        <ColorModeToggle />
        <NavbarMobileMenu title="Chainlens">
          {links.map((l) => (
            <NavbarMobileLink key={l.href} asChild active={active(l.href)}>
              <NextLink href={l.href}>{l.label}</NextLink>
            </NavbarMobileLink>
          ))}
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
