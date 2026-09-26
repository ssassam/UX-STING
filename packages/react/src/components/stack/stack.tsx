import { Slot } from "@unified-ui/primitives";
import { cn, responsiveVars } from "@unified-ui/utils";
import { forwardRef, type CSSProperties, type ElementType } from "react";
import type { SpaceToken, StackProps } from "./stack.types.js";

export const space = (token: SpaceToken) => `var(--ui-space-${token.replace(".", "_")})`;

const alignMap = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline" };
const justifyMap = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" };

/**
 * Flex layout with token-based, responsive `gap` and `direction`. Responsive
 * values compile to CSS variables, so Stack is a server component.
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as, asChild, gap = "4", direction, align, justify, wrap, className, style, ...props },
  ref,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return (
    <Comp
      ref={ref}
      className={cn("ui-stack", align && alignMap[align], justify && justifyMap[justify], wrap && "flex-wrap", className)}
      style={{ ...responsiveVars("ui-gap", gap, space), ...responsiveVars("ui-direction", direction), ...style } as CSSProperties}
      {...props}
    />
  );
});

/** Horizontal Stack. */
export const HStack = forwardRef<HTMLElement, StackProps>(function HStack({ align = "center", ...props }, ref) {
  return <Stack ref={ref} direction="row" align={align} {...props} />;
});

/** Vertical Stack. */
export const VStack = forwardRef<HTMLElement, StackProps>(function VStack(props, ref) {
  return <Stack ref={ref} direction="column" {...props} />;
});

/** Flex: a Stack defaulting to a row, with no gap. */
export const Flex = forwardRef<HTMLElement, StackProps>(function Flex({ gap = "0", ...props }, ref) {
  return <Stack ref={ref} direction={props.direction ?? "row"} gap={gap} {...props} />;
});

/** Pushes siblings apart inside a Stack/Flex. */
export function Spacer({ className }: { className?: string }) {
  return <div aria-hidden className={cn("flex-1 self-stretch", className)} />;
}
