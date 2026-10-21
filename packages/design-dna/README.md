# @ux-sting/design-dna

**Prototype.** Design DNA is a framework-independent, editable description of a design identity: measured colors, type scale, spacing, container, section geometry and composition. Every value records whether it was **observed** in a rendered page, **inferred** from observations, chosen from a **brief**, taken in a **remix**, or **edited** by a person or the improvement loop.

This package is the deterministic core of UX-STING Universal (see `docs/UNIVERSAL_VISION.md`). It has no dependencies and does no I/O; the browser pipeline lives in `scripts/design-dna/`.

| Module | Does |
| --- | --- |
| `dnaFromObservation` | Turns computed-style and geometry measurements of a page into DNA, with provenance |
| `planDirections`, `scoreDirection`, `dnaFromDirection` | Plans original directions from a brief along type × palette × composition axes, scores them, keeps ones that differ on ≥ 2 axes |
| `generatePage` | Renders semantic, responsive HTML whose layout comes from each section's composition |
| `dnaToCss`, `dnaToDtcg`, `dnaToUxStingTheme` | Exports tokens as CSS variables (incl. UX-STING `--ui-*`), W3C DTCG JSON, or a UX-STING theme config |
| `compareDna`, `compareImages` | Token-level fidelity score and pixel/SSIM metrics on screenshots |
| `proposeFixes`, `applyFixes` | Deterministic corrections: accessibility first, then layout, then fidelity |
| `remixDna` | Style transfer: take facets (color, typography, …) from other DNAs, keep your sections |
| `validateDna` | Contrast, readability, scale order and layout checks |
| `checkTargetUrl`, `isPrivateAddress` | SSRF guards for anything that loads a user-supplied URL |

## Run the pipeline

```bash
pnpm --filter @ux-sting/design-dna build
# Original design from a brief (three directions, each rendered, audited and improved):
pnpm dna original scripts/design-dna/briefs/salon-noor.json --out design-dna-output/noor
# Reconstruction of a site you own or may reproduce (here, a local UX-STING example):
pnpm --filter @ux-sting/example-ember build && (cd examples/ember && npx next start -p 4100 &)
pnpm dna reconstruct http://localhost:4100/ --authorized --allow-host localhost:4100 --out design-dna-output/ember
```

Set `CHROMIUM_PATH` if Playwright's bundled browser is not installed. Each run writes `dna.json`, generated `index.html` per iteration, screenshots at 1280 and 390 px, `report.md` and `report.html`.

## Limits (by design, for now)

- Screenshots and computed styles never reveal source code; the analyzer does not claim to know it.
- Without `--authorized`, no text is copied: content becomes labelled placeholders. Imagery and logos are never copied; media becomes token-colored placeholders.
- Interactive components (forms, tabs, maps, accordions) are detected only as sections; mapping them to UX-STING components is the next phase.
- The output is a standalone HTML page. React/Next.js adapters are on the roadmap (`docs/IMPLEMENTATION_ROADMAP.md`).
