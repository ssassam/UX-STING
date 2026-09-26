import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { mergeRefs } from "@ux-sting/utils";
import { cn } from "@ux-sting/utils";

type AnyProps = Record<string, unknown>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (
      /^on[A-Z]/.test(key) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => void)(...args);
        const event = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!event?.defaultPrevented) (slotValue as (...a: unknown[]) => void)(...args);
      };
    } else if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === "className") {
      merged[key] = cn(slotValue as string, childValue as string);
    }
  }
  return merged;
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/** Marks the child of a `Slot` that should receive the slot's props. */
export function Slottable({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

function isSlottable(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement(child) && child.type === Slottable;
}

function getElementRef(element: ReactElement): Ref<unknown> | undefined {
  // React 19 exposes ref as a prop; React 18 on the element.
  return (
    (element.props as { ref?: Ref<unknown> }).ref ??
    (element as unknown as { ref?: Ref<unknown> }).ref
  );
}

/**
 * Renders its single child element, merging props, class names, styles,
 * event handlers and refs onto it. Powers the `asChild` prop.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot({ children, ...props }, ref) {
  const childArray = Children.toArray(children);
  const slottable = childArray.find(isSlottable);

  if (slottable) {
    const target = slottable.props.children;
    if (!isValidElement(target)) return null;
    const newChildren = childArray.map((child) =>
      child === slottable ? (target.props as { children?: ReactNode }).children : child,
    );
    return cloneElement(target, {
      ...mergeProps(props as AnyProps, target.props as AnyProps),
      ref: ref ? mergeRefs(ref, getElementRef(target) as Ref<HTMLElement>) : getElementRef(target),
      children: newChildren,
    } as AnyProps);
  }

  if (!isValidElement(children)) {
    return Children.count(children) > 1 ? Children.only(null) : null;
  }
  return cloneElement(children, {
    ...mergeProps(props as AnyProps, children.props as AnyProps),
    ref: ref
      ? mergeRefs(ref, getElementRef(children) as Ref<HTMLElement>)
      : getElementRef(children),
  } as AnyProps);
});

/**
 * Creates a named Slot (useful for devtools and for building polymorphic
 * components): `const ButtonSlot = createSlot("Button")`.
 */
export function createSlot(displayName: string) {
  const Named = forwardRef<HTMLElement, SlotProps>((props, ref) => <Slot {...props} ref={ref} />);
  Named.displayName = `${displayName}Slot`;
  return Named;
}
