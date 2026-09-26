---
name: unified-ui
description: "Build, review or extend interfaces with the unified-ui React system in this repository — choosing components, applying tokens/themes, and running the UX quality checks. Use when creating pages, components, examples or docs demos, fixing accessibility/responsive/RTL issues, or adding a new component to packages/react. Adapted from the MIT-licensed UI/UX Pro Max skill (see THIRD_PARTY_NOTICES.md)."
---

# unified-ui — building and reviewing UI

Use this skill whenever a task changes how something in this repo **looks, feels, moves, or is interacted with**. Skip it for pure build tooling or non-visual scripts.

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

Import per component: `import { Button } from "@unified-ui/react/button"`.

## 2. Rules by priority (fix in this order)

| # | Category | Must have | Avoid |
| --- | --- | --- | --- |
| 1 | Accessibility | Visible labels (`Field`), `aria-label` on icon buttons, logical heading levels (`Heading level`), focus visible, color + icon/text | `outline-none` without replacement, placeholder-as-label |
| 2 | Touch & interaction | 44px targets on touch (`.ui-hit-area`), loading states (`Button loading`, `useFormState`) | hover-only actions, tiny close buttons |
| 3 | Performance | Server components by default, `Image`/`AspectRatio` for media, skeletons | `"use client"` on static components, layout shift |
| 4 | Style | Semantic tokens only (`bg-primary`, `text-muted-foreground`), one icon family, one primary action per view | raw hex, emoji icons, random shadows |
| 5 | Layout & responsive | Responsive props (`columns={{ base: 1, md: 3 }}`), `dvh`, safe areas, no horizontal scroll at 375px | fixed px widths, `100vh` |
| 6 | Typography & color | 16px body/inputs on mobile, `tabular-nums` for numbers, `text-balance` headings | gray-on-gray text |
| 7 | Motion | Motion tokens; exits faster than entries; transform/opacity only; reduced motion | animating width/height, decorative motion |
| 8 | Forms | `Form` + `Field` + `FormErrorSummary`, validate on blur, semantic `type`/`autoComplete` | errors only at top, keystroke validation |
| 9 | Navigation | `aria-current`, breadcrumbs for 3+ levels, `SkipLink`, deep-linkable pagination (`getHref`) | modals for navigation |
| 10 | Data | Sortable headers with `aria-sort`, locale formatting, trend arrows + text | color-only status |

Full rule set with enforcement points: `docs/ux-quality.md`.

## 3. Tokens, themes, RTL

- Never hard-code colors or dark-mode styles; use semantic tokens. Dark/high-contrast come for free.
- Use logical utilities: `ms-* me-* ps-* pe-* start-* end-* text-start border-s`. Rotate directional icons with `rtl:rotate-180`.
- User-facing strings in reusable components come from `useMessages()` (en/fr/ar) or props.
- Numbers, dates, currency: `Intl` via `Price`, `Currency`, `formatDate`, `formatCurrency`.

## 4. Verify before delivering

Run the automated checks:

```bash
pnpm typecheck && pnpm lint && pnpm test
pnpm ux-audit                                  # static UX rules
pnpm --filter @unified-ui/docs build && (cd apps/docs && npx next start -p 3100 &)
node scripts/browser-audit.ts http://localhost:3100 /components/<name>   # axe incl. contrast + overflow at 390/1280px, light/dark
```

Then walk the pre-delivery checklist:

- [ ] 375px width and landscape: no horizontal scroll, nothing hidden behind fixed bars
- [ ] Keyboard-only: every action reachable, focus visible, never obscured; Escape closes overlays
- [ ] Screen reader: names, roles, headings, landmarks, live updates (toasts, results, errors)
- [ ] Dark mode and high contrast checked separately (not inferred from light)
- [ ] Reduced motion: nothing essential depends on animation; autoplay stops
- [ ] Touch: targets ≥ 44px, no hover-only affordances, drag has alternatives
- [ ] Forms: visible labels, specific errors with recovery, error summary focus after failed submit
- [ ] Icons from `@unified-ui/icons` only; decorative icons hidden; icon buttons named
- [ ] RTL (`locale="ar"`) layout and keyboard mirroring checked
- [ ] Only semantic tokens — `pnpm ux-audit` passes

## 5. Adding a component

Follow `CONTRIBUTING.md` → "Component checklist": API conventions (`docs/api-consistency.md`), tests with `expectNoA11yViolations`, a story, a docs demo (`apps/docs/demos/<name>.tsx`), metadata in `registry/components.ts`, then `pnpm readmes && pnpm registry`.
