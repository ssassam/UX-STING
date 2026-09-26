"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@ux-sting/utils";
import { createContext, forwardRef, useContext, type ComponentPropsWithoutRef } from "react";

type TabsVariant = "line" | "pills" | "enclosed";
const TabsContext = createContext<{ variant: TabsVariant; size: "sm" | "md" | "lg" }>({
  variant: "line",
  size: "md",
});

export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: TabsVariant;
  size?: "sm" | "md" | "lg";
}

/**
 * Switch between related views in the same context. Arrow keys move between
 * tabs (RTL-aware); set `activationMode="manual"` for expensive panels.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = "line", size = "md", className, ...props },
  ref,
) {
  return (
    <TabsContext.Provider value={{ variant, size }}>
      <TabsPrimitive.Root
        ref={ref}
        className={cn(
          "flex min-w-0 gap-3 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
});

export const TabsList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  const { variant } = useContext(TabsContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        // Scrolls sideways when tabs overflow, without a visible scrollbar (Windows
        // shows one for the 1px indicator otherwise) and never vertically.
        "ui-scrollbar-none flex max-w-full shrink-0 overflow-x-auto overflow-y-hidden data-[orientation=vertical]:flex-col data-[orientation=vertical]:overflow-visible",
        variant === "line" &&
          "gap-4 border-b border-border data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-e",
        variant === "pills" && "gap-1",
        variant === "enclosed" && "w-fit gap-1 rounded-lg bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
});

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  const { variant, size } = useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium text-muted-foreground transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground [&_svg]:size-4",
        size === "sm"
          ? "h-control-sm text-xs"
          : size === "lg"
            ? "h-control-lg text-md"
            : "h-control-md text-sm",
        variant === "line" &&
          "-mb-px rounded-t-sm border-b-2 border-transparent px-1 data-[state=active]:border-primary data-[state=active]:text-foreground data-[orientation=vertical]:mb-0 data-[orientation=vertical]:-me-px data-[orientation=vertical]:justify-start data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-e-2 data-[orientation=vertical]:pe-4",
        variant === "pills" &&
          "rounded-full px-3 data-[state=active]:bg-primary-subtle data-[state=active]:text-primary-subtle-foreground",
        variant === "enclosed" &&
          "rounded-md px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

export const TabsContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "min-w-0 flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
});
