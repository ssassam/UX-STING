"use client";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { usePortalContainer } from "../provider/context.js";
import {
  menuContentClass,
  menuIndicatorClass,
  menuItemClass,
  menuLabelClass,
  menuSeparatorClass,
  menuShortcutClass,
} from "./menu-styles.js";

/**
 * The Radix menu packages (dropdown, context, menubar) share the same part
 * structure. This factory styles them once so all menus look and behave
 * identically.
 */
interface MenuPrimitives {
  Portal: ElementType;
  Content: ElementType;
  Item: ElementType;
  CheckboxItem: ElementType;
  RadioItem: ElementType;
  ItemIndicator: ElementType;
  Label: ElementType;
  Separator: ElementType;
  SubTrigger: ElementType;
  SubContent: ElementType;
}

export interface MenuItemExtraProps {
  /** `destructive` for dangerous actions (delete, sign out). */
  variant?: "default" | "destructive";
  /** Leading icon. */
  icon?: ReactNode;
  /** Keyboard shortcut hint (display only). */
  shortcut?: ReactNode;
  inset?: boolean;
}

type Props = { className?: string; children?: ReactNode };

export function createMenuParts<P extends MenuPrimitives>(P: P, contentDefaults: Record<string, unknown> = {}) {
  const Content = forwardRef<HTMLDivElement, Props>(function MenuContent({ className, ...props }, ref) {
    const container = usePortalContainer();
    return (
      <P.Portal container={container}>
        <P.Content ref={ref} className={cn(menuContentClass, className)} collisionPadding={8} {...contentDefaults} {...props} />
      </P.Portal>
    );
  });

  const Item = forwardRef<HTMLDivElement, Props & MenuItemExtraProps>(function MenuItem(
    { className, variant = "default", icon, shortcut, inset, children, ...props },
    ref,
  ) {
    return (
      <P.Item ref={ref} data-variant={variant} className={cn(menuItemClass, inset && "ps-8", className)} {...props}>
        {icon}
        {children}
        {shortcut ? <span className={menuShortcutClass}>{shortcut}</span> : null}
      </P.Item>
    );
  });

  const CheckboxItem = forwardRef<HTMLDivElement, Props>(function MenuCheckboxItem({ className, children, ...props }, ref) {
    return (
      <P.CheckboxItem ref={ref} className={cn(menuItemClass, "ps-8", className)} {...props}>
        <span className={cn(menuIndicatorClass, "absolute start-2")}>
          <P.ItemIndicator>
            <CheckIcon />
          </P.ItemIndicator>
        </span>
        {children}
      </P.CheckboxItem>
    );
  });

  const RadioItem = forwardRef<HTMLDivElement, Props>(function MenuRadioItem({ className, children, ...props }, ref) {
    return (
      <P.RadioItem ref={ref} className={cn(menuItemClass, "ps-8", className)} {...props}>
        <span className={cn(menuIndicatorClass, "absolute start-2")}>
          <P.ItemIndicator>
            <CircleIcon className="size-2 fill-current" />
          </P.ItemIndicator>
        </span>
        {children}
      </P.RadioItem>
    );
  });

  const Label = forwardRef<HTMLDivElement, Props & { inset?: boolean }>(function MenuLabel({ className, inset, ...props }, ref) {
    return <P.Label ref={ref} className={cn(menuLabelClass, inset && "ps-8", className)} {...props} />;
  });

  const Separator = forwardRef<HTMLDivElement, Props>(function MenuSeparator({ className, ...props }, ref) {
    return <P.Separator ref={ref} className={cn(menuSeparatorClass, className)} {...props} />;
  });

  const SubTrigger = forwardRef<HTMLDivElement, Props & { icon?: ReactNode; inset?: boolean }>(function MenuSubTrigger(
    { className, icon, inset, children, ...props },
    ref,
  ) {
    return (
      <P.SubTrigger ref={ref} className={cn(menuItemClass, "data-[state=open]:bg-accent", inset && "ps-8", className)} {...props}>
        {icon}
        {children}
        <ChevronRightIcon className="ms-auto rtl:rotate-180" />
      </P.SubTrigger>
    );
  });

  const SubContent = forwardRef<HTMLDivElement, Props>(function MenuSubContent({ className, ...props }, ref) {
    const container = usePortalContainer();
    return (
      <P.Portal container={container}>
        <P.SubContent ref={ref} className={cn(menuContentClass, className)} {...props} />
      </P.Portal>
    );
  });

  const Shortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn(menuShortcutClass, className)} {...props} />
  );

  return { Content, Item, CheckboxItem, RadioItem, Label, Separator, SubTrigger, SubContent, Shortcut };
}

export type MenuPartProps<T extends ElementType> = ComponentPropsWithoutRef<T>;
