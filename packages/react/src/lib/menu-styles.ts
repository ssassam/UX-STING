/** Shared styles for dropdown, context and menubar menus. */
export const menuContentClass =
  "ui-anim-pop z-(--ui-z-popover) min-w-44 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none";

export const menuItemClass = [
  "relative flex min-h-(--ui-nav-item-h) cursor-default select-none items-center gap-2 rounded-md px-2 text-sm outline-none",
  "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:[&_svg]:text-destructive",
  "data-[variant=destructive]:data-highlighted:bg-destructive-subtle",
].join(" ");

export const menuLabelClass = "px-2 py-1.5 text-xs font-semibold text-muted-foreground";
export const menuSeparatorClass = "-mx-1 my-1 h-px bg-border";
export const menuShortcutClass = "ms-auto ps-4 text-xs tracking-wide text-muted-foreground";
export const menuIndicatorClass = "flex size-4 items-center justify-center";
