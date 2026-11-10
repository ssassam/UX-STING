# @ux-sting/react

## 0.10.0

### Minor Changes

- f27c97e: Eject and update:

  - `npx ux-sting eject <component…>`: for apps that use the `@ux-sting/react` package. It copies only the component's own folder into the project, points its other imports at the package (`@ux-sting/react/<sibling>`, `/provider`, `/internal`) so React context stays shared, and rewrites the app's imports to the local copy (splitting named root imports). Supports `--dry-run`, `--overwrite` and `--no-codemod`.
  - `npx ux-sting update [component…]`: re-applies the registry to copied and ejected components. Unedited files are updated; edited files are kept and the new version is written to `<file>.upstream`. Exits 1 when there are conflicts.
  - `@ux-sting/react/internal`: new entry point exporting the shared `lib/*` building blocks (field wiring, overlay and menu parts, control styles) that ejected components import.

- 953a738: DataTable / DataGrid become a full data grid:

  - **Multi-column sort**: `multiSort` + Shift+click, controlled via `sortBy` / `defaultSortBy` / `onSortByChange` (the `sort` API still works). Sort priority is shown and announced; `aria-sort` stays on the primary column.
  - **Virtualization**: `virtual={{ rowHeight, height }}` renders only visible rows (10k+), with `aria-rowcount` / `aria-rowindex`, and grid navigation scrolls the target into view.
  - **Resizable columns**: `resizableColumns` adds focusable separators (drag, Arrow keys, Shift ×5, Home/End, RTL-aware); per-column `width` / `minWidth` / `maxWidth` / `resizable`, plus `onColumnWidthsChange`.
  - **Expandable rows**: `renderRowDetail` plus `expandedIds` / `defaultExpandedIds` / `onExpandedIdsChange`.
  - **Range selection**: Shift+click a row checkbox to select from the last clicked row.
  - **Grid keyboard model**: one Tab stop (roving tabindex), Ctrl+Home/End, PageUp/PageDown, and no arrow-key hijacking while typing in cell inputs.
  - Fixes: `getRowId` now receives the index in `data` (it was the index within the page); `aria-rowcount` includes the header row.
  - Table: `containerProps` / `containerRef`; TableHead `adornment` slot, and `onSort` receives the click event.
  - New messages: `sortPriority`, `resizeColumn` (en/fr/ar).

### Patch Changes

- 44be8ee: Localize every built-in label (found by the new LTR/RTL accessibility matrix):

  - Banner's landmark name, OTPInput cell labels, CommandDialog title, chart empty state, ReviewCard read more/less, Combobox/MultiSelect placeholder, FilterPanel/FilterChips labels, MapPlaceholder name, OpeningHours/OpenStatus text, Price compare-at label and SkipLink text now come from `UIProvider` messages (en/fr/ar) instead of hard-coded English. Explicit props still win.
  - SkipLink is now a client component (it reads messages).
  - New messages: `announcement`, `code`, `commandMenu`, `noData`, `readMore`, `showLess`, `selectPlaceholder`, `filters`, `activeFilters`, `clearAll`, `showResults`, `map`, `open`, `closed`, `closesAt`, `opensAt`, `openingHours`, `originalPrice`.

