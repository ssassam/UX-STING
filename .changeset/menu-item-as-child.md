---
"@ux-sting/react": patch
---

Menu items (`DropdownMenuItem`, `ContextMenuItem`, `MenubarItem`, checkbox/radio items and sub-triggers) now support `asChild`. Before, they always rendered their icon/shortcut next to the children, so `asChild` crashed with "Primitive.div failed to slot onto its children". With `asChild` the icon, shortcut and indicator are placed inside the child element, e.g. `<DropdownMenuItem asChild icon={<UserIcon />}><Link to="/account">Account</Link></DropdownMenuItem>`.
