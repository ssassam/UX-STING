"use client";
import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

type BoxProps = HTMLAttributes<HTMLDivElement>;
type TextProps = HTMLAttributes<HTMLSpanElement> & { children: string };
const reduced = () =>
  typeof window === "undefined" ||
  !window.matchMedia ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const classes = (name: string, other?: string) => `us-fx ${name}${other ? ` ${other}` : ""}`;

/** Text remains in the accessibility tree once; animation is purely presentational. */
export function TextReveal({ children, className, ...props }: TextProps) {
  return (
    <span {...props} className={classes("us-fx-reveal", className)}>
      {children}
    </span>
  );
}
export function GradientText({ children, className, ...props }: TextProps) {
  return (
    <span {...props} className={classes("us-fx-gradient", className)}>
      {children}
    </span>
  );
}
export function ShimmerText({ children, className, ...props }: TextProps) {
  return (
    <span {...props} className={classes("us-fx-shimmer", className)}>
      {children}
    </span>
  );
}
export function BlurText({ children, className, ...props }: TextProps) {
  return (
    <span {...props} className={classes("us-fx-blur", className)}>
      {children}
    </span>
  );
}
export function SplitText({ children, className, ...props }: TextProps) {
  return (
    <span {...props} className={classes("us-fx-split", className)}>
      <span className="us-fx-sr">{children}</span>
      <span aria-hidden="true">
        {Array.from(children).map((char, i) => (
          <span key={i} style={{ animationDelay: `${Math.min(i * 25, 800)}ms` }}>
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}
export function Typewriter({
  children,
  className,
  duration = 1200,
  ...props
}: TextProps & { duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !el.animate) return;
    const animation = el.animate(
      [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
      {
        duration: Math.max(0, Math.min(duration, 5000)),
        easing: `steps(${Math.max(1, children.length)}, end)`,
      },
    );
    return () => animation.cancel();
  }, [children, duration]);
  return (
    <span {...props} className={classes("us-fx-typewriter", className)} ref={ref}>
      {children}
    </span>
  );
}
export function CountUp({
  value,
  from = 0,
  duration = 900,
  locale,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: number;
  from?: number;
  duration?: number;
  locale?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = new Intl.NumberFormat(locale);
  const text = format.format(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || duration <= 0 || !Number.isFinite(value) || !Number.isFinite(from))
      return;
    let id = 0;
    const start = performance.now();
    const fmt = new Intl.NumberFormat(locale);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / Math.min(5000, duration));
      el.textContent = fmt.format(from + (value - from) * (1 - (1 - p) ** 3));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      el.textContent = fmt.format(value);
    };
  }, [value, from, duration, locale]);
  return (
    <span {...props} className={classes("us-fx-count", className)}>
      <span className="us-fx-sr">{text}</span>
      <span aria-hidden="true" ref={ref}>
        {text}
      </span>
    </span>
  );
}
/** Starts paused. Supply a visible toggle when opting into continuous movement. */
export function Marquee({
  children,
  paused = true,
  className,
  ...props
}: BoxProps & { paused?: boolean }) {
  return (
    <div {...props} className={classes("us-fx-marquee", className)} data-paused={paused}>
      <div className="us-fx-marquee-track">
        <div>{children}</div>
        <div aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
export function SpotlightCard({ children, className, onPointerMove, ...props }: BoxProps) {
  return (
    <div
      {...props}
      className={classes("us-fx-spotlight", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (reduced()) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--fx-x", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--fx-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
export function TiltCard({
  children,
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: BoxProps) {
  return (
    <div
      {...props}
      className={classes("us-fx-tilt", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (reduced() || event.pointerType === "touch") return;
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.transform = `perspective(800px) rotateX(${(0.5 - (event.clientY - rect.top) / Math.max(1, rect.height)) * 8}deg) rotateY(${((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 8}deg)`;
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = "";
        onPointerLeave?.(event);
      }}
    >
      {children}
    </div>
  );
}
export function Magnetic({
  children,
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: BoxProps) {
  return (
    <div
      {...props}
      className={classes("us-fx-magnetic", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (reduced() || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.transform = `translate(${Math.max(-8, Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.1))}px,${Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.1))}px)`;
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = "";
        onPointerLeave?.(event);
      }}
    >
      {children}
    </div>
  );
}
export function BorderBeam({ children, className, ...props }: BoxProps) {
  return (
    <div {...props} className={classes("us-fx-beam", className)}>
      {children}
    </div>
  );
}
export function GlowBorder({ children, className, ...props }: BoxProps) {
  return (
    <div {...props} className={classes("us-fx-glow", className)}>
      {children}
    </div>
  );
}
type DecorationProps = Omit<BoxProps, "children">;
export function Aurora({ className, ...props }: DecorationProps) {
  return <div {...props} aria-hidden="true" className={classes("us-fx-aurora", className)} />;
}
export function DotGrid({ className, ...props }: DecorationProps) {
  return <div {...props} aria-hidden="true" className={classes("us-fx-dots", className)} />;
}
export function GridPattern({ className, ...props }: DecorationProps) {
  return <div {...props} aria-hidden="true" className={classes("us-fx-grid", className)} />;
}
export function Noise({ className, ...props }: DecorationProps) {
  return <div {...props} aria-hidden="true" className={classes("us-fx-noise", className)} />;
}
export function ScrollProgress({ className, style, ...props }: DecorationProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        ref.current?.style.setProperty(
          "--fx-progress",
          String(max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0),
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      className={classes("us-fx-progress", className)}
      style={{ "--fx-progress": 0, ...style } as CSSProperties}
    />
  );
}
export type EffectChildren = ReactNode;
