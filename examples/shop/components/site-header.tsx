"use client";
import { ShoppingBagIcon } from "@ux-sting/icons";
import { CountBadge } from "@ux-sting/react/badge";
import { IconButton } from "@ux-sting/react/button";
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
import { useCart } from "../app/providers";
import { categories } from "../lib/data";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  const pathname = usePathname();
  const cart = useCart();
  const links = [
    { href: "/shop", label: "Shop all" },
    ...categories.slice(0, 3).map((c) => ({ href: `/shop?category=${c.id}`, label: c.name })),
  ];
  return (
    <>
      <p className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">
        Free delivery over €80 · 60-day returns
      </p>
      <Navbar blurred>
        <NavbarBrand asChild>
          <NextLink
            href="/"
            className="rounded-sm font-serif text-xl tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Maison Nord
          </NextLink>
        </NavbarBrand>
        <NavbarContent label="Main">
          {links.map((l) => (
            <NavbarLink
              key={l.href}
              asChild
              active={l.href === "/shop" && pathname.startsWith("/shop")}
            >
              <NextLink href={l.href}>{l.label}</NextLink>
            </NavbarLink>
          ))}
        </NavbarContent>
        <NavbarActions>
          <ColorModeToggle />
          <span className="relative inline-flex">
            <IconButton
              aria-label={`Open bag, ${cart.count} ${cart.count === 1 ? "item" : "items"}`}
              variant="ghost"
              onClick={() => cart.setOpen(true)}
            >
              <ShoppingBagIcon />
            </IconButton>
            {cart.count ? (
              <span aria-hidden className="pointer-events-none absolute -end-1 -top-1">
                <CountBadge count={cart.count} />
              </span>
            ) : null}
          </span>
          <NavbarMobileMenu title="Maison Nord">
            {links.map((l) => (
              <NavbarMobileLink key={l.href} asChild>
                <NextLink href={l.href}>{l.label}</NextLink>
              </NavbarMobileLink>
            ))}
          </NavbarMobileMenu>
        </NavbarActions>
      </Navbar>
      <CartDrawer />
    </>
  );
}
