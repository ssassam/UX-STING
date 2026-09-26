"use client";
import { useControllableState, useIsomorphicLayoutEffect, useMergedRefs } from "@unified-ui/hooks";
import { SearchIcon } from "@unified-ui/icons";
import { cn, fuzzyScore } from "@unified-ui/utils";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { menuItemClass, menuLabelClass, menuSeparatorClass, menuShortcutClass } from "../../lib/menu-styles.js";
import { useMessages } from "../../provider/context.js";
import { Spinner } from "../spinner/spinner.js";

interface ItemRecord {
  value: string;
  keywords: string[];
  groupId?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  register: (id: string, record: ItemRecord) => () => void;
  isVisible: (id: string) => boolean;
  groupVisible: (groupId: string) => boolean;
  visibleCount: number;
  listId: string;
  loading: boolean;
  select: (id: string) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  label?: string;
}

const defaultFilter = (value: string, search: string, keywords: string[]) => fuzzyScore(search, value, keywords);

const CommandContext = createContext<CommandContextValue | null>(null);
const GroupContext = createContext<string | undefined>(undefined);

function useCommand() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("Command parts must be used inside <Command>.");
  return ctx;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled search value. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Disable built-in filtering (e.g. for async/server results). */
  shouldFilter?: boolean;
  /** Custom scoring function; return 0 to hide an item. */
  filter?: (value: string, search: string, keywords: string[]) => number;
  /** Wrap keyboard navigation around the ends. */
  loop?: boolean;
  /** Shows `CommandLoading` and marks the list busy. */
  loading?: boolean;
  /** Accessible label for the command menu. */
  label?: string;
}

/**
 * Fast, keyboard-first command/search menu with fuzzy matching, groups,
 * shortcuts and async support. Also the engine behind Combobox and
 * Autocomplete.
 */
export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  { search: searchProp, defaultSearch = "", onSearchChange, shouldFilter = true, filter = defaultFilter, loop = true, loading = false, label, className, children, onKeyDown, ...props },
  ref,
) {
  const [search, setSearch] = useControllableState({ value: searchProp, defaultValue: defaultSearch, onChange: onSearchChange });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const items = useRef(new Map<string, ItemRecord>());
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, rootRef);
  const listId = `cmd${useId().replace(/:/g, "")}`;

  const register = useCallback((id: string, record: ItemRecord) => {
    items.current.set(id, record);
    setVersion((v) => v + 1);
    return () => {
      items.current.delete(id);
      setVersion((v) => v + 1);
    };
  }, []);

  const visible = useMemo(() => {
    const set = new Set<string>();
    const groups = new Set<string>();
    for (const [id, rec] of items.current) {
      const score = !shouldFilter || !search ? 1 : filter(rec.value, search, rec.keywords);
      if (score > 0) {
        set.add(id);
        if (rec.groupId) groups.add(rec.groupId);
      }
    }
    return { set, groups };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, shouldFilter, filter, version]);

  const getNavigable = useCallback(() => {
    return Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-command-item]:not([data-disabled]):not([hidden])") ?? []);
  }, []);

  // Highlight the first match whenever the results change.
  useIsomorphicLayoutEffect(() => {
    const [first] = getNavigable();
    if (!activeId || !visible.set.has(activeId)) setActiveId(first?.id ?? null);
     
  }, [visible]);

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const select = useCallback((id: string) => {
    const rec = items.current.get(id);
    if (rec && !rec.disabled) rec.onSelect?.(rec.value);
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    const nodes = getNavigable();
    if (!nodes.length) return;
    const index = nodes.findIndex((n) => n.id === activeId);
    const move = (next: number) => {
      event.preventDefault();
      const clamped = loop ? (next + nodes.length) % nodes.length : Math.max(0, Math.min(nodes.length - 1, next));
      setActiveId(nodes[clamped]?.id ?? null);
    };
    switch (event.key) {
      case "ArrowDown":
        return move(index + 1);
      case "ArrowUp":
        return move(index - 1);
      case "Home":
        return move(0);
      case "End":
        return move(nodes.length - 1);
      case "Enter":
        if (activeId) {
          event.preventDefault();
          select(activeId);
        }
        return;
    }
  };

  const value: CommandContextValue = {
    search,
    setSearch,
    activeId,
    setActiveId,
    register,
    isVisible: (id) => visible.set.has(id),
    groupVisible: (gid) => visible.groups.has(gid),
    visibleCount: visible.set.size,
    listId,
    loading,
    select,
    handleKeyDown,
    label,
  };

  return (
    <CommandContext.Provider value={value}>
      <div
        ref={mergedRef}
        data-command-root=""
        className={cn("flex size-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground", className)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented && (e.target as HTMLElement).tagName !== "INPUT") handleKeyDown(e);
        }}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
});

