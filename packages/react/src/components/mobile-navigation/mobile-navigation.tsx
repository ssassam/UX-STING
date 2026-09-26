import { Slot, Slottable } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { devWarn } from "../../lib/env.js";
import { Children, forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

/**
 * Bottom tab bar for top-level destinations on phones (hidden from `md`).
 * Limit to 3–5 items, each with icon and label. Respects the safe area;
 * add `pb-20 md:pb-0` to page content so nothing hides behind it.
 */
export const MobileNavigation = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { label?: string; showOnDesktop?: boolean }>(
  function MobileNavigation({ label = "Main", showOnDesktop, className, children, ...props }, ref) {
    if (Children.count(children) > 5) {
      devWarn("MobileNavigation: use at most 5 items; move the rest into a 'More' destination.");
    }
    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn(
          "fixed inset-x-0 bottom-0 z-(--ui-z-header) border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
          !showOnDesktop && "md:hidden",
          className,
        )}
        {...props}
      >
        <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around">{children}</ul>
      </nav>
    );
  },
);

export interface MobileNavigationItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  active?: boolean;
  asChild?: boolean;
  badge?: ReactNode;
}

export const MobileNavigationItem = forwardRef<HTMLAnchorElement, MobileNavigationItemProps>(function MobileNavigationItem(
  { icon, active, asChild, badge, className, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  return (
    <li className="flex flex-1">
      <Comp
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium text-muted-foreground outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring aria-[current=page]:text-primary [&_svg]:size-6",
          className,
        )}
        {...props}
      >
        <span className="relative">
          {icon}
          {badge ? <span className="absolute -end-2 -top-1">{badge}</span> : null}
        </span>
        <Slottable>{children}</Slottable>
      </Comp>
    </li>
  );
});
