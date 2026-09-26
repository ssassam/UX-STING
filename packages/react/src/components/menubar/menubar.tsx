"use client";
import * as P from "@radix-ui/react-menubar";
import { cn } from "@ux-sting/utils";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
import { createMenuParts, type MenuItemExtraProps } from "../../lib/menu-parts.js";

/** Desktop-application style menu bar (File, Edit, View…). */
const parts = createMenuParts(P, { sideOffset: 6, align: "start" });

type Part<T extends ElementType, Extra = object> = ForwardRefExoticComponent<
  ComponentPropsWithoutRef<T> & Extra & RefAttributes<HTMLDivElement>
>;

export const Menubar = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof P.Root>>(
  function Menubar({ className, ...props }, ref) {
    return (
      <P.Root
        ref={ref}
        className={cn(
          "flex h-control-md items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-xs",
          className,
        )}
        {...props}
      />
    );
  },
);

export const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof P.Trigger>
>(function MenubarTrigger({ className, ...props }, ref) {
  return (
    <P.Trigger
      ref={ref}
      className={cn(
        "flex h-full select-none items-center rounded-md px-3 text-sm font-medium outline-none",
        "data-highlighted:bg-accent data-[state=open]:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
});

export const MenubarMenu: typeof P.Menu = P.Menu;
export const MenubarGroup = P.Group;
export const MenubarRadioGroup = P.RadioGroup;
export const MenubarSub = P.Sub;
export const MenubarContent = parts.Content as Part<typeof P.Content>;
export const MenubarItem = parts.Item as Part<typeof P.Item, MenuItemExtraProps>;
export const MenubarCheckboxItem = parts.CheckboxItem as Part<typeof P.CheckboxItem>;
export const MenubarRadioItem = parts.RadioItem as Part<typeof P.RadioItem>;
export const MenubarLabel = parts.Label as Part<typeof P.Label, { inset?: boolean }>;
export const MenubarSeparator = parts.Separator as Part<typeof P.Separator>;
export const MenubarSubTrigger = parts.SubTrigger as Part<
  typeof P.SubTrigger,
  { icon?: ReactNode; inset?: boolean }
>;
export const MenubarSubContent = parts.SubContent as Part<typeof P.SubContent>;
export const MenubarShortcut = parts.Shortcut;
