"use client";
import { CompassIcon } from "@ux-sting/icons";
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
import { REPO } from "../lib/seo";

const links = [
  { href: "#qa", label: "QA" },
  { href: "#extract", label: "Extract" },
  { href: "#images", label: "Images" },
  { href: "#taste", label: "Taste" },
  { href: "#motion", label: "Motion" },
  { href: "#icons", label: "Icons" },
  { href: "#demos", label: "Demos" },
];

export function SiteHeader() {
  return (
    <Navbar blurred>
      <NavbarBrand asChild>
        <a
          href="#main"
          className="rounded-sm font-display text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CompassIcon className="size-5 text-primary" /> UX-STING
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
        <Button asChild size="sm" variant="outline">
          <a href={REPO}>GitHub</a>
        </Button>
        <NavbarMobileMenu title="UX-STING toolkit">
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
