"use client";
import * as P from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ElementType, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { createMenuParts, type MenuItemExtraProps } from "../../lib/menu-parts.js";

/**
 * Menu of actions or options opened from a button. Full keyboard support:
 * arrows, Home/End, typeahead, Escape; submenus open with ArrowRight
 * (ArrowLeft in RTL).
 */
const parts = createMenuParts(P, { sideOffset: 6 });

type Part<T extends ElementType, Extra = object> = ForwardRefExoticComponent<ComponentPropsWithoutRef<T> & Extra & RefAttributes<HTMLDivElement>>;

export const DropdownMenu = P.Root;
export const DropdownMenuTrigger = P.Trigger;
export const DropdownMenuGroup = P.Group;
export const DropdownMenuRadioGroup = P.RadioGroup;
export const DropdownMenuSub = P.Sub;
export const DropdownMenuContent = parts.Content as Part<typeof P.Content>;
export const DropdownMenuItem = parts.Item as Part<typeof P.Item, MenuItemExtraProps>;
export const DropdownMenuCheckboxItem = parts.CheckboxItem as Part<typeof P.CheckboxItem>;
export const DropdownMenuRadioItem = parts.RadioItem as Part<typeof P.RadioItem>;
export const DropdownMenuLabel = parts.Label as Part<typeof P.Label, { inset?: boolean }>;
export const DropdownMenuSeparator = parts.Separator as Part<typeof P.Separator>;
export const DropdownMenuSubTrigger = parts.SubTrigger as Part<typeof P.SubTrigger, { icon?: ReactNode; inset?: boolean }>;
export const DropdownMenuSubContent = parts.SubContent as Part<typeof P.SubContent>;
export const DropdownMenuShortcut = parts.Shortcut;

/** Alias for DropdownMenu. */
export const Dropdown = DropdownMenu;
export const DropdownTrigger = DropdownMenuTrigger;
export const DropdownContent = DropdownMenuContent;
export const DropdownItem = DropdownMenuItem;
