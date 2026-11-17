---
name: ux-sting-scroll
description: "Implement or repair scroll-linked UX-STING motion, sticky sections and reveal behavior."
---

Use the existing `@ux-sting/motion/gsap` adapter for scoped ScrollTrigger work, or native sticky positioning and CSS when sufficient. Keep scrolling browser-controlled.

Start with the natural document flow. Add pinning or scrubbing only when it explains a sequence or relationship. Calculate bounds from actual content; refresh after fonts and images settle and clean up triggers on unmount. On phones and with reduced motion, preserve the full content in normal flow.

Keep skip links, focus navigation and anchor targets usable around sticky headers. Avoid fixed viewport heights that clip translated content. Check short and long screens, touch input, browser back navigation and content loaded after mount.

Measure layout and inspect start, middle and end states. A screenshot at the top alone cannot verify a scroll effect.
