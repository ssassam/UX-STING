"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@unified-ui/hooks";
import { CheckIcon, ChevronsUpDownIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useState, type ReactNode } from "react";
import { controlVariants, type ControlSize } from "../../lib/control.js";
import { useFieldControlProps } from "../../lib/field.js";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { useMessages, usePortalContainer } from "../../provider/context.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading } from "../command/command.js";
import { groupOptions, type ComboboxOption } from "./combobox.types.js";

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  size?: ControlSize;
  disabled?: boolean;
  invalid?: boolean;
  /** Allow clearing the value by selecting the current option again. */
  clearable?: boolean;
  /** Async search: receives the query; set `loading` and update `options`. */
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  /** Name for a hidden input so the value is submitted with forms. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  renderOption?: (option: ComboboxOption) => ReactNode;
}

/**
 * Searchable single-select for long lists (countries, categories, users).
 * Supports grouping, async results and form submission.
 */
export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  { options, value: valueProp, defaultValue = null, onValueChange, placeholder = "Select…", searchPlaceholder, emptyText, size, disabled, invalid, clearable, onSearchChange, loading, name, id, className, renderOption, ...aria },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const container = usePortalContainer();
  const messages = useMessages();
  const fieldProps = useFieldControlProps({ id, disabled, "aria-invalid": invalid || undefined, ...aria });
  const selected = options.find((o) => o.value === value);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
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
          className={cn(controlVariants({ size }), "flex items-center justify-between gap-2 text-start", className)}
        >
          <span className={cn("flex min-w-0 items-center gap-2 truncate", !selected && "text-muted-foreground")}>
            {selected?.icon}
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          className={cn(floatingSurfaceClass, "w-(--radix-popover-trigger-width) min-w-56 overflow-hidden p-0")}
        >
          <Command shouldFilter={!onSearchChange} onSearchChange={onSearchChange} loading={loading} label={aria["aria-label"]}>
            <CommandInput placeholder={searchPlaceholder ?? messages.search} />
            <CommandList>
              <CommandLoading />
              <CommandEmpty>{emptyText}</CommandEmpty>
              {groupOptions(options).map(([group, items]) => (
                <CommandGroup key={group ?? "_"} heading={group}>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      keywords={[option.value, ...(option.keywords ?? [])]}
                      disabled={option.disabled}
                      selected={option.value === value}
                      icon={option.icon}
                      onSelect={() => {
                        setValue(clearable && option.value === value ? null : option.value);
                        setOpen(false);
                      }}
                    >
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <span className="grid">
                          <span className="truncate">{option.label}</span>
                          {option.description ? <span className="truncate text-xs text-muted-foreground">{option.description}</span> : null}
                        </span>
                      )}
                      <CheckIcon className={cn("ms-auto text-primary!", option.value === value ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
