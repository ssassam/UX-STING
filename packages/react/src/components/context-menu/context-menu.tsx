"use client";
import * as P from "@radix-ui/react-context-menu";
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { createMenuParts, type MenuItemExtraProps } from "../../lib/menu-parts.js";

/**
 * Right-click / long-press menu. Always duplicate its actions somewhere
 * visible — context menus are not discoverable on their own.
 */
const parts = createMenuParts(P);

type Part<T extends ElementType, Extra = object> = ForwardRefExoticComponent<
  ComponentPropsWithoutRef<T> & Extra & RefAttributes<HTMLDivElement>
>;

export const ContextMenu = P.Root;
export const ContextMenuTrigger = P.Trigger;
export const ContextMenuGroup = P.Group;
export const ContextMenuRadioGroup = P.RadioGroup;
export const ContextMenuSub = P.Sub;
export const ContextMenuContent = parts.Content as Part<typeof P.Content>;
export const ContextMenuItem = parts.Item as Part<typeof P.Item, MenuItemExtraProps>;
export const ContextMenuCheckboxItem = parts.CheckboxItem as Part<typeof P.CheckboxItem>;
export const ContextMenuRadioItem = parts.RadioItem as Part<typeof P.RadioItem>;
export const ContextMenuLabel = parts.Label as Part<typeof P.Label, { inset?: boolean }>;
export const ContextMenuSeparator = parts.Separator as Part<typeof P.Separator>;
export const ContextMenuSubTrigger = parts.SubTrigger as Part<
  typeof P.SubTrigger,
  { icon?: ReactNode; inset?: boolean }
>;
export const ContextMenuSubContent = parts.SubContent as Part<typeof P.SubContent>;
export const ContextMenuShortcut = parts.Shortcut;
