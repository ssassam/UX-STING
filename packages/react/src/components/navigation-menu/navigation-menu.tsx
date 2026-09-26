"use client";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDownIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

/**
 * Website navigation with dropdown panels (mega menus). Links remain
 * reachable by keyboard; panels open on hover and on click/Enter.
 */
export const NavigationMenu = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      <div className="absolute start-0 top-full flex justify-center">
        <NavigationMenuPrimitive.Viewport className="ui-anim-pop relative mt-2 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height] md:w-(--radix-navigation-menu-viewport-width)" />
      </div>
    </NavigationMenuPrimitive.Root>
  );
});

export const NavigationMenuList = forwardRef<
  HTMLUListElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn("flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
});

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

const triggerClass =
  "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-foreground data-active:text-foreground";

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger ref={ref} className={cn(triggerClass, className)} {...props}>
      {children}
      <ChevronDownIcon
        aria-hidden
        className="size-3.5 transition-transform duration-(--ui-duration-normal) group-data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
});

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn("start-0 top-0 w-full p-4 md:absolute md:w-auto", className)}
      {...props}
    />
  );
});

export const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(function NavigationMenuLink({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={cn(
        "block rounded-md p-3 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-active:bg-accent",
        className,
      )}
      {...props}
    />
  );
});

/** Top-level link styled like a trigger. */
export const navigationMenuTriggerStyle = triggerClass;
