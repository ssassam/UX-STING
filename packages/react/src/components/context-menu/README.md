# ContextMenu

> Overlays · `@ux-sting/react/context-menu`

Right-click / long-press menu.

## When to use

Use as a shortcut to actions that are also available elsewhere.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuGroup } from "@ux-sting/react/context-menu";
```

Or copy the source into your project and own it:

```bash
npx ux-sting add context-menu
```

## Accessibility

- Opens with Shift+F10 / the context-menu key.

## API

### ContextMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `dir` | `Direction` | — |  |
| `modal` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### ContextMenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `onValueChange` | `(value: string) => void` | — |  |
| `value` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuSub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### ContextMenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `alignOffset` | `number` | — |  |
| `arrowPadding` | `number` | — |  |
| `asChild` | `boolean` | — |  |
| `avoidCollisions` | `boolean` | — |  |
| `collisionBoundary` | `Boundary \| Boundary[]` | — |  |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | — |  |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |
| `hideWhenDetached` | `boolean` | — |  |
| `loop` | `RovingFocusGroupProps['loop']` | — | Whether keyboard navigation should loop around |
| `onCloseAutoFocus` | `FocusScopeProps['onUnmountAutoFocus']` | — | Event handler called when auto-focusing on close. Can be prevented. |
| `onEscapeKeyDown` | `DismissableLayerProps['onEscapeKeyDown']` | — |  |
| `onFocusOutside` | `DismissableLayerProps['onFocusOutside']` | — |  |
| `onInteractOutside` | `DismissableLayerProps['onInteractOutside']` | — |  |
| `onPointerDownOutside` | `DismissableLayerProps['onPointerDownOutside']` | — |  |
| `sticky` | `'partial' \| 'always'` | — |  |
| `updatePositionStrategy` | `'optimized' \| 'always'` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `icon` | `ReactNode` | — | Leading icon. |
| `inset` | `boolean` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `shortcut` | `ReactNode` | — | Keyboard shortcut hint (display only). |
| `textValue` | `string` | — |  |
| `variant` | `"default" \| "destructive"` | — | `destructive` for dangerous actions (delete, sign out). |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuCheckboxItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `checked` | `CheckedState` | — |  |
| `disabled` | `boolean` | — |  |
| `onCheckedChange` | `(checked: boolean) => void` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuRadioItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` * | `string` | — |  |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `inset` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuSubTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `icon` | `ReactNode` | — |  |
| `inset` | `boolean` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuSubContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `AlignSubContent` | — | Controls the direction the subcontent appears from its anchor menu item Default: start |
| `alignOffset` | `number` | — |  |
| `arrowPadding` | `number` | — |  |
| `asChild` | `boolean` | — |  |
| `avoidCollisions` | `boolean` | — |  |
| `collisionBoundary` | `Boundary \| Boundary[]` | — |  |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | — |  |
| `forceMount` | `true` | — | Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. |
| `hideWhenDetached` | `boolean` | — |  |
| `loop` | `RovingFocusGroupProps['loop']` | — | Whether keyboard navigation should loop around |
| `onEscapeKeyDown` | `DismissableLayerProps['onEscapeKeyDown']` | — |  |
| `onFocusOutside` | `DismissableLayerProps['onFocusOutside']` | — |  |
| `onInteractOutside` | `DismissableLayerProps['onInteractOutside']` | — |  |
| `onPointerDownOutside` | `DismissableLayerProps['onPointerDownOutside']` | — |  |
| `sideOffset` | `number` | — |  |
| `sticky` | `'partial' \| 'always'` | — |  |
| `updatePositionStrategy` | `'optimized' \| 'always'` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### ContextMenuShortcut

No additional props.

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

---

Full documentation with live examples: `apps/docs` → `/components/context-menu`. This file is generated by `pnpm readmes`.
