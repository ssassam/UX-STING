# Reconstruction of http://localhost:4100/

Authorized: yes (text outline copied, imagery replaced by placeholders).
Reference DNA issues: contrast at color.muted; scale-order at typography.scale.steps.
Fidelity compares the reference DNA with DNA measured back from the generated page. Pixel mismatch compares 160px-wide downscaled full-page screenshots; it is expected to stay high when imagery and text differ.

## Reference → generated

| Iteration | Fidelity | Pixel mismatch | SSIM | a11y violations (1280/390) | Overflow px (1280/390) | Cramped text (1280/390) | Fixes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 87/100 | 10.0% | 0.533 | 0 / 0 | 0 / 0 | 0 / 0 | 3 |
| 1 | 90/100 | 9.3% | 0.546 | 0 / 0 | 0 / 0 | 0 / 0 | 0 |

Fixes after iteration 0:
- **fidelity** `typography.scale.steps.body`: 18 → 16 — Rendered body is 20px; the reference is 18px.
- **fidelity** `layout.sections.3.paddingBlock`: undefined → 144 — Section s4-content renders 298px tall; the reference is 480px.
- **fidelity** `layout.sections.5.paddingBlock`: undefined → 144 — Section s6-content renders 222px tall; the reference is 510px.

Final fidelity by category: color 96, typography 94, layout 100, sections 64, shape 100.

Largest remaining differences:
- `layout.sections[4]`: reference features/grid/1047px, generated content/stack/219px
- `layout.sections[7]`: reference list/index/300px, generated content/stack/176px
- `typography.scale.steps.small`: reference 14, generated 16
- `layout.sections[5]`: reference content/split/510px, generated content/stack/396px
- `layout.sections[1]`: reference hero/split/699px, generated hero/stack/631px
- `layout.sections[6]`: reference gallery/grid/342px, generated features/grid/336px
- `color.surface`: reference #171c24, generated #1d2229
- `color.muted`: reference #79828c, generated #808892
