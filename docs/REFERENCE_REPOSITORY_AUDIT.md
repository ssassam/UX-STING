# Reference repository audit

Twelve repositories were cloned (shallow, at their default branch on 2026-10-14) and read at the file level: architecture, techniques, dependencies, license files and how each would integrate with UX-STING. Nothing was installed into UX-STING from them.

**Reading the licence column matters most.** Only MIT and Apache-2.0 material may be adapted into UX-STING. "Research only" means we may learn from the ideas but must not copy code, data or assets.

| # | Repository | Licence (from the repo) | Verdict |
| --- | --- | --- | --- |
| 1 | superdesigndev/superdesign | AGPLv3 + commercial "Enterprise" files | Research only (copyleft; archived, now a web app) |
| 2 | marvkr/better-design | MIT | Ideas adapted (credited) |
| 3 | madebymustafa/design-taste | MIT | Ideas adapted (credited) |
| 4 | DavidHDev/canvas-ui | MIT **+ Commons Clause** (no redistribution of the components) | Research only |
| 5 | paper-design/shaders | Apache-2.0, zero runtime deps | Candidate optional dependency |
| 6 | ui-layouts/ui-tools | **No licence file** (all rights reserved) | Research only |
| 7 | Hyperiux-Immersion-Labs/hyperiux-components | CLI MIT; effects under a proprietary "Hyperiux Effects License" forbidding redistribution | Research only |
| 8 | nextlevelbuilder/ui-ux-pro-max-skill | MIT | Already adapted (credited since v0) |
| 9 | ibelick/motion-primitives | MIT (depends on `motion`) | Ideas re-implemented without the dependency |
| 10 | ui-layouts/cursify | **No licence file** | Research only |
| 11 | akaieuan/trickle-UI-kit | MIT (demos CC0) | Ideas re-implemented |
| 12 | AgriciDaniel/claude-seo | MIT | Ideas adapted (credited) |

## Per repository

### 1. Superdesign (AGPLv3)
- **Architecture:** VS Code extension (TypeScript, esbuild) wrapping LLM providers via the AI SDK; a system prompt drives HTML mockup generation onto a canvas webview; the product has since moved to a hosted web app and a separate skill repo.
- **Reusable technique:** design exploration — always generate several variations in parallel (its prompt spins up three sub-agents per design) and let the user fork/iterate.
- **Strengths:** fast divergent exploration; prompt-to-IDE loop.
- **Weaknesses:** output is throwaway HTML mockups, no design system, no QA loop; repo no longer maintained.
- **Dependencies:** 21 runtime (AI SDK providers, Claude Code SDK, execa…).
- **Integration:** idea only. UX-STING implements exploration as `planDirections()` + `ux-sting-explore` skill. No code read into UX-STING.

### 2. Better Design (MIT)
- **Architecture:** MCP server + shadcn registry; 31 brand-style design systems (CSS tokens + component code); tools such as `get-ui-principle`, `get-review-rules`, `find-design-system`.
- **Technique:** design intelligence served on demand through MCP; *review-before-handoff* loop; "preserve an existing product's design system".
- **Weaknesses:** brand look-alike systems risk trade-dress imitation; heavy reliance on a hosted service; rules are prose, not measured.
- **Integration:** workflow ideas adapted into `ux-sting-taste` / `ux-sting-review`. The MCP tool surface informs `seo-mcp` / `ux-sting mcp` (roadmap).

### 3. Design Taste (MIT)
- **Architecture:** 24 Markdown skills (core anti-slop skill, 10 genre packs, craft skills) with before/after HTML demos.
- **Technique:** "declare a design read", ban the LLM defaults, genre identities, pre-flight checklist.
- **Weaknesses:** taste encoded only as prose; no measurement or enforcement.
- **Integration:** adapted into `ux-sting-taste`; its genres became the four direction presets and the *type × palette × composition* axes of the planner, where the "generic AI look" is now a scored penalty.

