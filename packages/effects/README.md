# @ux-sting/effects

Optional decorative React components. Import `@ux-sting/effects/effects.css` once, then import named components. Override `--fx-accent` to match your design tokens.

TextReveal, GradientText, ShimmerText, BlurText, SplitText, Typewriter, CountUp, Marquee, SpotlightCard, TiltCard, Magnetic, BorderBeam, GlowBorder, Aurora, DotGrid, GridPattern, Noise, ScrollProgress.

Reduced motion disables movement. Text stays accessible; decorative duplicates are hidden. Marquee starts paused; provide a visible pause toggle if enabling continuous motion, and put only presentational content in it. The background effects are absolutely positioned; use a positioned parent. Animation frames and event listeners are cleaned up on unmount.

Prefer existing `@ux-sting/react` effects when they already fit a project. These are opt-in presentation effects, without WebGL or a runtime animation dependency.
