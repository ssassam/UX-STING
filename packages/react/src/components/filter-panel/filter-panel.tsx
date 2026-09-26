"use client";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDownIcon, SlidersHorizontalIcon } from "@ux-sting/icons";
import { cn } from "@ux-sting/utils";
import { useState, type ReactNode } from "react";
import { useMessages } from "../../provider/context.js";
import { Button } from "../button/button.js";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet/sheet.js";
import { Tag } from "../tag/tag.js";

export interface FilterPanelProps {
  title?: ReactNode;
  children: ReactNode;
  /** Number of active filters (shown on the mobile trigger). */
  activeCount?: number;
  onClear?: () => void;
  clearLabel?: string;
  /** Mobile "Show results" button label and handler. */
  applyLabel?: ReactNode;
  onApply?: () => void;
  className?: string;
}

/**
 * Filters as a sidebar on desktop and a bottom/side sheet on mobile, from
 * the same children. Pair with `FilterChips` to show applied filters.
 */
export function FilterPanel({
  title = "Filters",
  children,
  activeCount = 0,
  onClear,
  clearLabel = "Clear all",
  applyLabel = "Show results",
  onApply,
  className,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const header = (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-md font-semibold">{title}</h2>
      {onClear && activeCount > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-xs text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
  return (
    <>
      <aside
        aria-label={typeof title === "string" ? title : undefined}
        className={cn("hidden w-full flex-col gap-4 lg:flex", className)}
      >
        {header}
        <div className="grid divide-y divide-border">{children}</div>
      </aside>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" startIcon={<SlidersHorizontalIcon />}>
              {title}
              {activeCount > 0 ? (
                <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-semibold tabular-nums text-primary-foreground">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90dvh]">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <SheetBody className="grid divide-y divide-border py-0">{children}</SheetBody>
            <SheetFooter>
              {onClear ? (
                <Button variant="outline" onClick={onClear}>
                  {clearLabel}
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  onApply?.();
                  setOpen(false);
                }}
              >
                {applyLabel}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export interface FilterSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Count of active filters in this section. */
  activeCount?: number;
}

/** Collapsible group inside FilterPanel (e.g. "Price", "Rating"). */
export function FilterSection({
  title,
  children,
  defaultOpen = true,
  activeCount,
}: FilterSectionProps) {
  return (
    <CollapsiblePrimitive.Root defaultOpen={defaultOpen} className="py-4">
      <CollapsiblePrimitive.Trigger className="group flex w-full items-center justify-between gap-2 rounded-sm text-start text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex items-center gap-2">
          {title}
          {activeCount ? (
            <span className="rounded-full bg-primary-subtle px-1.5 text-xs text-primary-subtle-foreground tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          aria-hidden
          className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="ui-anim-collapse">
        <div className="grid gap-3 pt-3">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

export interface FilterChip {
  id: string;
  label: string;
}

export interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  clearLabel?: string;
  className?: string;
}

/** Applied filters as removable tags, announced as a group. */
export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  clearLabel = "Clear all",
  className,
}: FilterChipsProps) {
  const messages = useMessages();
  if (!filters.length) return null;
  return (
    <div
      role="group"
      aria-label="Active filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {filters.map((f) => (
        <Tag key={f.id} variant="primary" onRemove={() => onRemove(f.id)} removeLabel={f.label}>
          {f.label}
        </Tag>
      ))}
      {onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          aria-label={`${clearLabel} (${messages.selected(filters.length)})`}
          className="rounded-xs px-1 text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
