export {
  prefersReducedMotion,
  tokenDuration,
  flip,
  withViewTransition,
  reorder,
  animateSize,
  popNumber,
  trackIndicator,
  type MotionOptions,
  type ReorderOptions,
  type IndicatorOptions,
} from "./core.js";

/** The transitions in the CSS catalog (`@ux-sting/motion/css/<name>.css`). */
export const TRANSITIONS = [
  "card-resize",
  "number-pop",
  "notification-stack",
  "list-reorder",
  "accordion",
  "tab-indicator",
  "toast",
  "skeleton",
] as const;
export type TransitionName = (typeof TRANSITIONS)[number];
