# Implementation roadmap

Small, reviewable phases. Each phase ends with tests and measured exit criteria; nothing earlier is rewritten.

| Phase | Scope | Exit criteria | Status |
| --- | --- | --- | --- |
| 1 | Audit UX-STING and the 12 references | `REFERENCE_REPOSITORY_AUDIT.md`, `COMPETITIVE_CAPABILITY_MATRIX.md`, licence verdicts | ✔ 2026-10-14 |
| 2 | Design DNA spec + reference analysis prototype | `DESIGN_DNA_SPEC.md`; collector + `dnaFromObservation` with provenance; tested on a real fixture | ✔ |
| 3 | Single-page generation | `generatePage` composition-driven; brief planner with 3 distinct directions | ✔ (HTML) |
| 4 | Screenshot comparison + iterative correction | QA (overflow, cramped text, axe, fidelity, pixels) + fix loop with convergence guard; demo on an authorized reference and an original brief | ✔ prototype — next: clipping, alignment, console errors, 768/1600 viewports |
| 5 | Multi-page + shared components | `ux-sting.project.json`; Next.js adapter emitting routes, layouts, UX-STING components, content files per locale; component inventory mapping (forms, tabs, accordion, map, gallery) | Next |
| 6 | SEO, accessibility, performance auditing | `seo-core`, `seo-nextjs`, `seo-audit`, Lighthouse runner; quality gates enforced in CI on generated output | After 5 (SEO steps 2–4 can run in parallel) |
| 7 | Optional motion & effects registry | Registry metadata (cost, reduced-motion variant, CSS vs WebGL tier); lazy WebGL tier via Paper Shaders behind a flag | Partly done (CSS tier shipped) |
| 8 | MCP tools, skills, CLI, adapters | `ux-sting dna analyze/plan/generate/compare/improve/export`; `ux-sting seo …`; `ux-sting-mcp`; Vite and Astro adapters | Later |
| 9 | Benchmark and optimise the weakest areas | `BENCHMARK_PLAN.md` run and published | Later |

## Immediate next steps (in order)
1. **Component inventory in the analyzer** — detect forms, tabs, accordions, maps and galleries, and emit UX-STING components. The Ember run shows this is the biggest remaining fidelity gap (structure, not tokens).
2. **Per-breakpoint observation** (390/768/1280) so responsive composition is measured, not assumed.
3. **Next.js adapter** for one page, then multi-page, reusing `@ux-sting/seo-schema` for structured data.
4. **`seo-core`** and migration of the remaining examples to `seo-schema` (see `SEO_IMPLEMENTATION_ROADMAP.md`).
5. **Lighthouse runner** with documented conditions, wired to the quality gates.
6. **CLI wrapper** over `scripts/design-dna/run.ts` once the commands' shape is reviewed (`analyze`, `design`, `reconstruct`, `remix`, `generate`, `audit`, `compare`, `improve`, `export`).

## Lessons from the prototype that shape the plan
- Token fidelity converges quickly (2 iterations); remaining gaps are structural, so investment goes to component detection, not finer token tuning.
- Deterministic checks found real defects that pixel diffs missed (letter-by-letter wrapping in an index layout; a five-characters-per-line headline on phones). QA must keep growing semantic checks, not only image metrics.
- Naive fixes can game metrics (padding sections to match heights). Fix rules need caps and must report structural gaps instead.
