import { cn } from "@ux-sting/utils";
import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";

/**
 * Decorative backgrounds drawn with CSS only: server components with no
 * client JavaScript, no canvas and no images to download. Every layer is
 * hidden from assistive tech, ignores the pointer and fills its nearest
 * positioned ancestor (`relative isolate` on the parent). Colors come from
 * theme tokens, so they follow the theme, dark mode and high contrast.
 */

type ToneToken =
  "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "destructive" | "muted";

export interface MeshGradientProps extends HTMLAttributes<HTMLDivElement> {
  /** Two to four theme colors. Default `["primary", "info", "accent"]`. */
  tones?: ToneToken[];
  /** Strength of the colors, 0–100. Default 35. */
  intensity?: number;
  /** Slow drift (about 20s per cycle). Stops under reduced motion. */
  animate?: boolean;
}

const POSITIONS = ["15% 20%", "85% 15%", "70% 85%", "20% 80%"];

/** Soft multi-color glow built from layered radial gradients. */
export const MeshGradient = forwardRef<HTMLDivElement, MeshGradientProps>(function MeshGradient(
  {
    tones = ["primary", "info", "accent"],
    intensity = 35,
    animate = false,
    className,
    style,
    ...props
  },
  ref,
) {
  const layers = tones
    .slice(0, 4)
    .map(
      (tone, i) =>
        `radial-gradient(at ${POSITIONS[i]}, color-mix(in oklch, var(--ui-${tone}) ${intensity}%, transparent) 0, transparent 55%)`,
    )
    .join(", ");
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("ui-bg-layer ui-mesh-gradient", className)}
      data-animate={animate ? "" : undefined}
      style={{ backgroundImage: layers, ...style }}
      {...props}
    />
  );
});

export interface PatternProps extends HTMLAttributes<HTMLDivElement> {
  /** Cell size in px. Default 24. */
  size?: number;
  /** Fade the pattern out towards the edges. Default `true`. */
  fade?: boolean;
}

/** Dot grid in the border color — a quiet texture behind heroes and empty states. */
export const DotPattern = forwardRef<HTMLDivElement, PatternProps>(function DotPattern(
  { size = 24, fade = true, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("ui-bg-layer ui-dot-pattern", className)}
      data-fade={fade ? "" : undefined}
      style={{ "--ui-pattern-size": `${size}px`, ...style } as CSSProperties}
      {...props}
    />
  );
});

/** Hairline grid, for technical and editorial layouts. */
export const GridPattern = forwardRef<HTMLDivElement, PatternProps>(function GridPattern(
  { size = 48, fade = true, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("ui-bg-layer ui-grid-pattern", className)}
      data-fade={fade ? "" : undefined}
      style={{ "--ui-pattern-size": `${size}px`, ...style } as CSSProperties}
      {...props}
    />
  );
});

export interface GrainProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–1. Default 0.08 — grain should be felt, not seen. */
  opacity?: number;
}

/** Film-grain noise from an inline SVG filter. Breaks up flat fills and gradient banding. */
export const Grain = forwardRef<HTMLDivElement, GrainProps>(function Grain(
  { opacity = 0.08, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("ui-bg-layer ui-grain", className)}
      style={{ opacity, ...style }}
      {...props}
    />
  );
});

export interface ProgressiveBlurProps extends HTMLAttributes<HTMLDivElement> {
  /** Edge the blur grows towards. Default `bottom`. */
  side?: "top" | "bottom";
  /** Maximum blur in px. Default 12. */
  blur?: number;
}

/**
 * Blur that increases towards one edge, so text over a scrolling list or an
 * image stays readable. Place it over the area to soften. Under
 * `prefers-reduced-transparency` it becomes a plain fade.
 */
export const ProgressiveBlur = forwardRef<HTMLDivElement, ProgressiveBlurProps>(
  function ProgressiveBlur({ side = "bottom", blur = 12, className, style, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("ui-progressive-blur pointer-events-none", className)}
        data-side={side}
        style={{ "--ui-blur-max": `${blur}px`, ...style } as CSSProperties}
        {...props}
      >
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  },
);
