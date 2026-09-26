"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { controlVariants, type ControlSize } from "../../lib/control";
import { useFieldControlProps } from "../../lib/field";
import { menuItemClass, menuLabelClass, menuSeparatorClass } from "../../lib/menu-styles";
import { usePortalContainer } from "../../provider/context";

/**
 * Choose one option from a list. For fewer than ~6 options consider a
 * RadioGroup; for long or searchable lists use Combobox.
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  size?: ControlSize;
  invalid?: boolean;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { size, invalid, className, children, ...props },
  ref,
) {
  const fieldProps = useFieldControlProps({ ...props, "aria-invalid": invalid || undefined });
  const { name: _name, required: _required, readOnly: _readOnly, ...rest } = fieldProps as typeof fieldProps & { required?: boolean; readOnly?: boolean };
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        controlVariants({ size }),
        "flex items-center justify-between gap-2 text-start data-placeholder:text-muted-foreground [&>span]:truncate",
        className,
      )}
      {...rest}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  function SelectContent({ className, children, position = "popper", ...props }, ref) {
    const container = usePortalContainer();
    return (
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          sideOffset={position === "popper" ? 6 : undefined}
          className={cn(
            "ui-anim-pop relative z-(--ui-z-popover) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-muted-foreground">
            <ChevronUpIcon className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-muted-foreground">
            <ChevronDownIcon className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);

export const SelectItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item ref={ref} className={cn(menuItemClass, "pe-8", className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute end-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="text-primary!" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});

export const SelectLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(function SelectLabel(
  { className, ...props },
  ref,
) {
  return <SelectPrimitive.Label ref={ref} className={cn(menuLabelClass, className)} {...props} />;
});

export const SelectSeparator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>(
  function SelectSeparator({ className, ...props }, ref) {
    return <SelectPrimitive.Separator ref={ref} className={cn(menuSeparatorClass, className)} {...props} />;
  },
);
