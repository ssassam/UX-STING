# Benchmark plan (Engine 12)

Purpose: compare UX-STING workflows with alternative tools on the same tasks, with the same inputs, budgets and criteria — and publish the raw results, including where UX-STING loses. No superiority claim is made before this has been run.

## Contenders
- UX-STING Universal (prototype pipeline + skills, in Claude Code).
- A coding agent with no design skills (baseline).
- A coding agent with community design skills (design-taste, UI UX Pro Max, Better Design MCP where available).
- Hosted generators the team has legitimate access to (e.g. Superdesign web app), used under their terms.

## Tasks
| ID | Type | Input |
| --- | --- | --- |
| R1–R3 | Reconstruction | Three authorized UX-STING demo sites (Ember, Maison Nord, Wayfare) served locally |
| O1–O4 | Original | Briefs: Marrakech salon (fr), B2B logistics SaaS (en), community library (ar, RTL), local bakery with online orders (fr) |
| M1–M2 | Remix | Ember's typography + Maison Nord's palette applied to the bakery brief; Wayfare rhythm applied to the library brief |
| P1 | Multi-page | Bakery: home, products, product detail, about, contact (fr/en) |

## Conditions
Same model and version where an agent is involved; same wall-clock budget (30 min per task) and token budget; same viewport set (390/768/1280); Chromium version and hardware recorded; three runs per task; production builds only.

## Metrics
| Criterion | Measure | Kind |
| --- | --- | --- |
| Reference fidelity | `compareDna` score; pixel mismatch and SSIM at 1280/390 | deterministic |
| Accessibility | axe critical+serious count; Lighthouse a11y | deterministic |
| Responsiveness | overflow px, cramped text count, layout at 390/768 | deterministic |
| Performance | Lighthouse performance (mobile, median of 3); JS/CSS bytes | deterministic |
| SEO | Lighthouse SEO; `validateJsonLd` errors; metadata/canonical/hreflang checks | deterministic |
| Maintainability | Lines of code, duplicated blocks, use of tokens vs raw values (`ux-audit`), component reuse | deterministic |
| Time & cost | Wall-clock to first acceptable result; tokens/API cost | deterministic |
| Visual quality & originality | Blind panel (≥ 5 designers) rating 1–5 on brief fit, craft, distinctiveness; "looks AI-generated?" yes/no | judgment, blinded |
| Manual correction | Minutes an engineer needs to reach the quality gates | measured |

## Protocol
1. Freeze briefs, references and scripts in `benchmarks/` with a commit hash.
2. Run each contender; store outputs, logs, screenshots and metric JSON.
3. Panel rates screenshots without knowing the source.
4. Publish a table per task with medians and spreads; link raw data.

## Fairness rules
- No tuning UX-STING on the benchmark briefs between runs; new briefs for each benchmark round.
- Tools that cannot accept an input type (e.g. no URL input) are marked N/A, not scored zero.
