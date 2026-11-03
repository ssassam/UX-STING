"use client";
import { AnimatedIcon, ICON_ANCHOR_CLASS } from "@ux-sting/icons/animated";
import { CarIcon, ClockIcon, KeyRoundIcon, SmartphoneIcon } from "@ux-sting/icons";
import { Reveal } from "@ux-sting/react/reveal";
import { Text } from "@ux-sting/react/typography";
import { gsap, useMotion } from "@ux-sting/motion/gsap";
import { useRef } from "react";

/** The four stages of a Drivo rental, in the order a driver meets them. */
const STAGES = [
  {
    marker: "0 km",
    title: "Book in 60 seconds",
    body: "Pick dates, a car and extras. Pay at pick-up or now — the quote you see is the price.",
    icon: <AnimatedIcon icon={SmartphoneIcon} preset="peek" />,
  },
  {
    marker: "+ 200 m",
    title: "Check in on your phone",
    body: "Upload the licence, take the selfie, sign. The desk never sees you.",
    icon: <AnimatedIcon icon={KeyRoundIcon} preset="draw" trigger="in" />,
  },
  {
    marker: "∞ km",
    title: "Unlock and drive",
    body: "The car is waiting in the bay. Open it with the app and go — unlimited kilometres.",
    icon: <AnimatedIcon icon={CarIcon} preset="nudge" />,
  },
  {
    marker: "08:59",
    title: "Return in minutes",
    body: "Park, photograph it, drop the key in the box. The deposit frees the same day.",
    icon: <AnimatedIcon icon={ClockIcon} preset="ring" />,
  },
];

/**
 * The signature sequence. On a wide screen the panel pins, the hairpin draws
 * itself with the scroll and each stage lights up as the road reaches it. Below
 * 1024 px and under reduced motion nothing pins or draws — the `Reveal`
 * entrances carry the section, and the markup is already the finished list.
 */
export function StagesSection() {
  const scope = useRef<HTMLElement>(null);

  useMotion(
    ({ reduced }) => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const pinned = scope.current?.querySelector<HTMLElement>("[data-stage-pin]");
        const stroke = scope.current?.querySelector<SVGPathElement>("[data-route-stroke]");
        const cards = gsap.utils.toArray<HTMLElement>("[data-stage-card]", scope.current);
        if (!pinned || !stroke || !cards.length) return;

        const length = stroke.getTotalLength();
        gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinned,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1.2,
          },
        });
        tl.to(stroke, { strokeDashoffset: 0 }, 0);
        cards.forEach((card, i) => {
          tl.set(card, { attr: { "data-stage-active": "true" } }, (i / cards.length) * 0.8);
        });
        // A hairpin past the last stage so the road finishes where the list does.
        tl.to(stroke, { strokeDashoffset: 0 }, 0.8);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="stages"
      aria-labelledby="stages-title"
      className="border-t border-border bg-surface"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10 md:py-24">
        <div className="relative ps-4 md:ps-0">
          <span aria-hidden className="route-line absolute inset-y-0 start-0 w-px overflow-hidden">
            <span className="route-line-fill" />
          </span>
          <p className="roadbook-label">
            <span className="text-muted-foreground">STAGE</span> 03
          </p>
        </div>

        <div className="grid min-w-0 gap-8">
          <div className="grid gap-2">
            <p className="roadbook-label text-muted-foreground">The whole rental, four moves</p>
            <h2
              id="stages-title"
              className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl"
            >
              Nobody at a counter. That is the product.
            </h2>
            <Text variant="muted" className="max-w-2xl text-pretty">
              Each stage is a screen the system already ships — the search, the check-in, the
              unlock, the return. Scroll and the road draws itself.
            </Text>
          </div>

          <div
            data-stage-pin
            className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-14"
          >
            <div className="grid content-start gap-4">
              <svg viewBox="0 0 120 300" aria-hidden className="h-64 w-full lg:h-[26rem]">
                <path
                  data-route-stroke
                  d="M18 288 C 62 268 104 250 104 222 C 104 194 16 186 16 158 C 16 130 104 122 104 94 C 104 66 26 58 32 26 L 34 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary"
                />
                <circle cx="18" cy="288" r="5" className="fill-foreground" />
                <circle cx="34" cy="10" r="5" className="fill-foreground" />
              </svg>
              <p className="roadbook-label text-muted-foreground">
                Col de Turini · 14 hairpins · 1 614 m
              </p>
            </div>

            <ol className="grid gap-3">
              {STAGES.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 70} preset="slide-up">
                    <div
                      data-stage-card
                      className={`${ICON_ANCHOR_CLASS} stage-card grid gap-2 rounded-xl border border-border bg-card p-5 transition-colors duration-300 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-start sm:gap-4`}
                    >
                      <span className="flex items-center gap-3 text-muted-foreground sm:block sm:gap-2">
                        <span aria-hidden className="text-primary [&_svg]:size-5">
                          {s.icon}
                        </span>
                        <span className="roadbook-label">{s.marker}</span>
                      </span>
                      <div className="grid gap-1">
                        <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                        <Text size="sm" variant="muted" className="max-w-prose">
                          {s.body}
                        </Text>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
