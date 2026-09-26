# Accessibility

Target: **WCAG 2.2 AA**. Accessibility is part of each component's contract, verified by automated tests, and documented per component ("Accessibility" and "Keyboard" sections).

## What the system guarantees

- **Semantic HTML first.** Buttons are `<button>`, links are `<a>`, tables are `<table>`, alerts use roles only when needed.
- **Keyboard.** Every interactive component is operable without a pointer, following the WAI-ARIA Authoring Practices (menus, tabs, listboxes, grids, trees, dialogs, sliders, spinbuttons).
- **Focus.** Visible focus ring on `:focus-visible` using the `ring` token (3:1 against the background); dialogs trap and restore focus; sticky UI never hides focus.
- **Names.** Icon-only controls require `aria-label` (enforced by types for `IconButton`); decorative icons are `aria-hidden`.
- **Forms.** Visible labels, `aria-describedby` for help and errors, `aria-invalid`, required indicators, validate-on-blur, focusable error summary after failed submit.
- **Live regions.** Toasts (polite; errors assertive), command/search results, upload lists and validation errors are announced without moving focus.
- **Contrast.** Token pairs are tested: text ≥ 4.5:1, UI boundaries and focus ≥ 3:1, high-contrast theme ≥ 7:1.
- **Motion.** Durations collapse to 0 under `prefers-reduced-motion`; carousels stop autoplay; shimmer stops.
- **Target size.** Minimum 24×24px; 44×44px hit areas on touch devices via `.ui-hit-area`.
- **Color is never the only signal.** Status uses icon + text; trends use arrows + text; ratings have text alternatives.
- **Dragging is optional** (WCAG 2.5.7): Resizable handles, Drawer, Dropzone and Slider all have keyboard/click alternatives.
- **Authentication** (WCAG 3.3.8): PasswordInput never blocks paste or password managers; OTPInput supports autofill.

## Testing

- Every interactive component has interaction and keyboard tests (Testing Library + user-event).
- `expectNoA11yViolations()` runs axe-core in component tests.
- Token and theme contrast tests run for every preset in light and dark mode.
- `pnpm ux-audit` statically rejects anti-patterns (raw hex colors in components, `100vh`, disabled zoom, emoji icons, outline removal without a replacement).

## Your responsibilities

Components can't know your content. You still need to: write meaningful `alt` text, keep a logical heading outline (`Heading level`), label regions and icon buttons, provide captions for video, and test real flows with a screen reader.
