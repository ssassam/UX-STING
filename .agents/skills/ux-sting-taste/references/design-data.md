# Design data: category conventions, styles, palettes, fonts

`scripts/design_data.py` searches local CSV data (Python 3 standard library, no network). It tells you **what a category usually looks like** and **what fails in it**. Use that to make deliberate choices, never as the design itself.

| Domain | Rows | File | What it gives |
| --- | --- | --- | --- |
| `industry` | 192 | `data/industries.csv` | Product type → landing pattern, primary/secondary styles, color + type mood, effects, decision rules, **anti-patterns**, RTL level |
| `style` | 80 | `data/styles.csv` | 51 active + 29 supplemental styles: best/avoid for, effects, light/dark support, a11y risk, performance cost, CSS variables, checklist |
| `palette` | 192 | `data/palettes.csv` | One 16-token palette per industry (primary…ring, with on-colors) |
| `font` | 74 | `data/font-pairings.csv` | Heading + body pairings with mood, best for, Google Fonts URL |
| `landing` | 34 | `data/landing-patterns.csv` | Section order, CTA placement, color strategy, conversion notes |
| `chart` | 25 | `data/charts.csv` | Data type → chart, when not to, volume thresholds, a11y fallback |
| `ux` | 120 | `data/ux-guidelines.csv` | Web UX do/don't with code, by severity |
| `app` | 32 | `data/app-interface.csv` | Mobile/app interface rules (iOS, Android, React Native) |
| `motion` | 17 | `data/motion.csv` | Motion recipes by intensity: duration, easing, GSAP snippet (`@ux-sting/motion/gsap`) |
| `icon` | 105 | `data/icon-roles.csv` | Icon meaning per role and context; draw from `@ux-sting/icons`, the names are concepts |
| `react-perf` | 44 | `data/react-performance.csv` | React/Next.js performance rules by severity |
| stacks | 22 | `../ux-sting-design-agent/references/stacks/` | Per-stack guidelines (Vue, Svelte, Astro, Flutter, SwiftUI, Compose, Angular, Laravel, WPF…) |

## Commands

```bash
S=.claude/skills/ux-sting-taste/scripts/design_data.py     # or wherever the skill is installed

python3 $S system "artisan bakery in Fes" --rtl            # category baseline as markdown
python3 $S system "fintech app" --mode dark --persist --page dashboard
                                                            # → .ux-sting/taste/design-system/MASTER.md + pages/dashboard.md
python3 $S search "glass" --domain style -n 5              # one domain
python3 $S search "time series comparison"                 # every domain, top 2 each
python3 $S stack svelte "forms"                            # stack guidelines
python3 $S domains                                         # row counts
```

`system` prints: the matched industry and two close ones; the category convention; anti-patterns; the resolved styles, each with the nearest UX-STING theme preset; the palette with WCAG contrast for every on-pair; a ready `createTheme(...)` snippet (nearest token scale + light overrides + fonts); three font pairings; and the landing pattern. `--rtl` drops styles with RTL caveats. `--mode light|dark` drops styles not recommended for that mode. `--persist` never overwrites an existing MASTER.md unless you pass `--force`. A `pages/<page>.md` file holds only that page's deviations.

## How taste uses it

1. **Step 2 → 3.** Run `system "<what the client is>"` once and save the output as `.ux-sting/taste/convention.md`. Read the anti-patterns and decision rules first: they apply to every direction (e.g. bakery: real food photos, hours never hidden).
2. **Deal the three directions against it.** At most **one** direction may sit close to the convention (the safe card). The other two must break at least two of style, palette and type **on purpose**, with the reason taken from `unique.md`. Write "convention: follows / breaks X because Y" on each direction.
3. **Palette.** Treat the palette as the category's color expectation, not the brand's. If a direction keeps it, shift at least the accent toward something from `unique.md` (a material, a place, a sign) and re-check contrast. Any row marked ⚠️ must be fixed before use.
4. **Type.** The three pairings are starting points. Load them with `next/font/google`, never a render-blocking `<link>`.
5. **Style cards.** Check the style's `avoid_for`, accessibility risk and performance cost before you commit. Any `risk:high` style needs the reduced-motion and contrast fallbacks from its checklist.
6. **Existing brand wins.** If `ux-sting extract` / `theme import` gave you tokens, use the data only for anti-patterns, landing order and the chart, UX and motion rules.

Other skills use the same data: `search --domain chart` when picking a chart, `ux` / `app` / `react-perf` during `ux-sting-review`, `motion` for the motion budget, and `stack <name>` in `ux-sting-design-agent` for non-React builds.

Data adapted from the MIT-licensed [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (commit `6ae86f6`, 2026-11-10): columns trimmed, the three per-industry tables merged into one, deprecated styles and Phosphor import code removed.
