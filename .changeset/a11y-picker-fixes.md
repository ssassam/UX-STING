---
"@ux-sting/react": patch
---

Accessibility fixes found by new interaction tests:

- Slider: `aria-valuetext` and the `showValue` output now follow the thumb when uncontrolled (they were stuck at `defaultValue`).
- MultiSelect: `aria-selected` on options now reflects the selection, as the APG multi-select listbox pattern requires (it tracked the keyboard highlight).
- Combobox, MultiSelect, Autocomplete, DatePicker, DateRangePicker: popup dialogs now have an accessible name (the control's label, or the localized `messages.options` / `messages.chooseDate`).
- New `options` message (en/fr/ar).
