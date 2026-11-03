import { forwardRef } from "react";
import type { IconComponent, IconProps } from "./create-icon.js";
import { ArrowRightIcon } from "./icons/arrow-right.js";
import { BellIcon } from "./icons/bell.js";
import { CheckIcon } from "./icons/check.js";
import { CopyIcon } from "./icons/copy.js";
import { DownloadIcon } from "./icons/download.js";
import { EyeIcon } from "./icons/eye.js";
import { HeartIcon } from "./icons/heart.js";
import { RefreshCwIcon } from "./icons/refresh-cw.js";
import { SendIcon } from "./icons/send.js";
import { SparklesIcon } from "./icons/sparkles.js";
import { StarIcon } from "./icons/star.js";
import { ZapIcon } from "./icons/zap.js";

/**
 * Motion presets for `AnimatedIcon`. Each preset maps to a keyframe in
 * `@ux-sting/icons/animated.css`; the animation itself runs there, so the
 * layer stays dependency-free (no JS animation engine, no `@ux-sting/motion`
 * import required).
 */
export type IconMotionPreset =
  | "draw"
  | "nudge"
  | "shift"
  | "launch"
  | "drop"
  | "ring"
  | "beat"
  | "twinkle"
  | "spin"
  | "peek"
  | "flash";

/**
 * When the animation plays: on hover/focus of the icon or its
 * `ICON_ANCHOR_CLASS` ancestor ("hover"), once when rendered ("in"), or on a
 * loop ("loop"). All triggers are silent under `prefers-reduced-motion`.
 */
export type IconMotionTrigger = "hover" | "in" | "loop";

/** Add this class to an interactive ancestor (button, link, card) so `hover`
 *  presets play when the whole control is hovered or focused. */
export const ICON_ANCHOR_CLASS = "us-ico-anchor";

export interface AnimatedIconProps extends IconProps {
  /** The icon component to animate, e.g. `ArrowRightIcon`. */
  icon: IconComponent;
  preset?: IconMotionPreset;
  trigger?: IconMotionTrigger;
}

/**
 * Wraps any UX-STING icon with an intent motion. Import the stylesheet once
 * (`import "@ux-sting/icons/animated.css"`) and the icon animates on hover,
 * mount or loop — token-aware (`--ui-duration-*`, `--ui-ease-*`), theme-aware
 * (`currentColor`) and reduced-motion safe.
 */
export const AnimatedIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(function AnimatedIcon(
  { icon: Icon, preset = "nudge", trigger = "hover", className, ...props },
  ref,
) {
  return (
    <Icon
      ref={ref}
      data-ico-anim={preset}
      data-ico-trigger={trigger}
      className={className ? `ui-icon-anim ${className}` : "ui-icon-anim"}
      {...props}
    />
  );
});

export interface AnimatedIconVariantProps extends IconProps {
  preset?: IconMotionPreset;
  trigger?: IconMotionTrigger;
}

/** Binds a preset (and optional default trigger) to an icon, e.g.
 *  `withIconMotion(BellIcon, "ring")`. Props still override per instance. */
export function withIconMotion(
  Icon: IconComponent,
  preset: IconMotionPreset,
  trigger: IconMotionTrigger = "hover",
  name?: string,
) {
  const Animated = forwardRef<SVGSVGElement, AnimatedIconVariantProps>(function Animated(
    { preset: presetProp, trigger: triggerProp, ...props },
    ref,
  ) {
    return (
      <AnimatedIcon
        ref={ref}
        icon={Icon}
        preset={presetProp ?? preset}
        trigger={triggerProp ?? trigger}
        {...props}
      />
    );
  });
  Animated.displayName = `AnimatedIcon(${name ?? Icon.displayName ?? "icon"})`;
  return Animated;
}

/* Flagship marks — one motion idiom per common action. */
export const AnimatedArrowRightIcon = withIconMotion(
  ArrowRightIcon,
  "nudge",
  "hover",
  "arrow-right",
);
export const AnimatedCheckIcon = withIconMotion(CheckIcon, "draw", "in", "check");
export const AnimatedCopyIcon = withIconMotion(CopyIcon, "shift", "hover", "copy");
export const AnimatedSendIcon = withIconMotion(SendIcon, "launch", "hover", "send");
export const AnimatedDownloadIcon = withIconMotion(DownloadIcon, "drop", "hover", "download");
export const AnimatedBellIcon = withIconMotion(BellIcon, "ring", "hover", "bell");
export const AnimatedHeartIcon = withIconMotion(HeartIcon, "beat", "hover", "heart");
export const AnimatedStarIcon = withIconMotion(StarIcon, "twinkle", "hover", "star");
export const AnimatedRefreshIcon = withIconMotion(RefreshCwIcon, "spin", "hover", "refresh-cw");
export const AnimatedEyeIcon = withIconMotion(EyeIcon, "peek", "hover", "eye");
export const AnimatedZapIcon = withIconMotion(ZapIcon, "flash", "hover", "zap");
export const AnimatedSparklesIcon = withIconMotion(SparklesIcon, "twinkle", "hover", "sparkles");
