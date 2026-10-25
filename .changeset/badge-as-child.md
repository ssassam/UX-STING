---
"@ux-sting/react": patch
---

`Badge` with `asChild` no longer throws when it wraps a link or other element. It passed the icon slot and the child to `Slot` as two children; the child is now marked with `Slottable`, so the icon or dot renders inside the link.
