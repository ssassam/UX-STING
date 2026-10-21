# Motion & effects

UX-STING has two layers of motion:

1. **Functional motion** is built into every component: overlays fade and scale, sheets slide, accordions collapse. It uses the duration and easing tokens, exits faster than it enters (about 65% of the enter time), and drops to 0ms under `prefers-reduced-motion`. You never have to think about it.
2. **Expressive motion** is opt-in: text entrances, scroll reveals, counters, marquees, pointer effects and decorative backgrounds. These components live in the **Motion & effects** category.

All expressive components share the same guarantees:

- **No dependencies.** CSS keyframes and a few lines of React. No animation library is added to your bundle, and five of them (`TextEffect`, `TextShimmer`, and the background layers) are server components with no client JavaScript.
- **Reduced motion respected.** Every effect has a still version: text appears at once, counters jump to the value, marquees become scrollable rows, tilt and drift stop.
- **Content is never lost.** `Reveal` only hides content when JavaScript runs and motion is allowed. Animated text and numbers give screen readers the final text once, never the frames in between.
- **WCAG 2.2.2.** Anything that moves for more than five seconds (`Marquee`) pauses on hover and focus and has a pause button.
- **Themeable and RTL-aware.** Colors come from semantic tokens; directions mirror in RTL.

## Components

| Component | Entry point | Use for |
| --- | --- | --- |
| `TextEffect` | `@ux-sting/react/text-effect` | Staggered word/char entrance (`fade`, `blur`, `slide`, `scale`) for one hero headline |
| `TextShimmer` | `@ux-sting/react/text-effect` | "Generating…" style status labels |
| `RotatingText` | `@ux-sting/react/rotating-text` | Cycling a word in place without reflow |
| `Typewriter` | `@ux-sting/react/rotating-text` | Typing, erasing and looping phrases |
| `AnimatedNumber` | `@ux-sting/react/animated-number` | Stats, prices and KPIs, formatted with `Intl` |
| `Reveal` | `@ux-sting/react/reveal` | Sections that enter on scroll, optional `stagger` for children |
| `Marquee` | `@ux-sting/react/marquee` | Logo rows and tag clouds |
| `ScrollProgress` | `@ux-sting/react/scroll-progress` | Reading progress on long pages |
| `Spotlight`, `Tilt` | `@ux-sting/react/spotlight` | Pointer-following glow and subtle tilt on cards (mouse and pen only) |
| `ImageComparison` | `@ux-sting/react/image-comparison` | Before/after slider built on a native range input |
| `MeshGradient`, `DotPattern`, `GridPattern`, `Grain`, `ProgressiveBlur` | `@ux-sting/react/background` | Texture and depth without images |

```tsx
import { Reveal } from "@ux-sting/react/reveal";
import { TextEffect } from "@ux-sting/react/text-effect";
import { AnimatedNumber } from "@ux-sting/react/animated-number";
import { MeshGradient, Grain } from "@ux-sting/react/background";

<section className="relative isolate overflow-hidden py-24">
  <MeshGradient tones={["primary", "info"]} intensity={30} />
  <Grain />
  <TextEffect as="h1" preset="blur" className="text-6xl font-semibold tracking-tight">
    Book the trip, not the tabs
  </TextEffect>
  <Reveal delay={300}>
    <p>
      <AnimatedNumber value={12840} /> trips booked this week
    </p>
  </Reveal>
</section>;
```

Background layers fill their nearest positioned ancestor and sit behind its content, so give the parent `relative isolate`.

## Motion budget

Motion is a spice. A page that animates everything feels slow and looks generated. As a rule of thumb:

- **One** hero entrance (`TextEffect` or `RotatingText`) per page.
- `Reveal` on key sections only, never on every paragraph, and not in app UI (dashboards, settings, forms), where content should simply be there.
- **One** looping element in view at a time (`Marquee`, `MeshGradient animate`, `TextShimmer`).
- Pointer effects on a handful of cards, never on dense lists or form controls.

The `ux-sting-taste` skill maps these choices to design directions; `ux-sting-review` flags motion that breaks the rules above.

## Timing

Functional motion uses the tokens (`--ui-duration-fast` 120ms to `--ui-duration-slower` 450ms). Expressive entrances default to 600–700ms with `cubic-bezier(0.22, 1, 0.36, 1)`, a long ease-out that starts quickly and settles calmly. Pass `duration`, `delay` and `stagger` props to tune them; keep staggers between 40ms and 120ms.
