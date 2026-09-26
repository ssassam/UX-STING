"use client";
import { ShoppingCartIcon, StoreIcon, UserIcon } from "@unified-ui/icons";
import { CountBadge } from "@unified-ui/react/badge";
import { Button, IconButton } from "@unified-ui/react/button";
import { ColorModeToggle } from "@unified-ui/react/color-mode-toggle";
import { Navbar, NavbarActions, NavbarBrand, NavbarMobileLink, NavbarMobileMenu } from "@unified-ui/react/navbar";
import { SearchInput } from "@unified-ui/react/search-input";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../app/providers";
import { categories } from "../lib/data";

export function Header() {
  const { count } = useCart();
  const router = useRouter();
  return (
    <Navbar>
      <NavbarBrand asChild>
        <NextLink href="/" className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <StoreIcon className="size-5 text-primary" />
          <span className="sr-only sm:not-sr-only">Souk&nbsp;&amp;&nbsp;Co</span>
        </NextLink>
      </NavbarBrand>
      <SearchInput className="max-w-md flex-1" placeholder="Search handmade goods" shortcut="/" onSearch={(q) => router.push(`/?q=${encodeURIComponent(q)}`)} />
      <NavbarActions>
        <ColorModeToggle />
        <IconButton aria-label="Account" variant="ghost" className="hidden sm:inline-flex">
          <UserIcon />
        </IconButton>
        <Button asChild variant="outline" size="sm" className="relative">
          <NextLink href="/checkout" aria-label={`Cart, ${count} items`}>
            <ShoppingCartIcon />
            <span className="hidden sm:inline">Cart</span>
            <CountBadge count={count} className="absolute -end-2 -top-2" />
          </NextLink>
        </Button>
        <NavbarMobileMenu title="Browse">
          {categories.map((c) => (
            <NavbarMobileLink key={c} href={`/?category=${c}`}>{c}</NavbarMobileLink>
          ))}
        </NavbarMobileMenu>
      </NavbarActions>
    </Navbar>
  );
}
