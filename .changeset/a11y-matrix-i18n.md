---
"@ux-sting/react": patch
---

Localize every built-in label (found by the new LTR/RTL accessibility matrix):

- Banner's landmark name, OTPInput cell labels, CommandDialog title, chart empty state, ReviewCard read more/less, Combobox/MultiSelect placeholder, FilterPanel/FilterChips labels, MapPlaceholder name, OpeningHours/OpenStatus text, Price compare-at label and SkipLink text now come from `UIProvider` messages (en/fr/ar) instead of hard-coded English. Explicit props still win.
- SkipLink is now a client component (it reads messages).
- New messages: `announcement`, `code`, `commandMenu`, `noData`, `readMore`, `showLess`, `selectPlaceholder`, `filters`, `activeFilters`, `clearAll`, `showResults`, `map`, `open`, `closed`, `closesAt`, `opensAt`, `openingHours`, `originalPrice`.
