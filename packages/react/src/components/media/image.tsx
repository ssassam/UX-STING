"use client";
import { ImageIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { forwardRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Required: describe the image, or `""` if purely decorative. */
  alt: string;
  /** Aspect ratio reserved before load (prevents layout shift). */
  ratio?: number;
  fit?: "cover" | "contain";
  /** Rendered if the image fails to load. */
  fallback?: ReactNode;
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Wrapper class name. */
  containerClassName?: string;
}

/**
 * Responsive image with reserved space, lazy loading, a skeleton while
 * loading and a graceful fallback. Pass `srcSet`/`sizes` for responsive art.
 * For Next.js, use `next/image` inside `AspectRatio` or pass it via props.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { alt, ratio, fit = "cover", fallback, radius = "md", loading = "lazy", decoding = "async", className, containerClassName, onLoad, onError, style, ...props },
  ref,
) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const radiusClass = { none: "rounded-none", sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", full: "rounded-full" }[radius];
  return (
    <span
      className={cn("relative block overflow-hidden bg-muted", radiusClass, status === "loading" && "ui-skeleton", containerClassName)}
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
    >
      {status === "error" ? (
        <span role={alt ? "img" : undefined} aria-label={alt || undefined} className="flex size-full min-h-24 items-center justify-center text-muted-foreground [&_svg]:size-6">
          {fallback ?? <ImageIcon />}
        </span>
      ) : (
        <img
          ref={ref}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={(e) => {
            setStatus("loaded");
            onLoad?.(e);
          }}
          onError={(e) => {
            setStatus("error");
            onError?.(e);
          }}
          className={cn(
            "size-full transition-opacity duration-(--ui-duration-slow)",
            fit === "cover" ? "object-cover" : "object-contain",
            status === "loading" ? "opacity-0" : "opacity-100",
            className,
          )}
          style={style}
          {...props}
        />
      )}
    </span>
  );
});
