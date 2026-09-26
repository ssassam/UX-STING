"use client";
import { cn, createVariants, getInitials, type VariantProps } from "@unified-ui/utils";
import {
  Children,
  forwardRef,
  isValidElement,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export const avatarVariants = createVariants({
  base: "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-muted font-medium text-muted-foreground align-middle",
  variants: {
    size: {
      xs: "size-6 text-[0.625rem]",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-12 text-md",
      xl: "size-16 text-lg",
    },
    shape: { circle: "rounded-full", square: "rounded-lg" },
  },
  defaultVariants: { size: "md", shape: "circle" },
});

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  /** Person or entity name: used for alt text and initials fallback. */
  name?: string;
  alt?: string;
  fallback?: ReactNode;
  /** Presence indicator. */
  status?: "online" | "offline" | "busy" | "away";
  statusLabel?: string;
}

const statusColor = {
  online: "bg-success",
  offline: "bg-border-strong",
  busy: "bg-destructive",
  away: "bg-warning",
};

/** User or entity image with initials fallback while loading or on error. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, alt, fallback, size, shape, status, statusLabel, className, children, ...props },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const loaded = loadedSrc === src;
  return (
    <span
      ref={ref}
      className={cn(avatarVariants({ size, shape }), "overflow-visible", className)}
      {...props}
    >
      <span
        className={cn(
          "flex size-full items-center justify-center overflow-hidden",
          shape === "square" ? "rounded-lg" : "rounded-full",
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? ""}
            className={cn("size-full object-cover", !loaded && "opacity-0")}
            onLoad={() => setLoadedSrc(src ?? null)}
            onError={() => setFailedSrc(src ?? null)}
          />
        ) : null}
        {(!showImage || !loaded) && (
          <span
            className={cn(showImage && "absolute inset-0 flex items-center justify-center")}
            role={showImage ? undefined : name ? "img" : undefined}
            aria-label={showImage ? undefined : name}
          >
            {children ?? fallback ?? (name ? <span aria-hidden>{getInitials(name)}</span> : null)}
          </span>
        )}
      </span>
      {status ? (
        <span
          role="img"
          aria-label={statusLabel ?? status}
          className={cn(
            "absolute bottom-0 end-0 size-[28%] min-h-2 min-w-2 rounded-full ring-2 ring-background",
            statusColor[status],
          )}
        />
      ) : null}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before a `+n` summary. */
  max?: number;
  size?: AvatarProps["size"];
  /** Accessible label for the overflow count, e.g. `(n) => \`${n} more\``. */
  moreLabel?: (count: number) => string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max = 4, size = "md", moreLabel = (n) => `${n} more`, className, children, ...props },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const visible = items.slice(0, max);
  const rest = items.length - visible.length;
  return (
    <div
      ref={ref}
      role="group"
      className={cn("flex items-center -space-x-2 rtl:space-x-reverse", className)}
      {...props}
    >
      {visible.map((child, i) => (
        <Avatar
          key={child.key ?? i}
          {...child.props}
          size={size}
          className={cn("ring-2 ring-background", child.props.className)}
        />
      ))}
      {rest > 0 ? (
        <span
          className={cn(avatarVariants({ size }), "ring-2 ring-background")}
          role="img"
          aria-label={moreLabel(rest)}
        >
          <span aria-hidden>+{rest}</span>
        </span>
      ) : null}
    </div>
  );
});
