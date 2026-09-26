# Dialog

> Overlays · `@unified-ui/react/dialog`

Modal window for focused tasks (also exported as Modal).

## When to use

Use Dialog for focused actions that need full attention: edit, create, confirm details.

**Consider alternatives:** Use Sheet for contextual side panels, Drawer on mobile, AlertDialog for destructive confirmations, and never for primary navigation.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { Dialog, DialogTrigger, DialogClose } from "@unified-ui/react/dialog";
```

Or copy the source into your project and own it:

```bash
npx unified-ui add dialog
```

## Accessibility

- Traps focus, restores it to the trigger, closes on Escape and locks page scroll.
- Always has a visible close button and a title (DialogTitle).
- Nested dialogs stack correctly.

### Keyboard

| Keys | Action |
| --- | --- |
| Escape | Close |
| Tab / Shift+Tab | Cycle focus inside |

## API

### Dialog

Use Dialog for focused tasks that need the user's full attention (edit, confirm, create). It traps focus, closes on Escape, restores focus to the trigger and locks page scroll.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `modal` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### DialogTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogClose

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogPortal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `container` | `PortalProps['container']` | — | Specify a container element to portal the content into. |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |

### DialogOverlay

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `deferPointerDownOutside` | `boolean` | — | When `true`, a `'pointerdown'` event outside of the layered element will wait for the interaction's click event before dispatching, allowing third-party code to stop propagation of later events and cancel dismissal. |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |
| `onCloseAutoFocus` | `FocusScopeProps['onUnmountAutoFocus']` | — | Event handler called when auto-focusing on close. Can be prevented. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | Event handler called when the escape key is down. Can be prevented. |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` | — | Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` | — | Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. |
| `onOpenAutoFocus` | `FocusScopeProps['onMountAutoFocus']` | — | Event handler called when auto-focusing on open. Can be prevented. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | — | Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. |
| `showClose` | `boolean` | `true` | Render the close (×) button. Every dialog needs a visible way out. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogHeader

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogBody

Scrollable middle region; header and footer stay visible.

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogFooter

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DialogDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### Modal

Alias: `Modal` is the same component as `Dialog`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `modal` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### ModalTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `deferPointerDownOutside` | `boolean` | — | When `true`, a `'pointerdown'` event outside of the layered element will wait for the interaction's click event before dispatching, allowing third-party code to stop propagation of later events and cancel dismissal. |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |
| `onCloseAutoFocus` | `FocusScopeProps['onUnmountAutoFocus']` | — | Event handler called when auto-focusing on close. Can be prevented. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | Event handler called when the escape key is down. Can be prevented. |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` | — | Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` | — | Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. |
| `onOpenAutoFocus` | `FocusScopeProps['onMountAutoFocus']` | — | Event handler called when auto-focusing on open. Can be prevented. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | — | Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. |
| `showClose` | `boolean` | — | Render the close (×) button. Every dialog needs a visible way out. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalHeader

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalBody

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalFooter

No additional props.

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ModalClose

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

---

Full documentation with live examples: `apps/docs` → `/components/dialog`. This file is generated by `pnpm readmes`.
