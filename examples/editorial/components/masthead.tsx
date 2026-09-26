"use client";
import { NewspaperIcon, SearchIcon } from "@unified-ui/icons";
import { Button } from "@unified-ui/react/button";
import { ColorModeToggle } from "@unified-ui/react/color-mode-toggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@unified-ui/react/command";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@unified-ui/react/navbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@unified-ui/react/navigation-menu";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { articles, sections } from "../lib/data";

export function Masthead() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Navbar maxWidth="lg">
        <NavbarBrand asChild>
          <NextLink
            href="/"
            className="rounded-sm font-serif text-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <NewspaperIcon className="size-5" /> The Medina Review
          </NextLink>
        </NavbarBrand>
        <div className="hidden flex-1 justify-center md:flex">
          <NavigationMenu aria-label="Sections">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sections</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[28rem] gap-1 sm:grid-cols-2">
                    {sections.map((s) => (
                      <li key={s}>
                        <NavigationMenuLink asChild>
                          <NextLink href={`/search?q=${encodeURIComponent(s)}`}>
                            <span className="block font-medium">{s}</span>
                            <span className="block text-muted-foreground">
                              {articles.filter((a) => a.category === s).length} stories
                            </span>
                          </NextLink>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <NavbarActions>
          <Button
            variant="ghost"
            size="sm"
            startIcon={<SearchIcon />}
            onClick={() => setOpen(true)}
            aria-label="Search stories"
          >
            <span className="hidden sm:inline">Search</span>
          </Button>
          <ColorModeToggle />
          <NavbarMobileMenu title="Sections">
            {sections.map((s) => (
              <NavbarMobileLink key={s} asChild>
                <NextLink href={`/search?q=${encodeURIComponent(s)}`}>{s}</NextLink>
              </NavbarMobileLink>
            ))}
          </NavbarMobileMenu>
        </NavbarActions>
      </Navbar>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search stories">
        <CommandInput placeholder="Search stories, sections, authors…" />
        <CommandList>
          <CommandEmpty />
          <CommandGroup heading="Stories">
            {articles.map((a) => (
              <CommandItem
                key={a.slug}
                value={a.title}
                keywords={[a.category, a.author.name]}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/article/${a.slug}`);
                }}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
