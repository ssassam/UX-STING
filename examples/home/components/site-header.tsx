"use client";
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
import { GITHUB_URL } from "../content/site";
import { Mark } from "./mark";

const links = [
  { href: "#inside", label: "What's inside" },
  { href: "#how", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Premium" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <Navbar blurred sticky>
      <NavbarBrand asChild>
        <a
          href="#main"
          className="inline-flex items-center gap-2 rounded-sm text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Mark className="size-6" /> UX-STING
        </a>
      </NavbarBrand>
      <NavbarContent label="Sections">
        {links.map((l) => (
          <NavbarLink key={l.href} asChild>
            <a href={l.href}>{l.label}</a>
          </NavbarLink>
        ))}
      </NavbarContent>
      <NavbarActions>
        <ColorModeToggle />
        <Button asChild size="sm" variant="outline" className="max-sm:hidden">
          <a href={GITHUB_URL} target="_blank" rel="noopener">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
        <Button asChild size="sm">
          <a href="#install">Install</a>
        </Button>
        <NavbarMobileMenu title="UX-STING">
          {links.map((l) => (
            <NavbarMobileLink key={l.href} asChild>
              <a href={l.href}>{l.label}</a>
            </NavbarMobileLink>
          ))}
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
