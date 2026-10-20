# @sparklingopinions/sparkling-ui

## 0.2.1

### Patch Changes

- 1247c18: `arrow-right`, `arrow-up`, `arrow-down` and `arrows-up-down` are redrawn on the 16px grid with the set's 1.5px stroke, matching `arrow-left`; drawn on 24 and scaled down, their lines read about 1px.
- ea28716: `chevron-down`, `arrow-left`, `download`, `refresh`, `table`, `inbox` and the four `align-*` icons are redrawn on the 16px grid, so they keep their drawn size instead of being stretched to fill 16px; `space-width` moves onto the 24px grid.

## 0.2.0

### Minor Changes

- 142abb2: `Toaster`'s `preview` can now stand in for live toasts in a demo. Give each preview item an `id` and its toasts animate in and out as you add and remove items, as live ones do; their close button emits `close` with the item's `id` (or its index without one), so you can remove it. A preview that never changes renders as before.

## 0.1.1

### Patch Changes

- c3fa552: sparkling-ui is now open source under the MIT licence and published publicly to npm, so installing it needs no `.npmrc` entry or token. Remove the `@sparklingopinions:registry=https://npm.pkg.github.com` line and any `npm.pkg.github.com` token from your `.npmrc`, then reinstall. Storybook is at https://sparklingopinions.github.io/sparkling-ui/.

## 0.1.0

### Minor Changes

- 1cabde8: `Alert` (`tone` `danger`, `warning`, `info` or `neutral`; `icon`, `inset`, `dismissible` with `dismissLabel` and a `dismiss` event; `leading` and `action` slots) and `EmptyState` (`title`, `description`, `emoji`, and `actionLabel`/`actionIcon` for a primary button that emits `action`, or `description` and `action` slots). An EmptyState description is plain text: put markup in its slot.
- 1df91ed: `Board`: records as cards in columns by a field (a stage, a status), dragged between columns. `columns` (`id`, `name`, an optional `icon` and `iconColor`, `items`); the `card` slot draws a card (its `name` by default) and the `count` slot replaces a column's count. Dropping a card emits `move` with its id, the column and its index there; `sortable` also reorders within a column. Cards are focusable and emit `card-click` on click, Enter or Space. `@new` adds a dashed "New" button to each column, shown on hover. It fills its parent's height and each column scrolls on its own; `:fill="false"` sizes columns to their cards. `loading` draws skeleton cards; `headingLevel`, `newLabel` and `emptyLabel` fit the page and translate. Dragging needs a pointer, so offer another way to change the field, such as a Select on the record.
- 582ac10: `ActionBar`: actions on the records selected in a Table or List, as a pill floating at the foot of the viewport (`:floating="false"` draws it in place). It shows only while `count` is above zero, as a toolbar named by `label` (`{count} selected`). `actions` (`label`, `action`, `icon`, `variant: 'danger'`, `disabled`) render as small secondary buttons, danger ones outlined, and emit `click-item`; the default slot takes more, such as an OptionsMenu. `@clear` adds a clear button (`clearLabel`) and makes Escape clear, unless a dialog is open. Confirm destructive actions with `useConfirm`.
- 5f21b1e: `Button`: `variant` (`primary`, `secondary`, `tinted`, `ghost`, `contrast`, `danger`, `danger-outline`), `size` (`xs`, `sm`, `md`, `lg`), `pill`, `iconOnly`, `iconPosition` and `disabled`. It renders a `<button>`; `as="a"` or `asChild` style a link or a router link instead, which are marked `aria-disabled` when disabled. Attributes and listeners, `type` included, pass through to the element.
  
  Tokens are easier to override: the defaults now have zero specificity, so an app's own `:root` rule wins wherever it sits in its CSS. New tokens: `--sui-on-danger`, and the button's `--sui-button-height`, `--sui-button-padding-x`, `--sui-button-text`, `--sui-radius-button` and `--sui-shadow-raised`.
