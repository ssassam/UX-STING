# @ux-sting/motion

Motion for UX-STING in three tiers: a dependency-free CSS catalog, plus two optional adapters (GSAP, and anime.js in beta). All read the `--ui-duration-*` / `--ui-ease-*` tokens, mirror in RTL, and respect `prefers-reduced-motion`.

## 1. CSS transition catalog (no dependencies)

```css
@import "@ux-sting/motion/motion.css"; /* everything */
@import "@ux-sting/motion/css/toast.css"; /* or one at a time */
```

| Transition | File | Helper |
| --- | --- | --- |
| Card resize | `css/card-resize.css` | `animateSize(el, mutate)` |
| Number pop-in | `css/number-pop.css` | `popNumber(el, text)` |
| Notification stack | `css/notification-stack.css` | — |
| List reorder | `css/list-reorder.css` | `reorder(list, mutate)` (View Transitions, FLIP fallback) |
| Accordion | `css/accordion.css` | — (`<details>` or `[data-state]`) |
| Tab indicator | `css/tab-indicator.css` | `trackIndicator(tablist)` |
| Toast | `css/toast.css` | — (popover API or `[data-state]`) |
| Skeleton → content | `css/skeleton.css` | — (`aria-busy`) |

Each file's header comment shows the markup. Demos: `packages/motion/demos/` (open `index.html` after `pnpm build`).

Helpers are framework-agnostic and SSR-safe (no DOM access at import). React: `@ux-sting/motion/react` exports `useReorder`, `useAnimateSize`, `useTabIndicator` and `useNumberPop`.

## 2. GSAP adapter (optional)

```bash
pnpm add gsap @gsap/react
```

```tsx
"use client";
import { useRef } from "react";
import { useScrollReveal, useSplitHeading, heroIntro, useMotion } from "@ux-sting/motion/gsap";

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  useMotion(({ reduced }) => { if (!reduced) heroIntro({ heading: "h1", body: "p", actions: ".cta" }); }, { scope });
  useScrollReveal(scope);
  return <section ref={scope}>…</section>;
}
```

`useMotion`, `useScrollReveal`, `usePinnedScrub`, `useSplitHeading`, `useFlipLayout` and the presets `fadeUp`, `staggerIn`, `heroIntro`, `countUp`, `crossfade`. All hooks use `useGSAP` with a scope ref and revert on unmount; reduced motion goes through `gsap.matchMedia()`.

GSAP is a peer dependency under its own licence (free for nearly all uses, see gsap.com/standard-license); nothing from it is bundled here. See `docs/motion.md` for the full guide.

## 3. anime.js adapter (optional, beta)

```bash
pnpm add animejs
```

```tsx
"use client";
import { useRef } from "react";
import { useScrollReveal, useSplitHeading } from "@ux-sting/motion/anime";

export function Features() {
  const scope = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useSplitHeading(title, { type: "words" });
  useScrollReveal(scope); // [data-reveal] children reveal once as they enter
  return (
    <section ref={scope}>
      <h2 ref={title}>Everything in one place</h2>
      <article data-reveal>…</article>
    </section>
  );
}
```

`useAnimeMotion`, `useScrollReveal`, `useSplitHeading`, the `fadeUp` preset, and re-exports of `animate`, `createTimeline`, `onScroll`, `set`, `splitText` and `stagger`. Hooks run inside `createScope()` and revert on unmount; reduced motion leaves content in its natural state.

It does not include pinned scroll scrubbing or FLIP layouts; use the GSAP tier for those. The adapter is about 24 KB gzipped with animejs (measured with esbuild), against about 58 KB for the GSAP tier with its plugins. anime.js is MIT-licensed. The API is in beta and may change before 1.0.

MIT © UX-STING contributors
