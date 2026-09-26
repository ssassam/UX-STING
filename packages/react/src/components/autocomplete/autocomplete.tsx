"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@unified-ui/hooks";
import { cn, fuzzyScore } from "@unified-ui/utils";
import { forwardRef, useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { menuItemClass } from "../../lib/menu-styles.js";
import { floatingSurfaceClass } from "../../lib/overlay.js";
import { useMessages, usePortalContainer } from "../../provider/context.js";
import { Input, type InputProps } from "../input/input.js";
import { Spinner } from "../spinner/spinner.js";

export interface AutocompleteProps extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "onSelect"> {
  /** Suggestions. Filtered locally unless `onSearchChange` handles it. */
  suggestions: string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when a suggestion is chosen. */
  onSelect?: (value: string) => void;
  /** Disable local filtering (async/server suggestions). */
  filterLocally?: boolean;
  loading?: boolean;
  emptyText?: ReactNode;
  /** Maximum suggestions to render. */
  limit?: number;
}

/**
 * Free-text input with suggestions (the value need not be one of them).
 * Implements the ARIA combobox pattern with `aria-activedescendant`.
 */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  { suggestions, value: valueProp, defaultValue = "", onValueChange, onSelect, filterLocally = true, loading, emptyText, limit = 8, className, onKeyDown, ...props },
  ref,
) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = `ac${useId().replace(/:/g, "")}`;
  const container = usePortalContainer();
  const messages = useMessages();

  const results = useMemo(() => {
    if (!filterLocally || !value) return suggestions.slice(0, limit);
    return suggestions
      .map((s) => [s, fuzzyScore(value, s)] as const)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([s]) => s);
  }, [suggestions, value, filterLocally, limit]);

  const choose = (s: string) => {
    setValue(s);
    onSelect?.(s);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const showPanel = open && (results.length > 0 || loading || Boolean(value && emptyText));

  return (
    <PopoverPrimitive.Root open={showPanel} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor asChild>
        <div className={cn("relative w-full", className)}>
          <Input
            ref={ref}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-activedescendant={showPanel && results[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {loading ? <Spinner size="sm" label={null} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" /> : null}
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest?.(`[aria-controls="${listId}"]`)) e.preventDefault();
          }}
          className={cn(floatingSurfaceClass, "w-(--radix-popover-trigger-width) p-1")}
        >
          <div id={listId} role="listbox" aria-busy={loading || undefined}>
            {results.map((s, i) => (
              <div
                key={s}
                id={`${listId}-${i}`}
                role="option"
                tabIndex={-1}
                aria-selected={i === active}
                data-highlighted={i === active ? "" : undefined}
                onPointerMove={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
                className={cn(menuItemClass, "cursor-pointer")}
              >
                {s}
              </div>
            ))}
            {!loading && results.length === 0 && emptyText ? (
              <div role="status" className="px-2 py-3 text-sm text-muted-foreground">
                {emptyText ?? messages.noResults}
              </div>
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
