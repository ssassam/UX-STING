"use client";
import { UtensilsIcon } from "@ux-sting/icons";
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

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#experience", label: "Experience" },
  { href: "#hours", label: "Hours" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <Navbar blurred>
      <NavbarBrand asChild>
        <a
          href="#main"
          className="rounded-sm text-lg font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UtensilsIcon className="size-6 text-primary" /> Ember
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
        <Button asChild size="sm">
          <a href="#reserve">Reserve a table</a>
        </Button>
        <NavbarMobileMenu title="Ember">
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
