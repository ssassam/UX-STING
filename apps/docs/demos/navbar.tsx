"use client";
import { Button } from "@unified-ui/react/button";
import { ColorModeToggle } from "@unified-ui/react/color-mode-toggle";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@unified-ui/react/navbar";
import { HomeIcon, MapPinIcon, NavigationIcon as CompassIcon } from "@unified-ui/icons";

export function Basic() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Navbar sticky={false}>
        <NavbarBrand>
          <MapPinIcon className="size-5 text-primary" /> Citywise
        </NavbarBrand>
        <NavbarContent>
          <NavbarLink href="#" active>
            Explore
          </NavbarLink>
          <NavbarLink href="#">Events</NavbarLink>
          <NavbarLink href="#">Guides</NavbarLink>
        </NavbarContent>
        <NavbarActions>
          <ColorModeToggle />
          <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            List your business
          </Button>
          <NavbarMobileMenu title="Menu">
            <NavbarMobileLink href="#" active>
              <HomeIcon /> Explore
            </NavbarMobileLink>
            <NavbarMobileLink href="#">
              <CompassIcon /> Events
            </NavbarMobileLink>
            <Button fullWidth className="mt-4">
              List your business
            </Button>
          </NavbarMobileMenu>
        </NavbarActions>
      </Navbar>
    </div>
  );
}