- db0a721: `Calendar`: a month of days, weeks from Monday, with today outlined and future days muted. `start` selects a day, `start` and `end` a range drawn as a band; picking a day emits `pick` with it, and the host decides. `locale` names the month (the browser's language by default), and `weekdays`, `previousLabel` and `nextLabel` are translatable. Each day is a button named by its full date.
- de181cb: Light and dark: `initColorMode({ storageKey? })` sets `data-mode` on `<html>` from the saved choice or the system's, and follows the system while on `system`; `useColorMode()` gives `mode`, `resolved`, `isDark`, `setMode` and `toggle`; `useForceLightMode()` keeps the page light while a component is mounted, overlays included.
- ce70764: Colour roles to theme the components with. `sparkling-ui/tailwind.css` now defines `--sui-<role>` RGB channels (surfaces, lines, ink, contrast, accent, success, warning, danger, info, inverse and scrim) with the base theme's light and dark values, the `bg-sui-*`, `text-sui-*` and other colour classes over them, off-scale text sizes (`text-13`, `text-12.5` and so on) and `tracking-snug`/`tracking-caps`, and a `dark:` variant on `[data-mode='dark']`. Import it at the end of your Tailwind entry, after your own theme, and set the roles you want to change for `:root` and `[data-mode='dark']`.
  
  `sparkling-ui/base.css` is new and optional: themed text colour and page background, selection, and thin scrollbars.
- 8657079: Every text pair now meets WCAG AA (4.5:1) in light and dark, with the colour values from the design system's contrast fix. Muted and subtle greys are darker in light mode; the accent and danger text colours change, and new fill roles carry the buttons: `--sui-accent-solid` and `--sui-danger-solid`, with `--sui-danger-hover`. Hovers deepen in both modes. `--sui-ink-faint` (placeholders) is now as dark as `--sui-ink-muted`; `--sui-mark-faint` keeps the old faint grey for dots and scrollbars. Pills colour their text with the status's solid colour (`--sui-success`, `--sui-warning`, `--sui-info`), and the light orange and pink avatar inks are darker. If you override colour roles, keep text roles and fill roles apart.
- c3b9ab7: Fixes from the Sparkling UI design system: one keyboard focus ring and controls that meet WCAG 1.4.11.
  
  - Every interactive component shows the same focus ring on keyboard focus: 2px in `accent`, outside buttons and small controls, on the edge of fields and inset in menus, segments and options (on toasts it uses `on-inverse`). Fields lose the soft 3px halo; their border turns `accent` instead. The ring is themable with `--sui-focus-width`, `--sui-focus-offset`, `--sui-focus-offset-field` and `--sui-focus-offset-inset`, and apps can use the same `sui-ring`, `sui-ring-field`, `sui-ring-inset` and `sui-ring-inverse` utilities behind a `focus-visible:` variant.
  - New colour role `line-control` for field, checkbox and radio borders, at 3:1 on canvas, surface and sunken. Fields now darken to `ink-muted` on hover. An app that overrides colours should set `--sui-line-control` too.
  - Light `ink-body`, `ink-subtle`, `ink-muted` and `ink-faint` are a step darker, and the orange hue is a real orange (it was close to red).
- 56cc183: `Spinner` now turns as its arc grows and shrinks, so it reads as loading rather than pulsing. `EmptyState`'s title is a heading, an `h2` by default; set `headingLevel` (1 to 6) to fit the page's outline. Its look is unchanged.
- 67b03b8: Refinements from the Sparkling UI design system.
  
  - **Breaking:** `EmptyState` takes an `icon` (an icon name such as `users`, `inbox` or `search`) instead of `emoji`, drawn in a tile with `tone` `accent` (default, a list waiting to be filled) or `neutral` (no matches, a filtered view).
  - **Breaking:** `ToastMessage` is no longer exported. To draw toasts in place (docs, designs), pass `preview` to `Toaster`: `<Toaster :preview="[{ summary: 'Reply sent', severity: 'success' }]" />`.
  - Toasts have more room: 8px radius, the detail on its own line under the summary, a larger close button.
  - `SegmentedControl` sits on a sunken track with a hairline, and the chosen segment has one too, so it reads on any surface.
  - `ErrorSummary` is a quieter danger-tinted notice with an icon, its list in body text.
  - `Kbd` is drawn as a raised key; `Tooltip` text is 12px medium.
- 4bff68d: `Spinner` (`size` `sm`, `md` or `lg`, and a `label` for assistive tech, "Loading" by default), `Skeleton` (`shape`, `size`, `width`, `height`) and `TypingIndicator`.
- a2e4945: `FormField`: a label, hint, error and character counter around one control, wired for assistive tech. Put a `Input` or `Textarea` inside and it gets the id, `aria-describedby`, `aria-required` and invalid state on its own; any other control takes the slot's `id`, `describedBy` and `invalid`. `error` replaces the hint, as an alert, and turns the control's border danger; `maxLength` adds a counter, which turns danger past the limit. `required` adds an asterisk, `optional` a muted "Optional", and `layout="inline"` puts the label in an 88px column, like LedgerRow. Set `id` on the Field, not on the control. Translate it with `optionalLabel`, `requiredLabel` and `counterLabel`.
- 0b37d85: View filters and sort. All three open a 340px panel with the live result count (`status`) and the ↵ and Esc hints in its footer.
  
  - `FilterChip`: a filter read as a sentence ("Stage is any of Lead, Customer"; "3 stages" past two values, with `valueLabel`). `field` and `type` (`text`, `enum`, `person`, `company`, `date`, `number`, `boolean`); `v-model:op` picks from `operators` (English ones by type, as `{ value, label, noValue }`, exported as `filterOperators`), and `v-model` holds the value. The panel edits it by type, applying as you go: a checklist of `options` (with a search above six, hue dots and counts) for enum, person and company, an input for text and number, `datePresets` for date, and Yes / No for boolean. Operators with `noValue` ("is empty") hide the editor. The default slot replaces the editor; `@remove` adds Remove; `v-model:open` opens a chip just added. `kind="add"` is the dashed "+ Filter".
  - `FilterMenu`: the field list behind "+ Filter" (or, `as="button"`, the header's Filters button, tinted while `inUse` has fields). A "Filter by…" search, `fields` grouped by `group` with a tile for their type, "In use" marks; ↑ ↓ and Enter pick, emitting `pick` with the field's name.
  - `SortMenu`: one sort per view, `v-model` as `{ name, dir }` or null. As a chip it reads "Name, A → Z" and shows only while sorted; `as="button"` is the header's Sort button (`disabled` for boards). The panel lists `options` with type tiles, a direction switch worded for the field's type (`directionLabels`, defaults in `sortDirections`) and Clear sort.
  
  Every label is a prop with an English default.
- 4faa3c2: `Input` and `Textarea` (`v-model`, `invalid`, `disabled`, and `autoResize` on Textarea; every other attribute lands on the field), `Checkbox` (a boolean `v-model`), `Radio` (`v-model` with a `value` per radio) and `ErrorSummary` (`errors`, a translatable `title`, announced as an alert). New colour role: `--sui-accent-bright`, a lighter accent for hover borders.
- 64b46aa: `Icon` ships with the library's own set of 78 icons, so it works with no setup: `<Icon name="users" />`. Names are neutral (`users`, `building`, `calendar-today`, `cycle`, `more-vertical`, `bell`, `chart`, `funnel`, `plug`...); older names such as `people`, `companies`, `today`, `loops` and `dot-vertical`, and common ones such as `x`, `trash-2` and `pencil`, resolve as aliases. `iconNames` lists the set. `setIconResolver` now adds to the set: names it returns a component for win, so an app can keep its own icons and replace any of the library's. OptionsMenu's default `buttonIcon` is `more-vertical`.
- d6119b6: `Icon` and `setIconResolver`. Register the app's icons once (`setIconResolver((name) => component)`), then render one with `<Icon name="mail" />`. `color` takes a colour role (`ink-muted`, `accent`, `danger`...) and sets stroke and fill; `label` names a meaningful icon, otherwise it's hidden from assistive tech.
- 1760f02: `ImageUpload`: a round (or `square`) preview that opens the file picker or takes a dropped PNG or JPG, with Upload, Replace and Remove. `v-model:image` holds the file and `v-model:image-url` the preview; it emits `change` and `remove`, and revokes the preview URLs it makes. `size`, `hint`, and translatable `label`, `uploadLabel`, `replaceLabel` and `removeLabel`.
- bf7c3d9: `PropertyList`, a record's details with each value edited where it is, and its field editors `InlineFormInputText`, `InlineFormInputTitle` and `InlineFormInputSelect`: click or Enter to edit, Enter or leaving to save, Escape to undo. `fields` name their editor and pass it `props`; `change` reports the one field that changed.
- b526bf3: `Avatar` (`name`, `image`, `size`, `shape`, `badge`, `hue`), `Badge` (`tone` `neutral`, `accent`, `success`, `warning`, `info` or `danger`; `variant` `soft` or `text`; `dot`), `Tag` (`name` or its slot; `variant` `soft` with `color`, `removable`, `removeLabel` and a `remove` event, or `outline` for a value from a fixed set, with `muted`) and `Kbd`. `hueFor(name)` gives the stable hue Avatar derives from a name. New colour roles: the categorical hues (`--sui-hue-<blue|green|orange|pink|purple|slate|red|amber>-<soft|line|ink>`) and `--sui-warning-bright`.
- ebb8697: The ledger form: `LedgerModal` (`v-model:open`, `title`, a tinted band from `bandClass` with a `band` slot for a centred hero, rows in the default slot, and a footer with `confirmLabel`, `confirmDisabled`, a `footer-start` slot and a save hint; it emits `submit` from its button and on ⌘ or Ctrl Enter), `PropertyRow` (`label`, `error`, `align`, `divider`) and `Collapsible` (rarely used fields, folded away until opened or `filled`).
- 1efa1f6: `DataList`: a grouped list of one-line rows under sticky, collapsible group headers, for scanning and acting on many records (a loops inbox, people by stage). `groups` (`id`, `name`, `count`, `items`); `leading`, `title`, `meta` and `group-leading` slots draw each row; an item's `depth` indents it as a child. `@row-click` opens rows on click, Enter or Space; ↑ ↓ or j k move between them. `selectable` adds a checkbox gutter bound to `v-model:selected` that shows on hover, and on every row once anything is selected; x selects the focused row. `v-model:collapsed` holds the collapsed group ids, `@new` adds a + to each group header, `loading` draws skeleton rows and the `empty` slot shows when every group is empty. `headingLevel`, `newLabel` (`{group}` is the group's name), `collapseLabel`, `expandLabel` and `selectLabel` fit the page and translate.
- 158beee: `Dialog` is now the one dialog, and `LedgerModal` is gone (breaking).
  
  - A record form is a Modal with a `band` (a CSS colour such as `rgb(var(--sui-hue-blue-soft))`, or `true` for the accent wash) and a `hero` slot. `LedgerModal`'s `bandClass` becomes `band`, its `band` slot becomes `hero`, and its `submit` event becomes `confirm`.
  - The save hint is no longer automatic: pass `:hint="saveHint()"`, with `saveHint` exported alongside Modal (`{key} Enter to save` by default, `{key}` being ⌘ or Ctrl).
  - Every Modal with a `confirmLabel` confirms on ⌘ or Ctrl Enter, unless `confirmDisabled`.
  - New: `confirmVariant` (`primary`, `danger` or `contrast`), a `footer-start` slot in the standard footer, `hint`, and sizes `sm` (432px) and `record` (520px, the default with a band) besides `md`, `lg` and `xl`.
  - `Collapsible`'s `filled` is optional.
- f157284: `Dialog` (`v-model:open`, `title` or a `title` slot, `closable`, `size` `md`/`lg`/`xl`, `headerless`, and a standard footer from `confirmLabel`, `confirmIcon`, `confirmDisabled` and `cancelLabel`, emitting `confirm` and `cancel`, or a `footer` slot), and `AlertDialog` with `useConfirm()`, which returns a promise: `await confirm({ title, message, confirmLabel, confirmVariant: 'danger' })` is true when confirmed and false when cancelled or dismissed. Mount one `<AlertDialog />` near the app root.
- 83a1a9a: `DropdownMenu` takes `align` (`start`, the default, or `end`) to line its menu up with the trigger's start or end edge, for a menu at the right end of a row or toolbar.
- e8e3e14: `DropdownMenu`: a trigger and a menu of actions. `items` are `{ type: 'action', label, action, icon, variant: 'danger', shortcut, confirm, confirmed }` or `{ type: 'separator' }`; a chosen action emits `click-item` with the menu's `id`, after a confirmation when `confirm` or `confirmed` is set (needs a `<AlertDialog />`). The default trigger is an icon button (`buttonIcon`, `buttonLabel`, `tooltip`); a `trigger` slot takes any other. The confirmation's generic wording is translatable through props. `Tooltip` now passes its attributes to its trigger.
- 89cd98c: `Pagination`, a table paginator: first, previous, the pages with gaps (1 … 7 8 9 … 40), next and last, with the current page as a solid accent tile. Bind the page with `v-model:page` and pass `pageCount`; `siblingCount` and `boundaryCount` (1 each) set how many pages show around the current one and at each end, `showEnds` (on) the first and last buttons, and `disabled` turns it all off. Translate it with `label`, `firstLabel`, `previousLabel`, `nextLabel`, `lastLabel` and `pageLabel` (`Page {page}`).
- e998d05: `Popover`, opened from code as PrimeVue's was: give it a ref and call `toggle(event)`, `show(event, target?)` or `hide()`; it emits `show` and `hide`. It sits below its trigger (or `target`) at `offset` px (4 by default), and closes on Escape (unless `closeOnEscape` is false), an outside click, a scroll or a resize. Class and attributes go to the panel; it's named by an `aria-label`, or else by the element that opened it. The default slot gets `hide`.
- fe80ede: Components take the design system's names, which follow common UI-library conventions. The former names still work, marked deprecated, so nothing breaks:
  
  | New | Former |
  | --- | --- |
  | `Dialog` | `Modal` |
  | `AlertDialog` | `ConfirmDialog` |
  | `DropdownMenu` | `OptionsMenu` (types: `DropdownMenuAction`, `DropdownMenuEntry`) |
  | `Input` | `TextInput` |
  | `FormField` | `Field` |
  | `ErrorSummary` | `FormErrors` |
  | `Alert` | `Banner` |
  | `Calendar` | `CalendarMonth` |
  | `ImageUpload` | `ImageInput` |
  | `TypingIndicator` | `TypingDots` |
  | `Badge` | `Pill` |
  | `Tag variant="outline"` | `Chip` |
  | `DataList` | `List` |
  | `FilterMenu` | `FilterFieldPicker` |
  | `SortMenu` | `SortControl` |
  | `ActionBar` | `BulkActions` |
  | `PropertyRow` | `LedgerRow` |
  | `Collapsible` | `LedgerMore` |
  | `Editable` | `InlineField` |
  | `PropertyList` | `InlineForm` |
  
  Prop types follow (`DialogProps`, `BadgeTone`...). `Tag` gains `variant` (`soft`, the default, or `outline`) and `muted`, and takes its text from `name` or its slot.
- 7c806d9: `SegmentedControl`: a few choices side by side, one picked (`v-model`, `options` of `{ value, label, iconName?, icon? }`). It's a radio group: arrow keys move between the choices.
- c119c90: One `Select` for every choice, and `Editable` for every value edited in place (breaking).
  
  - **`Select`** replaces `SelectInput`. Bind its value with `v-model` (a value, or an array with `multiple`) and pass `options` (`value`, `label`, optional `color` to show it as a Tag, optional `disabled`). It draws a bordered trigger (`size` `md` 36px or `sm` 28px); `searchable` adds a filter row, on by default for `multiple`, `canCreate` or more than 8 options; `multiple` holds tags; `canCreate` offers to create what was typed, through `createOption` (by default the new option's value is its label). Also `loading`, `invalid`, `placeholder`, `searchPlaceholder`, `emptyLabel`, `createLabel`, `removeLabel`, `side`, `align`, `panelWidth`, the `query-change` event for searching on a server, and `trigger` and `option` slots. Inside a `FormField` it's wired like a text field.
  - Moving from `SelectInput`: `items` (`{ id, name, color }`) become `options` (`{ value, label, color }`), and the model holds values, not items; `createFn` becomes `createOption`; `inputPlaceholder` becomes `searchPlaceholder`, `emptyPlaceholder` `emptyLabel`, and `label` the trigger's `aria-label`; the `trigger` slot's `onClick` and `expanded` become `toggle` and `open`, plus `selected`; the `option` slot's `item` becomes `option`; `inline` is gone: draw an inline trigger in the slot.
  - **`Editable`** replaces `InlineFormInputText`, `InlineFormInputTitle` and `InlineFormInputSelect`, with `variant` `text`, `multiline` (was `multipleRows`), `select` (with `options`) or `title`. Every variant can now be reached with Tab.
  - **`PropertyList`** fields take a `type` (`text`, `multiline` or `select`), `options` and `disabled` instead of a `component` and `props`.
- 9e4e53b: `SelectInput`: a field (drawn by the `trigger` slot, which gets `onClick`) that opens a filterable list. `v-model` holds an item (`{ id, name, color? }`), or an array with `multiple`, shown as removable tags. Type to filter, arrow keys and Enter to pick; Backspace removes the last choice. `can-create` with `create-fn` offers to create what was typed (`create-colored` gives it a tag colour); `query-change` reports the query for searching elsewhere; `loading` shows a spinner; `inline` opens over its trigger. An `option` slot draws each option, and long lists render only the rows in view. `label` names the list ("Options"); the other texts are props too. `Popover` gains `alignOffset`.
- 941988b: `Table`: a data table with a sunken header strip, 57px rows (40px with `size="sm"`), sunken hover. `columns` (`key`, `label`, `width`, `align`, `sortable`) and `rows`, identified by `rowKey` (`id` by default). Sortable headers cycle ascending, descending and unsorted through `v-model:sort` and set `aria-sort`; `selectable` adds a checkbox column bound to `v-model:selected`, with an indeterminate select-all. `@row-click` makes rows clickable. Draw a cell with a `cell-<key>` slot (`row`, `value`); empty cells show a muted dash. `loading` draws skeleton rows, the `empty` slot shows when there are no rows, an `error` slot replaces the body, and the `footer` slot is a strip for a rows-per-page Select and Pagination. Below 720px wide it scrolls sideways; set `--sui-table-min` to change that. `caption`, `selectAllLabel` and `selectRowLabel` name it for screen readers.
  
  `Checkbox` takes `indeterminate`: a dash for "some of these", announced as mixed.
- 5c21dd8: Toasts: mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)` or `toast.error(...)` from anywhere, with `{ detail, life, closable }` (3s by default; `life: 0` stays until closed). They pause while hovered, and F8 focuses them. `ToastMessage` draws one toast on its own, for previews.
- ddba76b: `Tooltip`, wrapping its trigger: `<Tooltip text="Archive"><Button>...</Button></Tooltip>`. `side` (`top` by default, `right`, `bottom`, `left`), `disabled`, and a `content` slot for rich content; line breaks in `text` are kept. It shows at once on hover and on keyboard focus, and Escape hides it.
