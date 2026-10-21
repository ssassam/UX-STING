# UX-STING Universal — vision

UX-STING Universal turns UX-STING from a component library into a system that can **understand** a design, **plan** an original one, **build** it with production components and **prove** the result in a real browser.

It is not a template generator. Layout is not chosen from a gallery of page templates; it is derived from a *Design DNA* — measured or planned decisions about type, color, space, geometry and composition — and from the content the site must carry.

## Three creation modes

| Mode | Input | What happens | Copying rules |
| --- | --- | --- | --- |
| **Reconstruct** | A URL (or screenshots) the user owns or may reproduce | Measure the rendered page → DNA → generate → compare → correct until fidelity stops improving | Text only with explicit authorization; imagery, logos and proprietary code never copied |
| **Original** | A written brief | Plan several directions along independent axes, score them against the brief, render and audit each, let the person choose | — |
| **Remix** | One or more references + a brief | Take facets (palette, typography, rhythm) from references, keep the new project's content structure, re-check accessibility | Inspiration, not replication: never copy a whole identity |

## The loop

```
URL / screenshot / brief
        │
        ▼
 Reference Analyzer ──► Design DNA (editable, with provenance) ◄── Design planner (brief)
                               │
                               ▼
                       Website generator ──► code (UX-STING components, tokens)
                               │
                               ▼
                    Browser QA (render, screenshot, measure, axe, SEO, perf)
                               │
                 fixes ◄───────┘  (accessibility → layout → fidelity)
```

Deterministic checks (contrast, overflow, axe, token distances, structured-data validity) are always separated from judgment (section roles, personality, "is this on brief?"). Judgment can come from heuristics or from a model, and is labelled as such.

## Principles

1. **Measure, don't guess.** Values seen in computed styles are `observed`; everything else is `inferred` with a confidence.
2. **Accessibility outranks fidelity.** A reconstruction never copies a contrast failure; pixel similarity is never optimised at the expense of content, responsiveness or accessibility.
3. **No fixed templates.** Sections come from content; composition comes from DNA.
4. **Production code.** Output uses UX-STING components and tokens and stays editable.
5. **Honest scores.** Lighthouse and fidelity numbers are targets measured on production builds with documented conditions — never promises, never rankings.
6. **Licence hygiene.** Only MIT/Apache-2.0 ideas or code are adapted, always credited.

## Where we are (2026-10-14)

The narrow end-to-end prototype exists and runs: `@ux-sting/design-dna` + `scripts/design-dna/run.ts`.

- **Authorized reconstruction** of the UX-STING Ember example: DNA fidelity 87 → 90/100 in two iterations, 0 axe violations at 1280 and 390 px, no overflow. Visual system (dark palette, amber accent, 72 px display, 1232 px container) transferred; interactive components (reservation form, tabs, map, accordion) did not — that is the next phase.
- **Original design** for a French salon brief: three directions that differ on ≥ 2 axes, each rendered, audited and corrected (the loop caught and fixed a headline that wrapped to five characters per line on phones).

Evidence: `docs/universal/prototype/`. Next steps: `IMPLEMENTATION_ROADMAP.md`.

## Document map

| Document | Covers |
| --- | --- |
| `REFERENCE_REPOSITORY_AUDIT.md` | The 12 reference repositories, licences, what we take |
| `COMPETITIVE_CAPABILITY_MATRIX.md` | What exists, what each reference adds, what we build |
| `DESIGN_DNA_SPEC.md` | The DNA format |
| `REFERENCE_ANALYZER_SPEC.md` | Engine 1: URL / screenshot / source analysis |
| `WEBSITE_GENERATOR_ARCHITECTURE.md` | Engine 4: from DNA to multi-page sites and adapters |
| `MULTI_AGENT_ORCHESTRATION.md` | Engine 8: specialist agents and handoffs |
| `VISUAL_QA_SYSTEM.md` | Engine 7 and the quality gates (Engine 9) |
| `SEO_ENGINE_ARCHITECTURE.md` | Engine 6 and the SEO packages |
| `SECURITY_AND_LICENSING.md` | Engine 11 |
| `BENCHMARK_PLAN.md` | Engine 12 |
| `IMPLEMENTATION_ROADMAP.md` | Phases 1–9 with exit criteria |
