# Menubar

> Navigation · `@unified-ui/react/menubar`

Desktop-application style menu bar.

## When to use

Use in editors and complex tools on desktop.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { Menubar, MenubarTrigger, MenubarMenu } from "@unified-ui/react/menubar";
```

Or copy the source into your project and own it:

```bash
npx unified-ui add menubar
```

## Accessibility

- Implements the ARIA menubar pattern.

### Keyboard

| Keys | Action |
| --- | --- |
| ← / → | Move between menus |
| ↓ / Enter | Open menu |
| Escape | Close |

## API

### Menubar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `defaultValue` | `string` | — |  |
| `dir` | `RovingFocusGroupProps['dir']` | — |  |
| `loop` | `RovingFocusGroupProps['loop']` | — |  |
| `onValueChange` | `(value: string) => void` | — |  |
| `value` | `string` | — |  |

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 290 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `value` | `string` | — |  |

### MenubarGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `onValueChange` | `(value: string) => void` | — |  |
| `value` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarSub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — |  |
| `defaultOpen` | `boolean` | — |  |
| `onOpenChange` | `(open: boolean) => void` | — |  |
| `open` | `boolean` | — |  |

### MenubarContent

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

### MenubarItem

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

### MenubarCheckboxItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `checked` | `CheckedState` | — |  |
| `disabled` | `boolean` | — |  |
| `onCheckedChange` | `(checked: boolean) => void` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarRadioItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` * | `string` | — |  |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `onSelect` | `(event: Event) => void` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 279 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `inset` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarSubTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | — |  |
| `disabled` | `boolean` | — |  |
| `icon` | `ReactNode` | — |  |
| `inset` | `boolean` | — |  |
| `textValue` | `string` | — |  |

_Also accepts 280 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MenubarSubContent

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

### MenubarShortcut

No additional props.

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

---

Full documentation with live examples: `apps/docs` → `/components/menubar`. This file is generated by `pnpm readmes`.
