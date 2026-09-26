"use client";
import { useControllableState } from "@unified-ui/hooks";
import { clamp, cn } from "@unified-ui/utils";
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type RefObject,
} from "react";
import { useLocale } from "../../provider/context.js";

interface GroupContextValue {
  direction: "horizontal" | "vertical";
  sizes: number[];
  minSizes: number[];
  resize: (handleIndex: number, delta: number) => void;
  groupRef: RefObject<HTMLDivElement | null>;
}

const GroupContext = createContext<GroupContextValue | null>(null);

function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("Resizable components must be used inside <ResizablePanelGroup>.");
  return ctx;
}

export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  /** Panel sizes in percent (uncontrolled). Defaults to equal sizes. */
  defaultSizes?: number[];
  sizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
}

type IndexedProps = { __index?: number };

/** Split view with draggable, keyboard-accessible handles. */
export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(function ResizablePanelGroup(
  { direction = "horizontal", defaultSizes, sizes: sizesProp, onSizesChange, className, children, ...props },
  ref,
) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const panels = Children.toArray(children).filter(
    (c): c is ReactElement<ResizablePanelProps> => isValidElement(c) && c.type === ResizablePanel,
  );
  const count = panels.length || 1;
  const minSizes = panels.map((p) => p.props.minSize ?? 10);
  const [sizes, setSizes] = useControllableState({
    value: sizesProp,
    defaultValue: defaultSizes ?? Array.from({ length: count }, () => 100 / count),
    onChange: onSizesChange,
  });

  const resize = (handleIndex: number, delta: number) => {
    setSizes((prev) => {
      const next = [...prev];
      const a = next[handleIndex] ?? 0;
      const b = next[handleIndex + 1] ?? 0;
      const minA = minSizes[handleIndex] ?? 0;
      const minB = minSizes[handleIndex + 1] ?? 0;
      const newA = clamp(a + delta, minA, a + b - minB);
      next[handleIndex] = newA;
      next[handleIndex + 1] = a + b - newA;
      return next;
    });
  };

  let panelIndex = -1;
  const indexed = Children.map(children, (child) => {
    if (!isValidElement<IndexedProps>(child)) return child;
    if (child.type === ResizablePanel) panelIndex += 1;
    if (child.type === ResizablePanel || child.type === ResizableHandle) {
      return cloneElement(child, { __index: Math.max(panelIndex, 0) });
    }
    return child;
  });

  return (
    <GroupContext.Provider value={{ direction, sizes, minSizes, resize, groupRef }}>
      <div
        ref={(node) => {
          groupRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-direction={direction}
        className={cn("flex size-full overflow-hidden", direction === "vertical" ? "flex-col" : "flex-row", className)}
        {...props}
      >
        {indexed}
      </div>
    </GroupContext.Provider>
  );
});

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Minimum size in percent. */
  minSize?: number;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps & IndexedProps>(function ResizablePanel(
  { minSize: _minSize, __index = 0, className, style, ...props },
  ref,
) {
  const { sizes } = useGroup();
  return (
    <div
      ref={ref}
      data-panel=""
      className={cn("min-h-0 min-w-0 overflow-auto", className)}
      style={{ flexBasis: `${sizes[__index] ?? 0}%`, flexGrow: 0, flexShrink: 0, ...style }}
      {...props}
    />
  );
});

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  /** Show a visible grip. */
  withHandle?: boolean;
  /** Keyboard step in percent. */
  step?: number;
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps & IndexedProps>(function ResizableHandle(
  { withHandle, step = 5, __index = 0, className, "aria-label": ariaLabel = "Resize", ...props },
  ref,
) {
  const { direction, sizes, minSizes, resize, groupRef } = useGroup();
  const { dir } = useLocale();
  const horizontal = direction === "horizontal";
  const rtlFactor = horizontal && dir === "rtl" ? -1 : 1;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const group = groupRef.current;
    if (!group) return;
    event.preventDefault();
    const rect = group.getBoundingClientRect();
    const total = horizontal ? rect.width : rect.height;
    let last = horizontal ? event.clientX : event.clientY;
    const onMove = (e: globalThis.PointerEvent) => {
      const pos = horizontal ? e.clientX : e.clientY;
      resize(__index, (((pos - last) / total) * 100) * rtlFactor);
      last = pos;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dec = horizontal ? (dir === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
    const inc = horizontal ? (dir === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    let delta = 0;
    if (event.key === dec) delta = -step;
    else if (event.key === inc) delta = step;
    else if (event.key === "Home") delta = -100;
    else if (event.key === "End") delta = 100;
    else return;
    event.preventDefault();
    resize(__index, delta);
  };

  const value = Math.round(sizes[__index] ?? 0);
  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-orientation={horizontal ? "vertical" : "horizontal"}
      aria-valuenow={value}
      aria-valuemin={minSizes[__index] ?? 0}
      aria-valuemax={100 - (minSizes[__index + 1] ?? 0)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-border outline-none transition-colors hover:bg-primary focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-ring",
        horizontal ? "w-px cursor-col-resize after:absolute after:inset-y-0 after:-inset-x-1.5" : "h-px cursor-row-resize after:absolute after:inset-x-0 after:-inset-y-1.5",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <span
          aria-hidden
          className={cn("z-10 rounded-full border border-border-strong bg-background", horizontal ? "h-6 w-1.5" : "h-1.5 w-6")}
        />
      ) : null}
    </div>
  );
});
