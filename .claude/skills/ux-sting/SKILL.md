---
name: ux-sting
description: "Build, review or extend interfaces with the UX-STING React system (@ux-sting/react) — choosing components, applying tokens and themes, and running the UX quality checks. Use when creating pages, components or examples in an app, fixing accessibility/responsive/RTL issues, or wiring UX-STING into a Next.js or React project. Adapted from the MIT-licensed UI/UX Pro Max skill (see THIRD_PARTY_NOTICES.md)."
---

# UX-STING — building and reviewing UI

Use this skill whenever a task changes how your app **looks, feels, moves, or is interacted with**. Skip it for pure build tooling or non-visual scripts. Components, tokens and themes come from the installed `@ux-sting/*` packages, not from a local source folder.

## 1. Pick components, don't hand-roll

| Need | Use | Not |
| --- | --- | --- |
| Focused task, needs attention | `Dialog` | Sheet for primary flows |
| Destructive confirmation | `AlertDialog` + undo `toast()` | `window.confirm` |
| Contextual side panel / mobile filters | `Sheet`, `FilterPanel` | Dialog |
| Mobile bottom panel | `Drawer` | fixed-position divs |
| One of ≤ 6 | `RadioGroup` / `RadioCard` | Select |
| One of many / searchable | `Select` → `Combobox` | custom dropdown |
| Many of many | `CheckboxGroup` / `MultiSelect` | chips-only UI |
| Free text + suggestions | `Autocomplete` | Combobox |
| Top-level nav: phone / tablet / desktop | `MobileNavigation` (≤5) / `NavigationRail` / `SidebarProvider` | mixing patterns at one level |
| Tabular data | `DataTable` (client) / `Table` (server) | div grids |
| Brief feedback | `toast()` | alerts for transient info |
| Inline/section message | `Alert` | toast for actionable errors |
| Loading > 1s, content-shaped | `Skeleton` | spinner-only screens |
| No data / error | `EmptyState` / `ErrorState` with an action | blank areas |
| Hero headline / status label motion | `TextEffect`, `RotatingText`, `Typewriter`, `TextShimmer` | hand-written keyframes |
| UI state transitions (resize, reorder, tab indicator, accordion, toast, skeleton → content, number change) | `@ux-sting/motion` CSS catalog + `reorder` / `animateSize` / `trackIndicator` / `popNumber` | ad-hoc keyframes, animating layout by hand |
| Scroll storytelling, pinned scrub, split headings, Flip layouts | `@ux-sting/motion/gsap` (gsap optional peer) | raw `useEffect` + gsap without scope or cleanup |
| Scroll entrances, counters | `Reveal`, `AnimatedNumber`, `ScrollProgress` | animation libraries for fades |
| Logo rows, hover delight, before/after | `Marquee`, `Spotlight`, `Tilt`, `ImageComparison` | CSS loops with no pause |
| Texture behind sections | `MeshGradient`, `DotPattern`, `GridPattern`, `Grain`, `ProgressiveBlur` | background images, raw-color gradients |

Import per component: `import { Button } from "@ux-sting/react/button"`.

## 2. Rules by priority (fix in this order)

