"use client";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { useControllableState } from "@ux-sting/hooks";
import { cn, createVariants, type VariantProps } from "@ux-sting/utils";
import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";

export const toggleVariants = createVariants({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-primary-subtle data-[state=on]:text-primary-subtle-foreground [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-border-strong bg-background shadow-xs data-[state=on]:border-primary",
    },
    size: {
      sm: "h-control-sm min-w-(--ui-height-sm) px-2",
      md: "h-control-md min-w-(--ui-height-md) px-3",
      lg: "h-control-lg min-w-(--ui-height-lg) px-4",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface ToggleProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** A two-state button (`aria-pressed`), e.g. bold/italic in a toolbar. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    variant,
    size,
    className,
    onClick,
    ...props
  },
  ref,
) {
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(toggleVariants({ variant, size }), className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setPressed(!pressed);
      }}
      {...props}
    />
  );
});

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({});

export type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>;

/** A set of toggles with roving focus; `type="single"` or `"multiple"`. */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { variant, size, className, children, ...props },
  ref,
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(function ToggleGroupItem({ variant, size, className, ...props }, ref) {
  const ctx = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({ variant: variant ?? ctx.variant, size: size ?? ctx.size }),
        className,
      )}
      {...props}
    />
  );
});
