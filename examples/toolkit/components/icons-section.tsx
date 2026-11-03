import {
  AnimatedArrowRightIcon,
  AnimatedBellIcon,
  AnimatedCheckIcon,
  AnimatedCopyIcon,
  AnimatedDownloadIcon,
  AnimatedEyeIcon,
  AnimatedHeartIcon,
  AnimatedIcon,
  AnimatedRefreshIcon,
  AnimatedSendIcon,
  AnimatedSparklesIcon,
  AnimatedStarIcon,
  AnimatedZapIcon,
  ICON_ANCHOR_CLASS,
} from "@ux-sting/icons/animated";
import { RefreshCwIcon } from "@ux-sting/icons";
import "@ux-sting/icons/animated.css";
import { Section } from "./section";

const MARKS = [
  { icon: AnimatedArrowRightIcon, label: "nudge", name: "arrow-right" },
  { icon: AnimatedCopyIcon, label: "shift", name: "copy" },
  { icon: AnimatedSendIcon, label: "launch", name: "send" },
  { icon: AnimatedDownloadIcon, label: "drop", name: "download" },
  { icon: AnimatedBellIcon, label: "ring", name: "bell" },
  { icon: AnimatedHeartIcon, label: "beat", name: "heart" },
  { icon: AnimatedStarIcon, label: "twinkle", name: "star" },
  { icon: AnimatedRefreshIcon, label: "spin", name: "refresh" },
  { icon: AnimatedEyeIcon, label: "peek", name: "eye" },
  { icon: AnimatedZapIcon, label: "flash", name: "zap" },
  { icon: AnimatedSparklesIcon, label: "twinkle", name: "sparkles" },
] as const;

/** Hover a tile and its icon answers — no JS, one stylesheet, token motion. */
export function IconsSection() {
  return (
    <Section
      id="icons"
      number="06"
      kicker="Animated icons · shipped in 0.8.0"
      title="Icons that move with intent"
      intro={
        <>
          The animated layer wraps any UX-STING icon in a short, purposeful motion — hover a tile
          below and its mark answers. Timing and easing come from the same motion tokens as the rest
          of the system, colour is <code>currentColor</code>, and{" "}
          <code>prefers-reduced-motion</code> plays nothing. It is pure CSS: no animation engine, no
          client JavaScript.
        </>
      }
    >
      <div className="grid gap-4">
        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          aria-label="Animated icon presets"
        >
          {MARKS.map(({ icon: Icon, label, name }) => (
            <li key={name}>
              <button
                type="button"
                className={`${ICON_ANCHOR_CLASS} flex w-full items-center gap-3 rounded-sm border border-border bg-surface px-4 py-3 text-start text-sm font-medium`}
              >
                <Icon size="lg" />
                <span className="grid leading-tight">
                  {name}
                  <span className="font-mono text-xs font-normal text-muted-foreground">
                    {label}
                  </span>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`${ICON_ANCHOR_CLASS} flex w-full items-center gap-3 rounded-sm border border-border bg-surface px-4 py-3 text-start text-sm font-medium`}
            >
              <AnimatedCheckIcon size="lg" />
              <span className="grid leading-tight">
                check
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  draw · on mount
                </span>
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${ICON_ANCHOR_CLASS} flex w-full items-center gap-3 rounded-sm border border-border bg-surface px-4 py-3 text-start text-sm font-medium`}
            >
              <AnimatedIcon icon={RefreshCwIcon} preset="spin" trigger="loop" size="lg" />
              <span className="grid leading-tight">
                any icon
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  spin · loop
                </span>
              </span>
            </button>
          </li>
        </ul>

        <figure className="overflow-x-auto rounded-sm border border-border bg-surface">
          <figcaption className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
            @ux-sting/icons/animated
          </figcaption>
          <pre className="px-4 py-3 font-mono text-xs leading-relaxed">
            {`import "@ux-sting/icons/animated.css";
import { AnimatedBellIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";

<button className={ICON_ANCHOR_CLASS}>
  <AnimatedBellIcon /> Notifications
</button>`}
          </pre>
        </figure>
      </div>
    </Section>
  );
}
