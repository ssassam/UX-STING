"use client";
import { MenuIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { useState, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion/accordion.js";
import { IconButton } from "../button/button.js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../navigation-menu/navigation-menu.js";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet/sheet.js";

export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuItem {
  label: string;
  /** A plain top-level link. */
  href?: string;
  /** Columns of links shown in the panel. */
  columns?: MegaMenuColumn[];
  /** Promo tile at the end of the panel (image card, campaign). Desktop only. */
  featured?: ReactNode;
  /** "See all" link under the columns. */
  allHref?: string;
  allLabel?: string;
}

export interface MegaMenuProps {
  items: MegaMenuItem[];
  /** Accessible name of the navigation landmark. Default "Main". */
  label?: string;
  /** href of the current page, marked with `aria-current="page"`. */
  currentHref?: string;
  className?: string;
}

/**
 * Store navigation: category panels with link columns and an optional promo
 * tile on desktop (hover, click or keyboard), and a side sheet with
 * collapsible categories below `lg`. Built from one data structure so both
 * stay in sync. Adapted from the Storefront UI MegaMenu block (MIT).
 */
export function MegaMenu({ items, label = "Main", currentHref, className }: MegaMenuProps) {
  const messages = useMessages();
  const [open, setOpen] = useState(false);
  const current = (href: string) => (href === currentHref ? "page" : undefined);

  return (
    <div className={cn("flex items-center", className)}>
      <NavigationMenu aria-label={label} className="hidden max-w-none lg:flex">
        <NavigationMenuList>
          {items.map((item) =>
            item.columns?.length ? (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent className="md:w-[min(56rem,calc(100vw-2rem))]">
                  <div
                    className={cn(
                      "grid gap-6 p-2",
                      item.featured ? "md:grid-cols-[1fr_16rem]" : undefined,
                    )}
                  >
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {item.columns.map((column) => (
                        <div key={column.title} className="grid content-start gap-1">
                          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {column.title}
                          </p>
                          <ul className="grid gap-0.5">
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <NavigationMenuLink
                                  href={link.href}
                                  aria-current={current(link.href)}
                                  className="py-2"
                                >
                                  <span className="font-medium text-foreground">{link.label}</span>
                                  {link.description ? (
                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.allHref ? (
                        <NavigationMenuLink
                          href={item.allHref}
                          className="col-span-full justify-self-start font-medium text-primary"
                        >
                          {item.allLabel ?? item.label}
                        </NavigationMenuLink>
                      ) : null}
                    </div>
                    {item.featured ? <div className="hidden md:block">{item.featured}</div> : null}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  href={item.href}
                  aria-current={item.href ? current(item.href) : undefined}
                  className={navigationMenuTriggerStyle}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <IconButton aria-label={messages.openMenu} variant="ghost" className="lg:hidden">
            <MenuIcon />
          </IconButton>
        </SheetTrigger>
        <SheetContent side="start">
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <nav aria-label={label}>
              <Accordion type="single" collapsible>
                {items.map((item) =>
                  item.columns?.length ? (
                    <AccordionItem key={item.label} value={item.label}>
                      <AccordionTrigger>{item.label}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          {item.columns.map((column) => (
                            <div key={column.title} className="grid gap-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {column.title}
                              </p>
                              <ul className="grid">
                                {column.links.map((link) => (
                                  <li key={link.href}>
                                    <a
                                      href={link.href}
                                      aria-current={current(link.href)}
                                      onClick={() => setOpen(false)}
                                      className="flex min-h-11 items-center rounded-md px-2 text-md outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:font-semibold aria-[current=page]:text-primary"
                                    >
                                      {link.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {item.allHref ? (
                            <a
                              href={item.allHref}
                              onClick={() => setOpen(false)}
                              className="flex min-h-11 items-center rounded-md px-2 font-medium text-primary outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {item.allLabel ?? item.label}
                            </a>
                          ) : null}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-current={item.href ? current(item.href) : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-border text-md font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-primary"
                    >
                      {item.label}
                    </a>
                  ),
                )}
              </Accordion>
            </nav>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}
