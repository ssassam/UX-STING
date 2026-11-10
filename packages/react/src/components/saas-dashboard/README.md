# SaaS dashboard

> Patterns · `@ux-sting/react/saas-dashboard`

Composable dashboard panels, compact toolbars, grids, metric summaries, controlled work boards, agendas, conversations and authentication layouts.

## When to use

Build analytics, CRM, billing, scheduling, task and chat screens using existing data tables, forms, dialogs and calendars.

**Consider alternatives:** These compositions do not invent business data or supply authentication/backends. Connect real APIs in the consumer.

## Installation

Use the package (tree-shakeable per-component entry point):

```tsx
import { DashboardPanel, DashboardToolbar, DashboardGrid } from "@ux-sting/react/saas-dashboard";
```

Or copy the source into your project and own it:

```bash
npx ux-sting add saas-dashboard
```

## Accessibility

- Panels have labelled headings. Filter controls keep native Tab order.
- Every board move has a native select alternative. Conversation drafts survive failed sends.
- Pass translated labels, locale and error text to data-driven compositions.

## Responsive behavior

One-column phone layouts; dashboard and board grids expand at larger breakpoints.

## API

### DashboardPanel

Flat analytics surface with a labelled heading and responsive actions.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` * | `ReactNode` | — |  |
| `actions` | `ReactNode` | — |  |
| `description` | `ReactNode` | — |  |
| `footer` | `ReactNode` | — |  |

_Also accepts 277 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DashboardToolbar

One filter surface; regular controls keep native Tab order and wrap on narrow screens.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` * | `string` | — |  |
| `actions` | `ReactNode` | — |  |
| `summary` | `ReactNode` | — |  |

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### DashboardGrid

Source-order-preserving SaaS content grid, single column on phones.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `"balanced" \| "wide-main" \| "metrics"` | `"balanced"` |  |

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### MetricSummary

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` * | `string` | — |  |
| `value` * | `ReactNode` | — |  |
| `change` | `ReactNode` | — |  |
| `chart` | `ReactNode` | — |  |
| `detail` | `ReactNode` | — |  |
| `icon` | `ReactNode` | — |  |
| `trend` | `"up" \| "down" \| "neutral"` | `"neutral"` |  |

_Also accepts 278 standard HTML/React attributes (className, style, aria-*, event handlers…)._

### WorkBoard

Controlled Kanban with a native move menu: every move works without dragging.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` * | `BoardColumn[]` | — |  |
| `items` * | `BoardItem[]` | — |  |
| `label` * | `string` | — |  |
| `onMove` * | `(itemId: string, columnId: string) => void` | — |  |
| `className` | `string` | — |  |
| `empty` | `ReactNode` | `"No items"` |  |
| `moveLabel` | `(title: string) => string` | `(title) => `Move ${title}`` |  |
| `onOpen` | `(item: BoardItem) => void` | — |  |

### ScheduleView

Chronological agenda. Callers supply ISO datetimes; no artificial events are created.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` * | `ScheduleItem[]` | — |  |
| `label` * | `string` | — |  |
| `className` | `string` | — |  |
| `empty` | `ReactNode` | `"No scheduled items"` |  |
| `locale` | `string` | `"en"` |  |
| `onOpen` | `(item: ScheduleItem) => void` | — |  |

### Conversation

Controlled message history and async composer; failures preserve the draft.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` * | `string` | — |  |
| `messages` * | `ConversationMessage[]` | — |  |
| `onSend` * | `(message: string) => void \| Promise<void>` | — |  |
| `className` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `errorLabel` | `string` | `"Message could not be sent. Try again."` |  |
| `inputLabel` | `string` | `"Message"` |  |
| `locale` | `string` | `"en"` |  |
| `sendLabel` | `string` | `"Send"` |  |

### AuthPanel

Auth composition for sign-up, login, recovery or confirmation. Consumer owns authentication.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` * | `ReactNode` | — |  |
| `title` * | `string` | — |  |
| `aside` | `ReactNode` | — |  |
| `brand` | `ReactNode` | — |  |
| `className` | `string` | — |  |
| `description` | `string` | — |  |
| `footer` | `ReactNode` | — |  |

### RecordEditor

Reusable customer, product and event form. Consumer owns validation beyond native constraints and persistence.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` * | `RecordField[]` | — |  |
| `label` * | `string` | — |  |
| `onChange` * | `(key: string, value: string) => void` | — |  |
| `onSave` * | `(values: Record<string, string>) => void \| Promise<void>` | — |  |
| `values` * | `Record<string, string>` | — |  |
| `actions` | `ReactNode` | — |  |
| `className` | `string` | — |  |
| `errorLabel` | `string` | `"Could not save. Try again."` |  |
| `saveLabel` | `string` | `"Save"` |  |

### InvoiceComposer

Controlled invoice rows and currency totals. Tax rate is an explicit decimal (0.2 = 20%).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `currency` * | `string` | — |  |
| `items` * | `InvoiceLine[]` | — |  |
| `label` * | `string` | — |  |
| `onChange` * | `(items: InvoiceLine[]) => void` | — |  |
| `className` | `string` | — |  |
| `labels` | `Partial< Record< "description" \| "quantity" \| "unitPrice" \| "add" \| "remove" \| "subtotal" \| "tax" \| "total", string > >` | `{}` |  |
| `locale` | `string` | `"en"` |  |
| `taxRate` | `number` | `0` |  |

### ScheduleCalendar

Controlled month/year/day scheduler composed from the existing accessible Calendar.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `date` * | `Date` | — |  |
| `items` * | `ScheduleItem[]` | — |  |
| `label` * | `string` | — |  |
| `onDateChange` * | `(date: Date) => void` | — |  |
| `view` * | `"month" \| "year" \| "day"` | — |  |
| `agendaLabel` | `string` | — |  |
| `className` | `string` | — |  |
| `dateLabel` | `string` | `"Date"` |  |
| `empty` | `ReactNode` | `"No events"` |  |
| `locale` | `string` | `"en"` |  |
| `onOpen` | `(item: ScheduleItem) => void` | — |  |

### TaskTimeline

Date-proportional task spans, with explicit dates and a keyboard-operable task action.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `end` * | `string` | — |  |
| `label` * | `string` | — |  |
| `start` * | `string` | — |  |
| `tasks` * | `TimelineTask[]` | — |  |
| `className` | `string` | — |  |
| `empty` | `ReactNode` | `"No tasks"` |  |
| `locale` | `string` | `"en"` |  |
| `onOpen` | `(task: TimelineTask) => void` | — |  |

---

Full documentation with live examples: `apps/docs` → `/components/saas-dashboard`. This file is generated by `pnpm readmes`.
