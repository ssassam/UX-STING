---
name: ux-sting-plan
description: "Plan a UX-STING design from a brief before generating code; return scored directions, design decisions, and risks."
---

Read the existing product's tokens and layout conventions first. Record audience, primary action, real content, constraints and intended visual tone. Preserve an established system unless the user requests a redesign.

Use `planSite(brief)` from `@ux-sting/universal` or MCP `plan_design`. It wraps the existing `planDirections` reasoning engine and returns three directions differing on at least two axes, with rationale and risks. Scores are deterministic heuristics, not evidence of conversion performance.

Choose the best fit when the brief provides enough direction; present alternatives when the user asks for exploration. Capture the chosen DNA and `validateDna` findings before generation. Resolve contrast errors before emitting code. Never invent customer claims, imagery rights or benchmark results.

Use `themeToDesignMd` from `@ux-sting/themes` for theme interchange. DESIGN.md imports report unrepresented roles; keep those warnings in the handoff.
