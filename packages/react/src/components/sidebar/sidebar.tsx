"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useBreakpoint, useControllableState, useHotkey } from "@unified-ui/hooks";
import { PanelIcon } from "./panel-icon.js";
import { Slot } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { overlayClass } from "../../lib/overlay.js";
import { useMessages, usePortalContainer } from "../../provider/context.js";
import { Tooltip } from "../tooltip/tooltip.js";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  isDesktop: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);
/** `true` inside SidebarGroup, whose items render as list items. */
const SidebarListContext = createContext(false);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>.");
  return ctx;
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Keyboard shortcut toggling the sidebar; `false` disables. */
  shortcut?: string | false;
}

/**
 * Application shell with a collapsible side navigation. On desktop the
 * sidebar collapses to an icon rail; below `md` it becomes a slide-in sheet.
 */
export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(function SidebarProvider(
  { collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, shortcut = "mod+b", className, children, ...props },
  ref,
) {
  const [collapsed, setCollapsed] = useControllableState({ value: collapsedProp, defaultValue: defaultCollapsed, onChange: onCollapsedChange });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useBreakpoint("md", true);
  const toggle = () => (isDesktop ? setCollapsed(!collapsed) : setMobileOpen(!mobileOpen));
  useHotkey(shortcut || "", toggle, { enabled: Boolean(shortcut) });
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isDesktop, toggle }}>
      <div
        ref={ref}
        data-collapsed={collapsed ? "" : undefined}
        className={cn("group/sidebar flex min-h-dvh w-full bg-surface", className)}
        style={{ "--ui-sidebar-width": "16rem", "--ui-sidebar-width-collapsed": "3.75rem" } as CSSProperties}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. */
  label?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ label = "Sidebar", className, children, ...props }, ref) {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  const container = usePortalContainer();
  const panelClass = "flex h-full flex-col gap-2 bg-background text-foreground";
  return (
    <>
      <aside
        ref={ref}
        aria-label={label}
        data-collapsed={collapsed ? "" : undefined}
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-e border-border transition-[width] duration-(--ui-duration-normal) ease-(--ui-ease-standard) md:block",
          collapsed ? "w-(--ui-sidebar-width-collapsed)" : "w-(--ui-sidebar-width)",
          className,
        )}
        {...props}
      >
        <div className={panelClass}>{children}</div>
      </aside>
      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Overlay className={cn(overlayClass, "md:hidden")} />
          <DialogPrimitive.Content
            data-side="start"
            aria-describedby={undefined}
            className="ui-anim-sheet fixed inset-y-0 start-0 z-(--ui-z-modal) h-dvh w-[min(18rem,calc(100vw-3rem))] border-e border-border shadow-xl outline-none md:hidden"
            onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}
          >
            <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
            <SidebarForceExpanded>
              <nav aria-label={label} className={panelClass}>
                {children}
              </nav>
            </SidebarForceExpanded>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
});

function SidebarForceExpanded({ children }: { children: ReactNode }) {
  const ctx = useSidebar();
  return <SidebarContext.Provider value={{ ...ctx, collapsed: false }}>{children}</SidebarContext.Provider>;
}

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex h-16 shrink-0 items-center gap-2 border-b border-border px-3", className)} {...props} />;
});

export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-2 py-2", className)} {...props} />;
});

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("mt-auto flex flex-col gap-2 border-t border-border p-2", className)} {...props} />;
});

export const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { label?: ReactNode }>(function SidebarGroup(
  { label, className, children, ...props },
  ref,
) {
  const { collapsed } = useSidebar();
  return (
    <div ref={ref} role="group" aria-label={typeof label === "string" ? label : undefined} className={cn("grid gap-1", className)} {...props}>
      {label ? (
        <div aria-hidden className={cn("px-2 text-xs font-medium text-muted-foreground transition-opacity", collapsed && "sr-only")}>
          {label}
        </div>
      ) : null}
      <ul className="grid gap-0.5">
        <SidebarListContext.Provider value>{children}</SidebarListContext.Provider>
      </ul>
    </div>
  );
});

export interface SidebarItemProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  active?: boolean;
  badge?: ReactNode;
  asChild?: boolean;
  href?: string;
  /** Label for the tooltip shown when collapsed (defaults to children if string). */
  tooltip?: string;
}

/** Navigation link/button. Shows a tooltip with its label when collapsed. */
export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(function SidebarItem(
  { icon, active, badge, asChild, href, tooltip, className, children, ...props },
  ref,
) {
  const { collapsed } = useSidebar();
  const inList = useContext(SidebarListContext);
  const Wrapper = inList ? "li" : "div";
  const Comp = asChild ? Slot : href ? "a" : "button";
  const content = (
    <Comp
      ref={ref as never}
      href={href}
      type={!asChild && !href ? "button" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-(--ui-nav-item-h) w-full items-center gap-3 rounded-md px-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        "aria-[current=page]:bg-primary-subtle aria-[current=page]:text-primary-subtle-foreground [&_svg]:size-[1.125rem] [&_svg]:shrink-0",
        collapsed && "justify-center px-0",
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {icon}
          <span className={cn("flex-1 truncate text-start", collapsed && "sr-only")}>{children}</span>
          {badge && !collapsed ? <span className="ms-auto">{badge}</span> : null}
        </>
      )}
    </Comp>
  );
  const label = tooltip ?? (typeof children === "string" ? children : undefined);
  return (
    <Wrapper>
      {collapsed && label ? (
        <Tooltip content={label} side="right">
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </Wrapper>
  );
});

/** Button that collapses (desktop) or opens (mobile) the sidebar. */
export const SidebarTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function SidebarTrigger(
  { className, onClick, ...props },
  ref,
) {
  const { toggle, collapsed, isDesktop, mobileOpen } = useSidebar();
  const messages = useMessages();
  return (
    <button
      ref={ref}
      type="button"
      aria-label={messages.toggleSidebar}
      aria-expanded={isDesktop ? !collapsed : mobileOpen}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      className={cn(
        "ui-hit-area inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-5",
        className,
      )}
      {...props}
    >
      <PanelIcon />
    </button>
  );
});

/**
 * Main content area next to the sidebar. Renders `<main id="main">` (the
 * SkipLink target); pass `as="div"` when a `<main>` already exists.
 */
export const SidebarInset = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { as?: "main" | "div" | "section" }>(function SidebarInset(
  { as: Comp = "main", className, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref as never}
      id={Comp === "main" ? "main" : undefined}
      tabIndex={Comp === "main" ? -1 : undefined}
      // ux-audit-ignore: <main tabIndex=-1> is a programmatic skip-link target
      className={cn("flex min-w-0 flex-1 flex-col bg-background outline-none", className)}
      {...props}
    />
  );
});