export interface CommandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, onValueChange, placeholder, onKeyDown, ...props },
  ref,
) {
  const ctx = useCommand();
  const messages = useMessages();
  return (
    <div className="flex items-center gap-2 border-b border-border px-3">
      {ctx.loading ? <Spinner size="sm" label={null} /> : <SearchIcon className="size-4 shrink-0 text-muted-foreground" />}
      <input
        ref={ref}
        role="combobox"
        aria-expanded
        aria-controls={ctx.listId}
        aria-activedescendant={ctx.activeId ?? undefined}
        aria-autocomplete="list"
        aria-label={props["aria-label"] ?? ctx.label ?? messages.search}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={ctx.search}
        placeholder={placeholder ?? messages.search}
        onChange={(e) => {
          ctx.setSearch(e.target.value);
          onValueChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) ctx.handleKeyDown(e);
        }}
        className={cn(
          "flex h-11 w-full bg-transparent py-3 text-md outline-none placeholder:text-muted-foreground disabled:opacity-50 sm:text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export const CommandList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CommandList(
  { className, ...props },
  ref,
) {
  const ctx = useCommand();
  return (
    <div
      ref={ref}
      id={ctx.listId}
      role="listbox"
      aria-label={ctx.label}
      aria-busy={ctx.loading || undefined}
      className={cn("max-h-80 scroll-py-1 overflow-y-auto overflow-x-hidden p-1", className)}
      {...props}
    />
  );
});

export const CommandEmpty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CommandEmpty(
  { className, children, ...props },
  ref,
) {
  const ctx = useCommand();
  const messages = useMessages();
  if (ctx.loading || ctx.visibleCount > 0) return null;
  return (
    <div ref={ref} role="status" className={cn("py-8 text-center text-sm text-muted-foreground", className)} {...props}>
      {children ?? messages.noResults}
    </div>
  );
});

export const CommandLoading = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CommandLoading(
  { className, children, ...props },
  ref,
) {
  const ctx = useCommand();
  const messages = useMessages();
  if (!ctx.loading) return null;
  return (
    <div ref={ref} role="status" className={cn("flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground", className)} {...props}>
      <Spinner size="sm" label={null} />
      {children ?? messages.loading}
    </div>
  );
});

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { heading, className, children, ...props },
  ref,
) {
  const ctx = useCommand();
  const id = useId();
  const headingId = `${id}-heading`;
  return (
    <GroupContext.Provider value={id}>
      <div
        ref={ref}
        role="group"
        aria-labelledby={heading ? headingId : undefined}
        hidden={!ctx.groupVisible(id)}
        className={cn("py-1", className)}
        {...props}
      >
        {heading ? (
          <div id={headingId} className={menuLabelClass} aria-hidden>
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    </GroupContext.Provider>
  );
});

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Value used for filtering and passed to `onSelect`. Defaults to text content. */
  value: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
  icon?: ReactNode;
  shortcut?: ReactNode;
  /** Visual selected state (e.g. current combobox value). */
  selected?: boolean;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { value, keywords, disabled, onSelect, icon, shortcut, selected, className, children, ...props },
  ref,
) {
  const ctx = useCommand();
  const groupId = useContext(GroupContext);
  const id = `cmdi${useId().replace(/:/g, "")}`;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const keywordKey = keywords?.join("|") ?? "";

  useIsomorphicLayoutEffect(
    () =>
      ctx.register(id, {
        value,
        keywords: keywordKey ? keywordKey.split("|") : [],
        groupId,
        disabled,
        onSelect: (v) => onSelectRef.current?.(v),
      }),
     
    [id, value, keywordKey, groupId, disabled, ctx.register],
  );

  const active = ctx.activeId === id;
  return (
    <div
      ref={ref}
      id={id}
      role="option"
      tabIndex={-1}
      data-command-item=""
      aria-selected={active}
      aria-disabled={disabled || undefined}
      aria-checked={selected === undefined ? undefined : selected}
      data-disabled={disabled ? "" : undefined}
      data-highlighted={active ? "" : undefined}
      data-selected={selected ? "" : undefined}
      hidden={!ctx.isVisible(id)}
      onPointerMove={() => !disabled && !active && ctx.setActiveId(id)}
      onClick={() => ctx.select(id)}
      className={cn(menuItemClass, "cursor-pointer", className)}
      {...props}
    >
      {icon}
      <span className="flex-1 truncate">{children ?? value}</span>
      {shortcut ? <span className={menuShortcutClass}>{shortcut}</span> : null}
    </div>
  );
});

export const CommandSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CommandSeparator(
  { className, ...props },
  ref,
) {
  const ctx = useCommand();
  if (ctx.search) return null;
  return <div ref={ref} role="separator" className={cn(menuSeparatorClass, className)} {...props} />;
});
