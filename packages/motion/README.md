# @ux-sting/motion

Motion for UX-STING in two tiers. Both read the `--ui-duration-*` / `--ui-ease-*` tokens, mirror in RTL, and respect `prefers-reduced-motion`.

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

MIT © UX-STING contributors
