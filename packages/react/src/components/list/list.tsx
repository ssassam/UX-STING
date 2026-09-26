import { Slot } from "@unified-ui/primitives";
import { cn } from "@unified-ui/utils";
import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from "react";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  ordered?: boolean;
  /** Visual style: plain rows, dividers between rows, or bordered container. */
  variant?: "plain" | "divided" | "bordered";
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { ordered, variant = "plain", className, ...props },
  ref,
) {
  const Comp = ordered ? "ol" : "ul";
  return (
    <Comp
      ref={ref as never}
      className={cn(
        "flex flex-col",
        variant === "divided" && "divide-y divide-border",
        variant === "bordered" &&
          "divide-y divide-border overflow-hidden rounded-lg border border-border",
        className,
      )}
      {...props}
    />
  );
});

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** Leading visual (avatar, icon). */
  start?: ReactNode;
  /** Trailing content (badge, action, chevron). */
  end?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Render the content as the child element (e.g. a link) for full-row clicks. */
  asChild?: boolean;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { start, end, title, description, asChild, className, children, ...props },
  ref,
) {
  const content =
    title || description ? (
      <div className="min-w-0 flex-1">
        {title ? <div className="truncate text-sm font-medium text-foreground">{title}</div> : null}
        {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
        {children}
      </div>
    ) : (
      <div className="min-w-0 flex-1">{children}</div>
    );
  const rowClass = "flex items-center gap-3 px-card-p py-(--ui-list-item-py)";
  return (
    <li ref={ref} className={cn(!asChild && rowClass, className)} {...props}>
      {asChild ? (
        <Slot
          className={cn(
            rowClass,
            "outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          )}
        >
          {children}
        </Slot>
      ) : (
        <>
          {start ? <div className="shrink-0">{start}</div> : null}
          {content}
          {end ? <div className="shrink-0 text-muted-foreground">{end}</div> : null}
        </>
      )}
    </li>
  );
});
