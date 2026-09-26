import { Slot, Slottable } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

/**
 * Compact vertical navigation (icon + label) for tablets and dense apps.
 * Always show labels: icon-only navigation harms discoverability.
 */
export const NavigationRail = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { label?: string }
>(function NavigationRail({ label = "Main", className, children, ...props }, ref) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn(
        "flex h-full w-20 shrink-0 flex-col items-center gap-2 border-e border-border bg-background py-3",
        className,
      )}
      {...props}
    >
      <ul className="flex w-full flex-col items-center gap-1">{children}</ul>
    </nav>
  );
});

export interface NavigationRailItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  active?: boolean;
  asChild?: boolean;
  badge?: ReactNode;
}

export const NavigationRailItem = forwardRef<HTMLAnchorElement, NavigationRailItemProps>(
  function NavigationRailItem(
    { icon, active, asChild, badge, className, children, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "a";
    return (
      <li className="w-full px-2">
        <Comp
          ref={ref}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[0.6875rem] font-medium text-muted-foreground outline-none transition-colors",
            "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-foreground",
            className,
          )}
          {...props}
        >
          <span className="relative flex h-8 w-12 items-center justify-center rounded-full transition-colors group-hover:bg-accent group-aria-[current=page]:bg-primary-subtle group-aria-[current=page]:text-primary-subtle-foreground [&_svg]:size-5">
            {icon}
            {badge ? <span className="absolute -end-1 -top-1">{badge}</span> : null}
          </span>
          <Slottable>{children}</Slottable>
        </Comp>
      </li>
    );
  },
);
