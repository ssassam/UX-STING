# DropdownMenu

> Overlays · `@unified-ui/react/dropdown-menu`

Menu of actions with items, checkboxes, radios, shortcuts and submenus (also exported as Dropdown).

## When to use

Use for overflow actions and "more" menus.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuGroup } from "@unified-ui/react/dropdown-menu";
```

Or copy the source into your project and own it:

```bash
npx unified-ui add dropdown-menu
```

## Accessibility

- ARIA menu pattern with typeahead; destructive items are styled and labelled, not only colored.

### Keyboard

| Keys | Action |
| --- | --- |
| Enter / Space / ↓ | Open and focus first item |
| ↑ / ↓ | Move |
| → / ← | Open / close submenu (mirrored in RTL) |
| Escape | Close |

## API

### DropdownMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `dir` | `Direction` | — |  |
| `modal` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### DropdownMenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `onValueChange` | `(value: string) => void` | — |  |
| `value` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuSub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### DropdownMenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `Align` | — |  |
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
| `side` | `Side` | — |  |
| `sideOffset` | `number` | — |  |
| `sticky` | `'partial' \| 'always'` | — |  |
| `updatePositionStrategy` | `'optimized' \| 'always'` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuItem

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

### DropdownMenuCheckboxItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `checked` | `CheckedState` | — |  |
| `disabled` | `boolean` | — |  |
| `onCheckedChange` | `(checked: boolean) => void` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuRadioItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` * | `string` | — |  |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `inset` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuSubTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `icon` | `ReactNode` | — |  |
| `inset` | `boolean` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownMenuSubContent

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

### DropdownMenuShortcut

No additional props.

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### Dropdown

Alias for DropdownMenu.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `dir` | `Direction` | — |  |
| `modal` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### DropdownTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `Align` | — |  |
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
| `side` | `Side` | — |  |
| `sideOffset` | `number` | — |  |
| `sticky` | `'partial' \| 'always'` | — |  |
| `updatePositionStrategy` | `'optimized' \| 'always'` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DropdownItem

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

---

Full documentation with live examples: `apps/docs` → `/components/dropdown-menu`. This file is generated by `pnpm readmes`.