### 4. Canvas UI (MIT + Commons Clause)
- **Architecture:** 35 effects rendered over live DOM via the experimental HTML-in-canvas API, with GPU-overlay fallback; React/Vue/Svelte/Solid/vanilla builds; WebGL (GLSL) or WebGPU (WGSL).
- **Strengths:** impressive, framework-agnostic, progressive fallback.
- **Weaknesses:** 19 runtime deps (three, motion…); experimental browser APIs; GPU cost.
- **Licence:** the Commons Clause forbids redistributing the components "alone, in a bundle, or as a ported version". **We cannot ship them or ports of them.**
- **Integration:** none beyond the idea of an effects registry with graceful fallback.

### 5. Paper Shaders (Apache-2.0)
- **Architecture:** zero-dependency canvas shader package (`@paper-design/shaders`, `-react`), 30 shaders (mesh gradient, grain, dithering, halftone, metaballs…), pre-1.0 with breaking changes in 0.0.x.
- **Strengths:** zero deps, small, visual quality.
- **Weaknesses:** WebGL per element; unpinned API churn; NOTICE file must travel with redistribution.
- **Integration:** **the one candidate dependency** for the optional WebGL tier of the effects registry — pinned exact version, lazy-loaded, peer dependency, NOTICE reproduced. CSS-only equivalents (`MeshGradient`, `Grain`, `DotPattern`) already exist in UX-STING for the default tier.

### 6. UI Tools (no licence)
- **Architecture:** Next.js app of generators (mesh gradients, shadows, clip-paths, background snippets); 60 deps.
- **Integration:** research only. Generators are a good docs-site idea (generate UX-STING token code); build independently.

### 7. Hyperiux (proprietary effects licence)
- **Architecture:** CLI (MIT) that installs effects from a registry; 50+ free / 100+ paid effects; GSAP/Three.js; MCP server.
- **Licence:** the effects licence forbids redistribution, so free effects cannot be bundled either.
- **Integration:** research only — the `init/add/list` CLI shape matches what UX-STING already has.

### 8. UI/UX Pro Max (MIT)
- **Architecture:** Python BM25 search over curated CSVs (styles, palettes, typography, UX guidelines, product reasoning), with a provenance file recording `verifiedAt`, confidence and sources; installs into many agent platforms.
- **Strength:** data provenance and freshness SLA per record.
- **Weakness:** guidance retrieval only; no rendering or verification.
- **Integration:** priority rules already adapted into `docs/ux-quality.md`. Its *provenance + freshness* pattern was reused for Google rules in `@ux-sting/seo-schema` (`checkedAt`, `confidence`) and for DNA provenance.

### 9. Motion Primitives (MIT)
- **Architecture:** ~30 React components on the `motion` library (text effects, in-view, animated number, magnetic, morphing dialog…).
- **Weakness:** every component pays for `motion` (~30 kB) and needs `"use client"`.
- **Integration:** equivalent zero-dependency components were written from scratch (`TextEffect`, `Reveal`, `AnimatedNumber`, `Marquee`, `Spotlight`, `Tilt`, `ImageComparison`).

### 10. Cursify (no licence)
- Cursor animation components. **Research only.** Custom cursors also conflict with accessibility (pointer precision, reduced motion); UX-STING ships none by default.

### 11. Trickle UI Kit (MIT)
- 47 pure-CSS text animations as RSC, registry-installed; median < 1 kB.
- **Integration:** confirmed the CSS-first approach used by `TextEffect` / `TextShimmer` (server components, no client JS).

### 12. Claude SEO (MIT)
- **Architecture:** Claude Code plugin — 26 skills, 19 sub-agents, ~70 Python scripts (fetch, parse, schema, sitemap, PSI/CrUX, GSC), ~70 tests, a canonical SSRF module with DNS pinning, an opt-in local-target allowlist.
- **Strengths:** breadth, security hardening, deprecation tracking.
- **Weaknesses:** Python toolchain beside a TypeScript project; rules as prose with dated claims that need re-verification; scores aggregated across heuristic and deterministic checks.
- **Integration:** checklists informed `@ux-sting/seo-schema` (credited); its URL-safety design informed `checkTargetUrl` (allowlist only for the top-level target, metadata always refused). See `SEO_COMPETITIVE_AUDIT.md`.

## What we deliberately do not take
- Any code, data or assets from repositories 1, 4, 6, 7, 10.
- Company look-alike design systems (trade dress) — UX-STING's company-style presets are labelled unofficial approximations; new "design directions" describe genres, not brands.
- Runtime dependencies on animation libraries for things CSS does well.
