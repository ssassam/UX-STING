"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@unified-ui/react/context-menu";

export function Basic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-36 items-center justify-center rounded-lg border border-dashed border-border-strong text-sm text-muted-foreground">
        Right-click (or long-press) here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem shortcut="⌘C">Copy</ContextMenuItem>
        <ContextMenuItem shortcut="⌘V">Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
