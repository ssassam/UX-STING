"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MenuIcon } from "@unified-ui/icons";
import { Slot } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CloseButton, overlayClass } from "../../lib/overlay.js";
import { useMessages, usePortalContainer } from "../../provider/context.js";

const NavbarContext = createContext<{
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Stick to the top on scroll. */
  sticky?: boolean;
  /** Translucent blurred background (for content scrolling beneath). */
  blurred?: boolean;
  /** Max width of the inner container. */
  maxWidth?: "md" | "lg" | "xl" | "full";
}

/**
 * Top application/site bar. Compose `NavbarBrand`, `NavbarContent`
 * (desktop links), `NavbarActions` and `NavbarMobileMenu` (sheet on small
 * screens). Keep primary nav placement consistent across pages.
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { sticky = true, blurred = true, maxWidth = "xl", className, children, ...props },
  ref,
) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <NavbarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <header
        ref={ref}
        className={cn(
          "z-(--ui-z-header) w-full border-b border-border",
          sticky && "sticky top-0",
          blurred
            ? "bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
            : "bg-background",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "mx-auto flex h-16 items-center gap-4 px-4 sm:px-6",
            maxWidth === "md" && "max-w-5xl",
            maxWidth === "lg" && "max-w-6xl",
            maxWidth === "xl" && "max-w-7xl",
          )}
        >
          {children}
        </div>
      </header>
    </NavbarContext.Provider>
  );
});

export const NavbarBrand = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(function NavbarBrand({ asChild, className, ...props }, ref) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn("flex shrink-0 items-center gap-2 font-semibold", className)}
      {...props}
    />
  );
});

/** Primary links; hidden below `md` (they move into NavbarMobileMenu). */
export const NavbarContent = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { label?: string }
>(function NavbarContent({ label = "Main", className, children, ...props }, ref) {
  return (
    <nav ref={ref} aria-label={label} className={cn("hidden flex-1 md:flex", className)} {...props}>
      <ul className="flex items-center gap-1">{children}</ul>
    </nav>
  );
});

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(function NavbarLink(
  { active, asChild, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  return (
    <li>
      <Comp
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors outline-none",
          "hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-foreground aria-[current=page]:bg-accent",
          className,
        )}
        {...props}
      />
    </li>
  );
});

export const NavbarActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function NavbarActions({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("ms-auto flex items-center gap-2", className)} {...props} />
    );
  },
);

export interface NavbarMobileMenuProps {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
}

/** Hamburger toggle + slide-in panel, rendered only below `md`. */
export function NavbarMobileMenu({ children, title, className }: NavbarMobileMenuProps) {
  const { mobileOpen, setMobileOpen } = useContext(NavbarContext);
  const messages = useMessages();
  const container = usePortalContainer();
  return (
    <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
      <DialogPrimitive.Trigger
        aria-label={messages.openMenu}
        className="ui-hit-area inline-flex size-9 items-center justify-center rounded-md text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring md:hidden [&_svg]:size-5"
      >
        <MenuIcon />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content
          data-side="end"
          aria-describedby={undefined}
          className={cn(
            "ui-anim-sheet fixed inset-y-0 end-0 z-(--ui-z-modal) flex h-dvh w-[min(20rem,calc(100vw-3rem))] flex-col border-s border-border bg-popover shadow-xl outline-none",
            className,
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <DialogPrimitive.Title className="font-semibold">
              {title ?? messages.openMenu}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <CloseButton />
            </DialogPrimitive.Close>
          </div>
          <nav
            aria-label="Mobile"
            className="flex-1 overflow-y-auto p-3"
            onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}
          >
            {children}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Link row for the mobile menu. */
export const NavbarMobileLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  function NavbarMobileLink({ active, asChild, className, ...props }, ref) {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-md px-3 text-md font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-primary-subtle aria-[current=page]:text-primary-subtle-foreground [&_svg]:size-5",
          className,
        )}
        {...props}
      />
    );
  },
);
