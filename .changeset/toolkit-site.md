---
"@ux-sting/qa": patch
"@ux-sting/extract": patch
---

`ux-sting qa`: wrapping rows of differently sized chips are no longer reported as orphaned grid items, and ©, ® and ™ no longer count as emoji icons. `ux-sting extract`: text that is unreadable on the page background (a dark label on a light button) is no longer taken as the muted text color. Found while building the toolkit demo site (`examples/toolkit`).