| # | Category | Must have | Avoid |
| --- | --- | --- | --- |
| 1 | Accessibility | Visible labels (`Field`), `aria-label` on icon buttons, logical heading levels (`Heading level`), focus visible, color + icon/text | `outline-none` without replacement, placeholder-as-label |
| 2 | Touch & interaction | 44px targets on touch (`.ui-hit-area`), loading states (`Button loading`, `useFormState`) | hover-only actions, tiny close buttons |
| 3 | Performance | Server components by default, `Image`/`AspectRatio` for media, skeletons | `"use client"` on static components, layout shift |
| 4 | Style | Semantic tokens only (`bg-primary`, `text-muted-foreground`), one icon family, one primary action per view | raw hex, emoji icons, random shadows |
| 5 | Layout & responsive | Responsive props (`columns={{ base: 1, md: 3 }}`), `dvh`, safe areas, no horizontal scroll at 375px | fixed px widths, `100vh` |
| 6 | Typography & color | 16px body/inputs on mobile, `tabular-nums` for numbers, `text-balance` headings | gray-on-gray text |
| 7 | Motion | Motion tokens; exits faster than entries; transform/opacity only; reduced motion; expressive components within the motion budget (UX-STING docs, `docs/motion.md`) | animating width/height, motion on every element |
| 8 | Forms | `Form` + `Field` + `FormErrorSummary`, validate on blur, semantic `type`/`autoComplete` | errors only at top, keystroke validation |
| 9 | Navigation | `aria-current`, breadcrumbs for 3+ levels, `SkipLink`, deep-linkable pagination (`getHref`) | modals for navigation |
| 10 | Data | Sortable headers with `aria-sort`, locale formatting, trend arrows + text | color-only status |

Full rule set with enforcement points: `docs/ux-quality.md` in the UX-STING docs (github.com/ssassam/UX-STING).

## 3. Tokens, themes, RTL

- Never hard-code colors or dark-mode styles; use semantic tokens. Dark/high-contrast come for free.
- Use logical utilities: `ms-* me-* ps-* pe-* start-* end-* text-start border-s`. Rotate directional icons with `rtl:rotate-180`.
- User-facing strings in reusable components come from `useMessages()` (en/fr/ar) or props.
- Numbers, dates, currency: `Intl` via `Price`, `Currency`, `formatDate`, `formatCurrency`.

## 4. Verify before delivering

Run the automated checks:

```bash
npm run build                              # your app's build (pnpm build / yarn build)
npx tsc --noEmit                           # typecheck
npm test                                   # your tests; add jest-axe or @axe-core/react for a11y
npx ux-sting qa http://localhost:3000 --viewports 375,768,1440 --out .ux-sting/qa
# ^ axe (incl. contrast) + layout overflow + console + LCP/CLS, ranked top-3 fixes, light/dark
```

Start your dev server first (`npm run dev`). `npx ux-sting qa` needs `@ux-sting/qa` and one-time `npx playwright-core install chromium`.

Then walk the pre-delivery checklist:

- [ ] 375px width and landscape: no horizontal scroll, nothing hidden behind fixed bars
- [ ] Keyboard-only: every action reachable, focus visible, never obscured; Escape closes overlays
- [ ] Screen reader: names, roles, headings, landmarks, live updates (toasts, results, errors)
- [ ] Dark mode and high contrast checked separately (not inferred from light)
- [ ] Reduced motion: nothing essential depends on animation; autoplay stops
- [ ] Touch: targets ≥ 44px, no hover-only affordances, drag has alternatives
- [ ] Forms: visible labels, specific errors with recovery, error summary focus after failed submit
- [ ] Icons from `@ux-sting/icons` only; decorative icons hidden; icon buttons named
- [ ] RTL (`locale="ar"`) layout and keyboard mirroring checked
- [ ] Only semantic tokens — no raw hex, `100vh`, or physical `ml-/pl-/left-` utilities

## 5. Related skills

- **ux-sting-taste** — pick a deliberate design direction (theme preset, type, layout, motion budget) for landing pages and marketing UI.
- **ux-sting-review** — severity-ranked review with evidence; fix critical and serious findings before handoff.
- **ux-sting-explore** — build three different directions side by side and converge on one.

## 6. Own the code

Import components from the package (`@ux-sting/react/<name>`). To bring source into your project and edit it directly — a bespoke component or a behavior you must fork — run `npx ux-sting init` once, then `npx ux-sting add <name…>`. This copies the component source with a lockfile that protects your edits (`npx ux-sting diff` flags upstream changes; `--overwrite` re-copies). Contribute a genuinely new, general component back to the UX-STING repo (`CONTRIBUTING.md`).
