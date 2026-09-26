# API conventions

A single vocabulary across every component. If a prop exists on two components, it means the same thing.

## Shared props

| Prop | Meaning | Values |
| --- | --- | --- |
| `variant` | Visual style **and** intent | `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `success`, `warning`, `info` (subset per component) |
| `size` | Control scale | `xs`, `sm`, `md`, `lg`, `xl` (subset per component). `md` is always the default |
| `disabled` | Not interactive, still visible, `disabled`/`aria-disabled` set | boolean |
| `loading` | Busy: disables interaction, sets `aria-busy`, shows a spinner | boolean |
| `invalid` | Error state; sets `aria-invalid` (usually derived from `Field`) | boolean |
| `asChild` | Render the child element and merge props onto it | boolean |
| `className` | Merged last with `cn()` so it wins | string |
| `children` | Content / composition | ReactNode |

There is no `color`, `intent`, `tone` or `kind` prop anywhere — only `variant`.

## State

Every stateful component supports controlled and uncontrolled use with the same naming:

| Value | Default | Change |
| --- | --- | --- |
| `value` | `defaultValue` | `onValueChange` |
| `open` | `defaultOpen` | `onOpenChange` |
| `checked` | `defaultChecked` | `onCheckedChange` |
| `pressed` | `defaultPressed` | `onPressedChange` |
| `page` | `defaultPage` | `onPageChange` |
| `selectedIds` | — | `onSelectedIdsChange` |

Implemented once in `useControllableState`.

## Naming

- Compound parts share the root name: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter`, `DialogClose`.
- Layout sides are logical: `start`/`end`, never `left`/`right`.
- Icon slots: `icon` (single), `startIcon`/`endIcon` (buttons).
- Event handlers use `on` + subject + verb: `onValueChange`, `onFilesAccepted`, `onPinClick`.
- Accessible label props: `label` for visible/landmark names, `aria-label` when purely for AT.

## Variants in code

Variants are built with `createVariants()` and exported (`buttonVariants`, `badgeVariants`…) so you can style other elements consistently:

```tsx
<a className={buttonVariants({ variant: "outline", size: "sm" })} href="/docs">Docs</a>
```

## Refs & attributes

All DOM components forward refs and spread remaining HTML attributes onto the root element (or the most meaningful element, documented per component).