- 236b822: Accessibility fixes found by new interaction tests:

  - Slider: `aria-valuetext` and the `showValue` output now follow the thumb when uncontrolled (they were stuck at `defaultValue`).
  - MultiSelect: `aria-selected` on options now reflects the selection, as the APG multi-select listbox pattern requires (it tracked the keyboard highlight).
  - Combobox, MultiSelect, Autocomplete, DatePicker, DateRangePicker: popup dialogs now have an accessible name (the control's label, or the localized `messages.options` / `messages.chooseDate`).
  - New `options` message (en/fr/ar).
  - @ux-sting/hooks@0.10.0
  - @ux-sting/icons@0.10.0
  - @ux-sting/primitives@0.10.0
  - @ux-sting/themes@0.10.0
  - @ux-sting/tokens@0.10.0
  - @ux-sting/utils@0.10.0

## 0.9.0

### Minor Changes

- 565bec0: `TextEffect` gains `trigger="scroll"`: words (or characters) ink from muted to full in reading order as the block crosses the viewport, using CSS scroll-driven animations, so it stays a server component with no client JavaScript. Browsers without scroll-driven animations and reduced motion show the final text. Tune with `--ui-te-muted`, `--ui-te-start` and `--ui-te-span`.
- b11184e: Enforce Veltein creator attribution, automatic footer credits (<FooterCredit /> & <FooterBottom showCredit={true} />), creator metadata tags (<CreatorMeta />), Schema.org defaults, and VELTEIN Fair-Source License.

### Patch Changes

- 7012160: fix(react): `Fieldset` description used `-mt-3` against the group's 16px gap, which left the hint sitting 4px under its legend. `-mt-2` restores a readable 8px separation.
- Updated dependencies [7012160]
  - @ux-sting/icons@0.9.0
  - @ux-sting/hooks@0.9.0
  - @ux-sting/primitives@0.9.0
  - @ux-sting/themes@0.9.0
  - @ux-sting/tokens@0.9.0
  - @ux-sting/utils@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [8e8e9d3]
  - @ux-sting/icons@0.8.0
  - @ux-sting/hooks@0.8.0
  - @ux-sting/primitives@0.8.0
  - @ux-sting/themes@0.8.0
  - @ux-sting/tokens@0.8.0
  - @ux-sting/utils@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [e708ae5]
  - @ux-sting/tokens@0.7.0
  - @ux-sting/themes@0.7.0
  - @ux-sting/hooks@0.7.0
  - @ux-sting/icons@0.7.0
  - @ux-sting/primitives@0.7.0
  - @ux-sting/utils@0.7.0

## 0.6.3

### Patch Changes

- @ux-sting/hooks@0.6.3
- @ux-sting/icons@0.6.3
- @ux-sting/primitives@0.6.3
- @ux-sting/themes@0.6.3
- @ux-sting/tokens@0.6.3
- @ux-sting/utils@0.6.3

## 0.6.2

### Patch Changes

- @ux-sting/hooks@0.6.2
- @ux-sting/icons@0.6.2
- @ux-sting/primitives@0.6.2
- @ux-sting/themes@0.6.2
- @ux-sting/tokens@0.6.2
- @ux-sting/utils@0.6.2

## 0.6.1

### Patch Changes

- Updated dependencies [e457688]
  - @ux-sting/utils@0.6.1
  - @ux-sting/hooks@0.6.1
  - @ux-sting/icons@0.6.1
  - @ux-sting/primitives@0.6.1
  - @ux-sting/themes@0.6.1
  - @ux-sting/tokens@0.6.1

## 0.6.0

### Minor Changes

- 8fb121f: Add the chart family (`@ux-sting/react/chart`): `LineChart`/`AreaChart`, `BarChart`, `BarList`, `DonutChart`, `Sparkline` and `ChartMetrics`. Dependency-free SVG with crosshair/per-column tooltips, keyboard navigation, a live region and a visually hidden data table for every chart. New `--ui-chart-1` … `--ui-chart-8` tokens (Tailwind `chart-1` … `chart-8`): a colorblind-validated categorical palette with its own dark-mode steps.

### Patch Changes

- Updated dependencies [8fb121f]
  - @ux-sting/tokens@0.6.0
  - @ux-sting/themes@0.6.0
  - @ux-sting/hooks@0.6.0
  - @ux-sting/icons@0.6.0
  - @ux-sting/primitives@0.6.0
  - @ux-sting/utils@0.6.0

## 0.5.0

### Minor Changes

- b2a844e: New `Footer` pattern (`@ux-sting/react/footer`): `contentinfo` landmark with an optional `FooterCallout` CTA band, `FooterMain` (`FooterBrand` + `FooterTagline`, `FooterNav` of `FooterColumn`s with `FooterLink`s — `asChild`, `icon`, `badge`, `external`), and `FooterBottom` with `FooterCopyright` and dot-separated `FooterLegal`. `tone="inverse"` (dark in every color mode, default) or `tone="default"` (theme surface); retint through `--footer-bg/-fg/-muted/-border/-accent`.

### Patch Changes

- @ux-sting/hooks@0.5.0
- @ux-sting/icons@0.5.0
- @ux-sting/primitives@0.5.0
- @ux-sting/themes@0.5.0
- @ux-sting/tokens@0.5.0
- @ux-sting/utils@0.5.0

## 0.4.0

### Minor Changes

- 8d157dc: `ThemeScript` takes an optional `theme` (and `getThemeScript` a third argument) that sets `data-ui-theme` on `<html>` before paint. Without it, a page using a named or custom `UIProvider` theme painted in the default theme's colors until React hydrated.

### Patch Changes

- d11615f: `Badge` with `asChild` no longer throws when it wraps a link or other element. It passed the icon slot and the child to `Slot` as two children; the child is now marked with `Slottable`, so the icon or dot renders inside the link.
- Updated dependencies [8d157dc]
  - @ux-sting/utils@0.4.0
  - @ux-sting/hooks@0.4.0
  - @ux-sting/primitives@0.4.0
  - @ux-sting/icons@0.4.0
  - @ux-sting/themes@0.4.0
  - @ux-sting/tokens@0.4.0

## 0.3.0

### Patch Changes

- ff7a929: `ux-sting qa` measures contrast for text over photos and gradients on the rendered pixels (hide the text, screenshot its box, take the worst 5%) instead of reporting 1:1 against an assumed white page; SVG text is measured with its `fill`. New exports: `decodePng`, `pixelContrast`, `measurePixelContrast`.

  `@ux-sting/react`: `CarouselDots` buttons are now full 24px targets that no longer overlap (WCAG 2.5.8), and `CategoryCard`'s scrim is stronger so labels stay readable over light photos.
  - @ux-sting/hooks@0.3.0
  - @ux-sting/icons@0.3.0
  - @ux-sting/primitives@0.3.0
  - @ux-sting/themes@0.3.0
  - @ux-sting/tokens@0.3.0
  - @ux-sting/utils@0.3.0

## 0.2.0

### Patch Changes

- @ux-sting/hooks@0.2.0
- @ux-sting/icons@0.2.0
- @ux-sting/primitives@0.2.0
- @ux-sting/themes@0.2.0
- @ux-sting/tokens@0.2.0
- @ux-sting/utils@0.2.0
