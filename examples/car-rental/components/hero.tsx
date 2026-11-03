"use client";
import { AnimatedCheckIcon, AnimatedIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import { ClockIcon, MapPinIcon, ZapIcon } from "@ux-sting/icons";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { Marquee } from "@ux-sting/react/marquee";
import { gsap, useMotion, useSplitHeading } from "@ux-sting/motion/gsap";
import type { ReactNode } from "react";
import { useRef } from "react";
import { photos, sized } from "../lib/photos";

const FACTS = [
  "Unlimited kilometres, every car",
  "Keys in the app — no counter",
  "CDG & Nice open 24/7",
  "Free cancellation to 48 h",
  "Price match, difference refunded",
  "EVs leave at 80 % or more",
];

/** The four figures the brand is actually made of. */
const STATS = [
  { value: 6, label: "Desks at the arrivals" },
  { value: 2, label: "Open around the clock" },
  { value: 12, label: "Models in the fleet" },
  { value: 4.8, label: "Rating · 31 000 rentals", decimals: 1 },
] as const;

/**
 * The hairpin hero: a split headline over the Col de Turini, the search as the
 * stage card, and the facts on a ticker. GSAP entrance is one timeline; under
 * reduced motion everything is already in place and the ticker can be paused.
 */
export function Hero({ search }: { search: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useSplitHeading(title, { type: "words", stagger: 0.05, duration: 0.9 });

  useMotion(
    ({ reduced }) => {
      if (reduced) return;
      // The headline is already choreographed by SplitText, so this is the rest
      // of heroIntro: eyebrow, copy, actions, and a crossfade on the photograph
      // (its scale push-in is the CSS keyframe in globals.css).
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
      tl.from("[data-hero-eyebrow]", { autoAlpha: 0, y: 8, duration: 0.4 })
        .from("[data-hero-body]", { autoAlpha: 0, y: 12 }, "<")
        .from("[data-hero-action]", { autoAlpha: 0, y: 12, stagger: 0.08 }, "<0.06")
        .from("[data-hero-media]", { autoAlpha: 0, duration: 1.1, ease: "power2.out" }, 0);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-border bg-background"
    >
      <div className="absolute inset-0 -z-20">
        <img
          data-hero-media
          src={sized(photos.hero, 1280)}
          srcSet={`${sized(photos.hero, 500)} 500w, ${sized(photos.hero, 960)} 960w, ${sized(photos.hero, 1280)} 1280w`}
          sizes="100vw"
          alt=""
          className="hero-frame-img size-full bg-muted object-cover object-center"
          fetchPriority="high"
        />
      </div>
      <div aria-hidden className="hero-scrim absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-14 sm:px-6 md:pb-16 md:pt-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pb-20 lg:pt-32">
        <div className="grid content-start gap-6">
          <p data-hero-eyebrow className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {/* The coordinates are a plate, not loose type: bone on red stays above
                4.5:1 whatever the photograph behind it is doing. */}
            <span className="roadbook-label rounded-sm bg-primary px-2 py-1 text-primary-foreground">
              N 44°08′ · E 07°28′
            </span>
            <span className="roadbook-label text-white/90">
              Col de Turini — 40 min from the Nice desk
            </span>
          </p>
          <h1
            id="hero-title"
            ref={title}
            className="font-display max-w-[15ch] text-4xl font-extrabold leading-[1.02] text-balance text-white sm:text-5xl lg:text-7xl"
          >
            Pick up where you land. Drive beyond it.
          </h1>
          <p data-hero-body className="max-w-xl text-lg text-white/90 text-pretty">
            Twelve models at six arrival desks across France — airports, TGV stations and the city
            centre. Unlimited kilometres on every one of them, and the keys arrive in the app.
          </p>
          <ul data-hero-action className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">
            {[
              {
                icon: <AnimatedCheckIcon preset="draw" trigger="in" />,
                text: "No counter, no queue",
              },
              {
                icon: <AnimatedIcon icon={ClockIcon} preset="peek" />,
                text: "Cancel free to 48 h",
              },
              {
                icon: <AnimatedIcon icon={MapPinIcon} preset="drop" />,
                text: "Six desks, one key card",
              },
              {
                icon: <AnimatedIcon icon={ZapIcon} preset="flash" />,
                text: "Electric, charged to 80 %",
              },
            ].map((p) => (
              <li
                key={p.text}
                className={`${ICON_ANCHOR_CLASS} flex items-center gap-2 [&_svg]:size-4`}
              >
                <span aria-hidden>{p.icon}</span>
                <span className="font-medium">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-action className="grid content-start gap-3">
          {search}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="grid gap-0.5">
                <dt className="roadbook-label normal-case tracking-normal text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="font-display text-2xl font-bold">
                  <AnimatedNumber
                    value={s.value}
                    format={{ minimumFractionDigits: "decimals" in s ? s.decimals : 0 }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* No edge fade and no see-through band: a half-faded glyph over the
          hairpin photograph is unreadable and fails AA wherever it happens to be
          when the strip is measured. */}
      <Marquee
        label="What is included on every Drivo rental"
        duration={38}
        fade={false}
        className="border-t border-white/15 bg-background py-2.5 text-foreground"
      >
        {FACTS.map((fact) => (
          <span key={fact} className="roadbook-label inline-flex items-center gap-4 px-4">
            <span aria-hidden className="text-primary">
              ◆
            </span>
            {fact}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
