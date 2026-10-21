# Original design: Atelier Noor

Directions were planned from the brief along three independent axes (type, palette, composition) and scored against it:
1. **editorial-serif+paper-ink+clear-conversion** (94/100). Type: Serif display over a neutral sans — matches crafted, warm, calm. Palette: Warm paper, ink text, one strong accent — matches warm, crafted, calm. Composition: Clear split hero and scannable grids — matches bookings, trust. Composition keeps the primary action prominent for a conversion goal.
2. **refined-serif+paper-ink+editorial-asymmetric** (88/100). Type: Light classical serif, refined — matches beauty, salon, refined. Palette: Warm paper, ink text, one strong accent — matches warm, crafted, calm. Composition: Asymmetric editorial grid with indexed lists — matches crafted, refined.
3. **refined-serif+tinted-calm+clear-conversion** (88/100). Type: Light classical serif, refined — matches beauty, salon, refined. Palette: Pale brand tint with deep brand-colored text — matches beauty, calm. Composition: Clear split hero and scannable grids — matches bookings, trust. Composition keeps the primary action prominent for a conversion goal.

## Direction 1: editorial-serif+paper-ink+clear-conversion — score 94/100

| Iteration | Fidelity | Pixel mismatch | SSIM | a11y violations (1280/390) | Overflow px (1280/390) | Cramped text (1280/390) | Fixes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | — | — | — | 0 / 0 | 0 / 0 | 0 / 1 | 1 |
| 1 | — | — | — | 0 / 0 | 0 / 0 | 0 / 0 | 0 |

Fixes after iteration 0:
- **layout** `typography.scale.mobileDisplay`: 69 → 41 — The h1 wraps to a few characters per line at 390px (69px type).

## Direction 2: refined-serif+paper-ink+editorial-asymmetric — score 88/100

| Iteration | Fidelity | Pixel mismatch | SSIM | a11y violations (1280/390) | Overflow px (1280/390) | Cramped text (1280/390) | Fixes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | — | — | — | 0 / 0 | 0 / 0 | 0 / 1 | 1 |
| 1 | — | — | — | 0 / 0 | 0 / 0 | 0 / 0 | 0 |

Fixes after iteration 0:
- **layout** `typography.scale.mobileDisplay`: 69 → 41 — The h1 wraps to a few characters per line at 390px (69px type).

## Direction 3: refined-serif+tinted-calm+clear-conversion — score 88/100

| Iteration | Fidelity | Pixel mismatch | SSIM | a11y violations (1280/390) | Overflow px (1280/390) | Cramped text (1280/390) | Fixes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | — | — | — | 0 / 0 | 0 / 0 | 0 / 1 | 1 |
| 1 | — | — | — | 0 / 0 | 0 / 0 | 0 / 0 | 0 |

Fixes after iteration 0:
- **layout** `typography.scale.mobileDisplay`: 69 → 41 — The h1 wraps to a few characters per line at 390px (69px type).
