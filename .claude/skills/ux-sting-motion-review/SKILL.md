---
name: ux-sting-motion-review
description: "Review UX-STING animations for reduced motion, lifecycle cleanup, input parity and rendering cost."
---

Inspect the actual animation code and its rendered states. Use existing `@ux-sting/motion` helpers before adding a motion dependency.

Check keyboard and touch access to every control, `prefers-reduced-motion`, focus visibility, content readability with animation disabled, and a pause control for continuous decorative movement. Hover movement must not be required to discover content.

Look for orphaned listeners, requestAnimationFrame loops, observers and GSAP contexts after unmount. Profile large paints and layout-triggering animation; prefer transforms and opacity for moving elements. A WebGL effect must have a static fallback and should stop when offscreen.

Report each finding with the affected file or element, concrete trigger, user impact and smallest useful fix. Run the relevant motion tests and inspect the reduced-motion state in a browser before claiming it passes.
