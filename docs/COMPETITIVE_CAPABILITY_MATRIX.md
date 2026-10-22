# Competitive capability matrix

Legend: **✔** shipped and tested · **◐** prototype or partial · **✗** missing · **—** out of scope. "Reference" names the repository that contributes the idea (see `REFERENCE_REPOSITORY_AUDIT.md`); "Build" says what UX-STING must develop itself.

| Capability | UX-STING today | Best reference | Build independently? |
| --- | --- | --- | --- |
| Accessible React component library (~100 families) | ✔ | — (none of the references) | Already ours |
| Tokens, 17 themes, dark/high-contrast, density, RTL | ✔ | Better Design (brand systems) | Ours; no brand clones |
| Agent skills for building / taste / review / explore | ✔ | Design Taste, UI UX Pro Max, Better Design | Adapted (MIT), credited |
| Zero-dependency motion & effects (CSS tier) | ✔ | Motion Primitives, Trickle | Re-implemented |
| WebGL effects tier | ✗ | Paper Shaders (Apache-2.0) | Optional peer dependency, lazy-loaded |
| Custom cursors, HTML-in-canvas effects | ✗ | Cursify, Canvas UI | **Not reusable** (licence); build only if needed |
| Natural-language brief → design directions | ◐ `planDirections` | Superdesign (idea), Design Taste | Ours (deterministic planner + optional LLM director) |
| URL analysis (computed styles, geometry) | ◐ collector + `dnaFromObservation` | — | Ours |
| Screenshot-only analysis | ✗ | — | Ours (vision model, marked *inferred*) |
| Design DNA with provenance | ◐ `@ux-sting/design-dna` | — (no reference has it) | Ours — core differentiator |
| Remix / style transfer | ◐ `remixDna` | — | Ours |
| Page generation from DNA | ◐ standalone HTML | Superdesign (HTML mockups) | Ours; React/Next adapters next |
| Multi-page sites, routing, content models | ✗ | — | Ours (`WEBSITE_GENERATOR_ARCHITECTURE.md`) |
| Browser QA: screenshots 375/768/1440, axe, contrast, overflow, margins, orphans, empty stretches, title on first screen, console, ranked top-3 fixes | ✔ `@ux-sting/qa`, `ux-sting qa`, `ux-sting-qa` skill (QA → fix top 3 → re-run ×3) | taste-skill (browser self-critique), playwright-cli (token-efficient agent conventions) | Ours; ideas only |
| Visual diff + DNA fidelity + fix loop | ◐ | — | Ours |
| Lighthouse / Core Web Vitals measurement | ◐ LCP + CLS lab basics in `@ux-sting/qa`; no Lighthouse yet | Claude SEO (PSI/CrUX APIs) | Ours (local Lighthouse, documented conditions) |
| Structured data builders + validation | ✔ `@ux-sting/seo-schema` | Claude SEO (checklists) | Ours, TypeScript |
| Metadata / canonical / hreflang / sitemap helpers | ◐ six copy-pasted `lib/seo.ts` in examples | Claude SEO | `seo-core`, `seo-nextjs` |
| Crawl-based SEO audit | ✗ | Claude SEO | `seo-audit` |
| CLI (`add`, `diff`, `list`, `init`…) | ✔ components | Hyperiux CLI | Extend with `dna`, `seo` commands |
| npm release pipeline (Changesets, provenance, CI dry-run) | ✔ | — | Ours |
| MCP tools | ✗ | Better Design, Hyperiux, Claude SEO | `ux-sting-mcp` |
| Reproducible benchmark | ✗ | — (Superdesign blog compares tools informally) | `BENCHMARK_PLAN.md` |

## Where UX-STING can lead (measurably)
1. **Verification**, not generation: every reference generates or advises; none renders the result, measures it and corrects it. The prototype loop already does this for contrast, overflow, cramped text and token fidelity.
2. **Provenance**: DNA values say whether they were seen, inferred or chosen — reconstruction claims become auditable.
3. **Production components underneath**: output can target ~100 tested components instead of ad-hoc markup.
4. **Licence hygiene**: nothing restricted is bundled; every adapted idea is credited.

## Where UX-STING is behind
- Visual range of effects (Canvas UI, Hyperiux) — intentionally, for licence and performance reasons.
- Breadth of SEO integrations (Search Console, PageSpeed, backlink APIs) — Claude SEO is far ahead.
- Screenshot understanding and LLM-driven exploration — no vision step exists yet.
- Interactive component reconstruction (forms, tabs, maps) — detected only as sections today.

No claim of superiority is made until `BENCHMARK_PLAN.md` has been run.
