# UX quality rules

unified-ui bakes a prioritized UX rulebook into its tokens, components and CI. The priority order and many rules are adapted from the MIT-licensed [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (see `THIRD_PARTY_NOTICES.md`), mapped to how this system enforces them.

## Priorities

| # | Category | Impact | Enforced by |
| --- | --- | --- | --- |
| 1 | Accessibility | Critical | Semantic components, axe tests, contrast tests, focus ring token |
| 2 | Touch & interaction | Critical | `--ui-target-touch` hit areas, `touch-action: manipulation`, loading states on Button/Form, press feedback |
| 3 | Performance | High | Per-component entry points, server components, reserved media space (Image/AspectRatio), skeletons |
| 4 | Style consistency | High | One icon family and stroke token, semantic tokens only, elevation scale |
| 5 | Layout & responsive | High | Mobile-first responsive props, `dvh` units, safe-area padding, no fixed widths |
| 6 | Typography & color | Medium | 16px mobile inputs, 1.5+ line height, tabular numbers, semantic color tokens |
| 7 | Animation | Medium | Motion tokens, exit ≈ 65% of enter, transform/opacity only, reduced motion |
| 8 | Forms & feedback | Medium | Field/Form system, error summary, inline errors, toasts with undo |
| 9 | Navigation | High | `aria-current`, MobileNavigation ≤ 5 items, breadcrumbs, skip link |
| 10 | Charts & data | Low | Accessible tables, text + icon trends, locale formatting |

## Rules and where they live

### Accessibility
- Contrast 4.5:1 text / 3:1 UI — `tokens.test.ts`, `themes.test.ts`.
- Visible focus rings — `focusRing` utility; never `outline: none` without a replacement (`ux-audit`).
- Icon-only buttons need names — `IconButtonProps["aria-label"]` is required.
- Skip links — `SkipLink` component; `SidebarInset` renders `<main id="main">`.
- Heading hierarchy — `Heading` separates `level` from `size`; `AlertTitle` is not a heading by default.
- Focus not obscured — sticky headers use `scroll-padding-top`; toasts never take focus.
- Carousels pause — `Carousel` stops on hover/focus/reduced motion and renders `CarouselPlayToggle`.

### Touch & interaction
- 44×44 touch targets — `.ui-hit-area` on IconButton, Checkbox, Radio, Switch, close buttons, steppers, chips' remove buttons.
- ≥ 8px spacing between targets — component gaps use the spacing scale.
- Loading feedback — `Button loading` disables and announces; `Form` exposes `useFormState().submitting`.
- No hover-only interactions — tooltips also open on focus; hover cards are enhancements only.

### Layout & responsive
- Mobile-first breakpoints (`sm 640 / md 768 / lg 1024 / xl 1280`), responsive props compiled to CSS variables.
- `min-h-dvh`/`max-h-[90dvh]` instead of `100vh` (`ux-audit` rejects `100vh`).
- Fixed bars reserve safe areas: MobileNavigation, bottom Sheet, Drawer and Toaster use `env(safe-area-inset-bottom)`.
- No horizontal page scroll: tables scroll inside a labelled region or stack on mobile.

### Typography & color
- Body 16px, inputs 16px on mobile (avoids iOS zoom), line height ≥ 1.5.
- `tabular-nums` for prices, stats, tables, timers.
- `text-balance` on headings; `ui-wrap-anywhere` for long URLs/IDs.
- No raw hex colors in components (`ux-audit`).

### Animation
- Shared duration/easing tokens; exits use `--ui-duration-exit-*` (≈ 65% of enter).
- Animate `transform`/`opacity` only (height uses Radix measured variables for collapse).
- All motion collapses under `prefers-reduced-motion`.

### Forms & feedback
- Visible labels (`Field`), helper text, required indicators.
- Validate on blur, not on keystroke; errors below fields linked via `aria-describedby`.
- After a failed submit, focus the `FormErrorSummary` (links to each field) or the first invalid field.
- Semantic input types and `autoComplete` in examples and `LeadForm`.
- Destructive actions confirm with `AlertDialog`; offer "Undo" toasts.
- Toasts auto-dismiss (5s default), pause on hover/focus, are polite, and never steal focus.

### Navigation
- Current location highlighted with `aria-current`.
- Bottom navigation limited to 5 items (dev warning), always icon + label.
- Adaptive navigation: MobileNavigation (phones) → NavigationRail (tablets) → Sidebar (desktop).
- Breadcrumbs for 3+ levels; predictable back via real links in Pagination.

### Charts & data
- DataTable sorting exposes `aria-sort`; tables are real tables.
- Trends use arrows + text; `Stat` knows whether "up" is good.
- Locale-aware number/date/currency formatting everywhere.

## Pre-delivery checklist

Use this before shipping a screen built with unified-ui:

- [ ] Tested at 375px width and in landscape; no horizontal scroll
- [ ] Keyboard-only pass: every action reachable, focus always visible and never hidden
- [ ] Screen reader pass on the main flow (names, headings, landmarks, live updates)
- [ ] Dark mode and high-contrast checked independently
- [ ] Reduced motion enabled — nothing essential depends on animation
- [ ] Touch targets ≥ 44px on mobile; no hover-only affordances
- [ ] Forms: visible labels, helpful errors with recovery, error summary on submit
- [ ] Icons from one family; no emoji as icons; decorative icons hidden
- [ ] Only semantic tokens (no raw colors) — `pnpm ux-audit` passes
- [ ] RTL (Arabic) layout checked for pages that will be translated
