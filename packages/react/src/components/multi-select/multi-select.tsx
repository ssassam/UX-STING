"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@unified-ui/hooks";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useState, type ReactNode } from "react";
import { useFieldControlProps } from "../../lib/field.js";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { useMessages, usePortalContainer } from "../../provider/context.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../command/command.js";
import { groupOptions, type ComboboxOption } from "../combobox/combobox.types.js";

export interface MultiSelectProps {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  /** Maximum chips shown in the trigger before a `+n` summary. */
  maxVisible?: number;
  /** Maximum number of selections. */
  maxSelected?: number;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Searchable multiple selection with removable chips. */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  { options, value: valueProp, defaultValue = [], onValueChange, placeholder = "Select…", searchPlaceholder, emptyText, maxVisible = 3, maxSelected, disabled, invalid, name, id, className, ...aria },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const container = usePortalContainer();
  const messages = useMessages();
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined });
  const selected = value.map((v) => options.find((o) => o.value === v)).filter((o): o is ComboboxOption => Boolean(o));
  const visible = selected.slice(0, maxVisible);
  const hidden = selected.length - visible.length;
  const toggle = (v: string) =>
    setValue((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : maxSelected && prev.length >= maxSelected ? prev : [...prev, v]));

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div
        ref={ref}
        className={cn(
          "flex min-h-(--ui-height-md) w-full items-center gap-1 rounded-md border border-input bg-background px-1.5 py-1 shadow-xs transition-[border-color,box-shadow]",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-[[aria-invalid=true]]:border-destructive",
          fieldProps.disabled && "opacity-60",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {visible.map((option) => (
            <span key={option.value} className="inline-flex h-6 max-w-full items-center gap-1 rounded-sm bg-secondary ps-2 pe-1 text-xs font-medium text-secondary-foreground">
              <span className="truncate">{option.label}</span>
              <button
                type="button"
                disabled={fieldProps.disabled}
                aria-label={messages.removeItem(option.label)}
                onClick={() => toggle(option.value)}
                className="ui-hit-area inline-flex size-4 items-center justify-center rounded-xs outline-none hover:bg-secondary-hover focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3"
              >
                <XIcon />
              </button>
            </span>
          ))}
          {hidden > 0 ? <span className="px-1 text-xs text-muted-foreground">+{hidden}</span> : null}
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              id={fieldProps.id}
              disabled={fieldProps.disabled}
              aria-invalid={fieldProps["aria-invalid"]}
              aria-describedby={fieldProps["aria-describedby"]}
              aria-label={aria["aria-label"]}
              aria-labelledby={aria["aria-labelledby"]}
              className="flex h-6 min-w-16 flex-1 items-center justify-between gap-2 rounded-sm px-1.5 text-start text-sm text-muted-foreground outline-none"
            >
              <span className="truncate">{selected.length ? messages.selected(selected.length) : placeholder}</span>
              <ChevronsUpDownIcon className="size-4 shrink-0" />
            </button>
          </PopoverPrimitive.Trigger>
        </div>
      </div>
      {name ? value.map((v) => <input key={v} type="hidden" name={name} value={v} />) : null}
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content align="start" sideOffset={6} collisionPadding={8} className={cn(floatingSurfaceClass, "w-(--radix-popover-trigger-width) min-w-64 overflow-hidden p-0")}>
          <Command label={aria["aria-label"]}>
            <CommandInput placeholder={searchPlaceholder ?? messages.search} />
            <CommandList aria-multiselectable>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {groupOptions(options).map(([group, items]) => (
                <CommandGroup key={group ?? "_"} heading={group}>
                  {items.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        keywords={[option.value]}
                        disabled={option.disabled || (!isSelected && Boolean(maxSelected) && value.length >= (maxSelected ?? 0))}
                        selected={isSelected}
                        onSelect={() => toggle(option.value)}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-4 items-center justify-center rounded-xs border border-input",
                            isSelected && "border-primary bg-primary text-primary-foreground [&_svg]:text-primary-foreground!",
                          )}
                        >
                          {isSelected ? <CheckIcon className="size-3!" /> : null}
                        </span>
                        {option.icon}
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
