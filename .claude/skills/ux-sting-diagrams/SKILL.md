---
name: ux-sting-diagrams
description: "Add editorial diagrams (architecture, flowchart, sequence, timeline, quadrant, funnel, journey, Sankey and ~40 more) to UX-STING sites and docs with the diagram-design skill, styled with the active UX-STING theme. Use when a page, case study, docs article or pitch needs a diagram, when asked to explain a system or process visually, or to replace Mermaid/ASCII diagrams."
---

# UX-STING Diagrams — diagram-design, in the site's own tokens

Diagrams are drawn by the third-party **diagram-design** skill (MIT, Cathryn Lavery). This skill only connects it to UX-STING: theme, embedding, accessibility and review.

## 1. Make sure diagram-design is available
- **Any Agent Skills host (Cursor, Codex, Copilot, Gemini CLI, Qoder, VS Code…):** `npx skills add cathrynlavery/diagram-design`.
- **Claude Code in the UX-STING repo:** `.claude/settings.json` registers its marketplace and enables `diagram-design@diagram-design`. Accept the install prompt when the project is trusted, or run `/plugin install diagram-design@diagram-design`.
- If neither works, stop and say so. Do not fall back to Mermaid or hand-drawn SVG without telling the person.

## 2. Onboard it to the theme once per project
diagram-design asks to customize its style guide on the first diagram. Choose **(c) local folder/design-system** and point it at:
- Your app's theme CSS: the `--ui-*` colors, radius and fonts from `@ux-sting/react/tailwind.css` (or the precompiled `@ux-sting/react/styles.css`) in `node_modules`, or your generated theme when it uses a preset from `@ux-sting/themes` or `dnaToUxStingTheme(dna)`.
- Map roles: paper → `--ui-background`, ink → `--ui-foreground`, muted → `--ui-muted-foreground`, rules → `--ui-border`, accent (1–2 focal nodes only) → `--ui-primary`.
- Tokens are OKLCH. When a tool needs hex, convert with `oklchToHex()` from `@ux-sting/tokens`; never guess.
- Save it as a named profile (one per site/theme) so later diagrams match without re-asking.

## 3. Pick the diagram before drawing
Follow diagram-design's own rule: a table, list or one sentence often beats a diagram. Keep to ≤ 9 nodes; split larger systems. One diagram per idea.

## 4. Put it into a UX-STING page
diagram-design outputs one self-contained `.html` with inline SVG (and PNG/SVG via `/export-diagram`).
- **Next.js / React:** export SVG, save it under `public/diagrams/<name>.svg` or import it as a component, and place it in a `<figure>` with a visible `<figcaption>`. Use UX-STING layout (`Container`, `Stack`, `Card`) around it, not custom wrappers.
- **Standalone HTML** (Universal prototype output): inline the `<svg>` directly.
- Width: `max-inline-size: 100%; block-size: auto`. At 375px a wide diagram either gets a vertical variant (ask diagram-design for the vertical layout) or scrolls inside a labelled, focusable region — never the whole page.
- Dark mode: prefer the version that uses `currentColor`/CSS variables; otherwise export light and dark and switch with `prefers-color-scheme` / the UX-STING color mode.

## 5. Accessibility
- The SVG gets `role="img"` plus `<title>` and `<desc>` (or `aria-labelledby` pointing to the caption).
- Anything a reader must know (steps, numbers, relationships) is also in text: the caption, a list under the figure, or a `Collapsible` with the data table.
- Contrast of labels against the paper color must pass AA; check with the same tokens the site uses.
- Animated reveal is diagram-design's only autoplay; it must respect `prefers-reduced-motion`.

## 6. Review
Render the page at 1280 and 390 px and look at the screenshots yourself (see `ux-sting-review`). Check: no overflow, labels readable, the accent marks only the focal node(s), the diagram agrees with the text next to it.

Third-party notice: diagram-design is installed from its own repository and is not redistributed here (see `THIRD_PARTY_NOTICES.md`).
