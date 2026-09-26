import { forwardRef, type HTMLAttributes } from "react";

export const visuallyHiddenStyle = {
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  overflowWrap: "normal",
} as const;

/** Hides content visually while keeping it available to assistive tech. */
export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function VisuallyHidden({ style, ...props }, ref) {
    return <span ref={ref} style={{ ...visuallyHiddenStyle, ...style }} {...props} />;
  },
);
