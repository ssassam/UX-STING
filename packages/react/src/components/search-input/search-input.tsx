"use client";
import { useControllableState, useMergedRefs } from "@unified-ui/hooks";
import { SearchIcon, XIcon } from "@unified-ui/icons";
import { cn, formatShortcut } from "@unified-ui/utils";
import { forwardRef, useRef, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import { Input, type InputProps } from "../input/input.js";
import { InputGroup, InputGroupAction, InputGroupAddon } from "../input-group/input-group.js";
import { Spinner } from "../spinner/spinner.js";
import { useHotkey } from "@unified-ui/hooks";

export interface SearchInputProps extends Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Called on Enter. */
  onSearch?: (value: string) => void;
  loading?: boolean;
  /** Global shortcut that focuses the field, e.g. `"mod+k"` or `"/"`. */
  shortcut?: string;
  /** Extra trailing content (e.g. a filter button). */
  endContent?: ReactNode;
}

/** Search field with icon, clear button, loading state and optional shortcut. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value: valueProp,
    defaultValue = "",
    onValueChange,
    onChange,
    onSearch,
    loading,
    shortcut,
    endContent,
    size = "md",
    className,
    placeholder,
    onKeyDown,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const inner = useRef<HTMLInputElement>(null);
  const merged = useMergedRefs(ref, inner);
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  useHotkey(shortcut ?? "", () => inner.current?.focus(), { enabled: Boolean(shortcut) });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === "Enter") onSearch?.(value);
    if (e.key === "Escape" && value) {
      e.preventDefault();
      setValue("");
    }
  };

  return (
    <InputGroup size={size} className={className} role="search">
      <InputGroupAddon>
        {loading ? <Spinner size="sm" label={messages.loading} /> : <SearchIcon />}
      </InputGroupAddon>
      <Input
        ref={merged}
        type="search"
        size={size}
        value={value}
        placeholder={placeholder ?? messages.search}
        aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : messages.search)}
        onChange={(e) => {
          onChange?.(e);
          setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="[&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      <InputGroupAction>
        {value ? (
          <button
            type="button"
            aria-label={messages.clear}
            onClick={() => {
              setValue("");
              inner.current?.focus();
            }}
            className={cn(
              "ui-hit-area inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
            )}
          >
            <XIcon />
          </button>
        ) : shortcut ? (
          <kbd
            aria-hidden
            className="me-1 hidden rounded-xs border border-border bg-surface px-1.5 font-mono text-[0.6875rem] text-muted-foreground sm:inline"
          >
            {formatShortcut(shortcut)}
          </kbd>
        ) : null}
        {endContent}
      </InputGroupAction>
    </InputGroup>
  );
});
