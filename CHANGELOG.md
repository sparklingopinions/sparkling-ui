# @sparklingopinions/sparkling-ui

## 0.12.0

### Minor Changes

- a83a633: Icon: `sparkle` (one four-point star, for what's new), `circle-help` (help), `info`, `command` (keyboard shortcuts) and `mail` (contact), drawn on the 24px grid like `circle-alert` and `sparkles`. The set now has 140.

## 0.11.0

### Minor Changes

- 6971ce2: Two new components:
  
  - `PricingCard`: one plan a person can choose. It shows the plan's `name`, `price` and `period`, an optional `description` and accent `badge`, and a full-width button (`actionLabel`, default "Choose") that emits `select`. `highlighted` marks the recommended plan with an accent border and a primary button; `loading` and `disabled` cover the button's states. A default slot adds lines under the button, and the `action` slot replaces the button.
  - `Meter`: a thin bar for how much of a limit is used. It takes `value`, an optional `reserved` amount drawn after it in a lighter shade, `max`, a `tone` (`neutral`, `warning`, `accent`), a required `label` and an optional `valueText`. It clamps to `max` and is a `role="meter"` for assistive tech; put the numbers beside it.

## 0.10.0

### Minor Changes

- e41fe84: Badge has an `outline` variant: a small neutral pill whose dot carries the tone, for a count that belongs somewhere else.

## 0.9.3

### Patch Changes

- f87d1fb: Table's select-all checkbox lines up with the row checkboxes; the header cell centred it.

## 0.9.2

### Patch Changes

- 8468e5a: Select highlights the option under the pointer again; only the first option Reka highlights as the list opens is cleared.

## 0.9.1

### Patch Changes

- 977f8fc: `Icon`: icons from the library's set now get the attributes `Icon` gives them. Decorative ones are `aria-hidden` again, and a `label` makes one a named `role="img"`. Before, only `class` and `style` reached the `<svg>`; icons from an app's resolver were unaffected.

## 0.9.0

### Minor Changes

- 6512fbd: `Select` options take an `icon` and `iconColor`, like a `Board` column, for a status or a stage shown by its icon:
  
  ```ts
  { value: 'follow_up', label: 'Follow-up', icon: 'bell-ring', iconColor: 'warning' }
  ```
  
  - The icon sits before the label in the list and in the trigger, 16px, in `ink-subtle` unless `iconColor` says otherwise. It's decorative: the label still names the option.
  - A coloured option's Tag, the tags of a `multiple` select and the outline Tag a `PropertyList` select field shows all carry it too.
  - `Tag` takes `icon` and `iconColor` itself: a 14px icon before the name, on soft and outline tags, in place of the hue dot.

## 0.8.0

### Minor Changes

- 1ab0be2: Button: `pressed` makes it a toggle. It sets `aria-pressed` and draws the button on: an 18% on-inverse wash for `ghost-inverse` (22% hovered, past hover's 12%, and white text still holds 4.5:1), and the accent wash for `ghost` and `secondary` (accent-soft hovered). It works with `iconOnly` at every size. Leave `pressed` unset on a plain button.
  
  New `Toolbar`: a `role="toolbar"` row for your own controls, named by `label`. Tab enters it once; the arrow keys move between its controls (skipping disabled ones, wrapping unless `loop` is false), Home and End jump to the ends. `orientation="vertical"` uses up and down. It draws no surface, so it fits a bubble menu on an inverse ground or a bar on the page.
- 9554716: Icon: `circle-minus`, a ring with a short bar, for taking something out of a list, such as marking an item not relevant. It pairs with `circle-check`; the set now has 135.
- aedc494: DataList, for denser cards and richer selection:
  
  - `groupHeaderTone` (`sunken`, `surface` or `canvas`; by default sunken when joined, surface as cards) and `groupHeaderHeight` in px (36 by default, sets `--sui-list-header`).
  - `collapsible`: `false` drops the chevron, for the list or per group through the group's own `collapsible`. A new `group-actions` slot puts controls at the end of a header, such as Show and Hide.
  - `rowHeight` in px (40 by default, sets `--sui-list-row`), and `dividers` for a hairline between rows.
  - `checkboxPlacement="leading"`: the checkbox takes the place of the `leading` slot's first mark on hover, on focus, and on every row once anything is selected. While anything is selected, a click on a row toggles it instead of opening it. The `leading` slot now also gets `selected`, `selecting` and `toggle`.
  - Selecting anywhere: shift-click selects a range from the row last toggled, Cmd or Ctrl-click toggles one row, Shift+↑ ↓ extends the selection, and Shift+Space selects a range.
  - `contextItems(item)` puts a ContextMenu on each row, named by `contextLabel`, and emits `context-item` with the chosen action and its row. Disabled items work as in ContextMenu.
  
  The arrow keys now skip rows in collapsed groups.
- e25dde6: DropdownMenu and ContextMenu: an item can be `disabled`, with an optional `disabledReason` shown under its label. A disabled item stays in place, dimmed, so the menu keeps its shape. It's announced as disabled (with the reason as its description), the arrow keys still reach it and typeahead skips it. Choosing it does nothing: no `click-item`, no confirm, and the menu stays open. Show actions that don't apply this way instead of leaving them out.
- 9621271: New `PopoverDialog`, for a small decision such as a date or a link. On the desktop it's a popover under its `anchor`: an element, a component or a ref to one, so a keyboard shortcut or a button elsewhere can open it, with `v-model:open`. Without an `anchor`, it opens under the `trigger` slot's button; spread the slot's `props` on that button. Below `sheetBelow` (640px) it's a Dialog bottom sheet. Without an anchor or a trigger, it's a small dialog on the desktop.
  
  The popover has the `title` as its heading and accessible name, your fields, and a footer with Cancel and `confirmLabel`. The confirm button emits `confirm`, as ⌘ or Ctrl Enter does; `confirmDisabled` turns it off and the `footer` slot replaces both buttons. `width` is in px (320) or any CSS width. Escape, Cancel and a click outside emit `cancel` and close it; confirming doesn't, so close it when you're done. Focus moves to an `[autofocus]` field inside, or else the panel, and goes back to what had it when it opened, or else the anchor.
- 1356ef4: Table: `headerHeight` gives the header row its own height in px, such as 36 over 44px rows (`rowHeight` alone still sets both). It sets the new `--sui-table-header` token, which an app can also set itself.
  
  Tag: a pressable Tag takes `size="sm"`, 22px tall with 12px text, for a dense row of filters; `md` (28px) stays the default.
- 0e56572: Toaster: `position` places live toasts at `bottom-center` (the default), `bottom-left`, `bottom-right`, `top-center`, `top-left` or `top-right`. New tokens keep them clear of your own chrome: `--sui-toaster-inset-top`, `-right`, `-bottom` and `-left` (0px by default) for a sidebar or a tab bar, set on `:root`, under a media query, or on an element around the Toaster, so they can change per route or breakpoint; `--sui-toaster-margin` (1.25rem) is the gap to those edges and `--sui-toaster-width` (24rem) the width. The safe area is now added to the edge they sit on, on top of the inset. From the top, toasts slide in from above, with the newest nearest the edge. With reduced motion, toasts fade in and out instead of sliding and collapsing.

## 0.7.0

### Minor Changes

- c8c1cdf: Icon: 16 new icons for statuses and activity: `hourglass`, `bell-ring`, `snooze`, `mail-x`, `flag`, `sprout`, `compass`, `flask`, `heart`, `trophy`, `thermometer-low`, `heart-crack`, `phone`, `calendar-users`, `sticky-note` and `sparkles`. They're drawn on the 24px grid like the newer icons, so they match the rest at 1.5px, and the set now has 134.

## 0.6.0

### Minor Changes

- 93e015a: `Button` takes `variant="ghost-inverse"` for inverse grounds such as toasts and dark bands: on-inverse text and icons, an on-inverse wash at 12% on hover and 20% pressed, and the inverse focus ring. It comes in the same sizes as the other variants.
- 4468cf6: A new `ContextMenu`: DropdownMenu's items opened at the pointer, for right-click on rows and cards. It takes the same `items` (icons, shortcuts, separators, danger, confirm-first) and emits the same `click-item`, `show` and `hide`, plus `update:open`.
  
  ```vue
  <ContextMenu :items="items" label="Post actions" @click-item="run">
    <PostRow tabindex="0" />
  </ContextMenu>
  ```
  
  - The default slot is the target, rendered with no wrapper of its own; make it focusable.
  - From the keyboard, Shift+F10 or the Menu key opens it at the focused target with its first item focused. Arrow keys, Home, End and typeahead move; Escape closes and returns focus to the target.
  - It opens at the pointer and stays inside the window. `disabled` lets the browser's own menu through.
  - Keep every action reachable from a visible control too, such as the row's More menu: context menus aren't discoverable.
- f384ca4: `DataList` groups can carry their own header:
  
  - `variant="cards"` draws each group as its own bordered card, 12px apart, with headers on the surface colour that don't stick. `joined` stays the default.
  - A `#group-header="{ group, count, collapsed }"` slot renders your content, such as a status Badge and a count, inside the group's heading in place of its name and count. A group's `header` does the same with plain text.
  - A group's `label` is its accessible name when its header isn't just its name, and names its + button.
- 1f3a42e: `Dialog` takes `presentation="sheet"` to show as a bottom sheet, or `"auto"` to be a sheet on viewports narrower than `sheetBelow` (640px by default) and a dialog above it. `dialog` stays the default.
  
  - The sheet sits full width at the bottom with rounded top corners (a new `--sui-radius-sheet` token, 1.25rem), a grab handle, the title row, a scrolling body and a sticky footer. The confirm runs full width at 48px with the `hint` centred above it, and the footer clears the device's safe area.
  - Drag the handle or title row down and the sheet follows; let go past a third of its height, or with a flick, and it closes, otherwise it springs back. A tap on the scrim and Escape close it too, so it draws no Cancel button. Each of these emits `cancel`.
  - It slides up from the bottom and back down, without animation when reduced motion is on.
  - `:closable="false"` hides the close button but keeps a Close that appears on keyboard focus, so keyboard and screen-reader users can always leave.
  - Focus, labelling and the ⌘/Ctrl Enter confirm work as in a dialog. A sheet doesn't draw `band` or the `hero` slot.
- d471bde: `EmptyState` takes `size="sm"` for an empty card in settings or a tray: an optional 16px icon in ink-muted, the `title` as one 13px muted line (a paragraph, not a heading), and the action as a small secondary button, in tighter padding. `description` isn't shown at this size. `md` stays the default and is unchanged.
- 2b83bec: `SortMenu` and `FilterMenu` fit a page header:
  
  - `variant="ghost"` (with `as="button"`) draws a ghost Sort or Filters button. Without it they stay secondary, tinted while sorting or filtering.
  - A `#trigger` slot draws your own opener: `#trigger="{ open, toggle, active, label, props }"` on SortMenu (`label` reads like the sort chip) and `#trigger="{ open, toggle, count, props }"` on FilterMenu. Spread `props` on your button (`v-bind="props"`): it carries `aria-haspopup`, `aria-expanded`, `aria-controls`, the click and a ref, so the panel opens from it and focus returns to it. With a trigger, SortMenu renders even while unsorted.
  - Both already take `v-model:open` to open and close them from outside.
  - `FilterTriggerProps` is exported.
- 1d04494: `FormField` takes `softLimit` for a recommended length, such as a 60-character title. The counter counts against it, and past it the count turns warning, in medium weight with a small warning triangle, and screen readers hear "Longer than recommended". The control stays valid: no danger colour, no `aria-invalid`, and the value still saves. A `maxLength` set as well stays the hard limit in danger, and takes over the counter once it's passed. New labels: `softCounterLabel` (`'{count} of {max} recommended characters'`) and `overSoftLabel` (`'Longer than recommended'`).
- e8b744d: `Icon` draws four more icons, 118 in all: `smile`, `lock`, `redo` and `keyboard`. Their common names resolve too: `emoji`, `lock-keyhole`, `redo-2` and `keys`.
- 346344d: `SegmentedControl` takes `block` to fill its row: the segments share the width evenly, centred, and long labels truncate with an ellipsis. For phone tab bars. `SegmentedControlProps` is exported.
- d45569f: `Table` takes `rowHeight` (px) to set its rows and header between the two sizes, such as 44; cells keep their side padding and drop the vertical one. It works through a new `--sui-table-row` token, which an app can also set on `:root` to put every table at one height. `headerTone="canvas"` lays the header on the page colour, for a table directly on the canvas; a sorted header stays accent-wash. The defaults are unchanged.
- 8c8525f: `Tag` takes `pressable` to become a toggle chip for quick choices, bound to `v-model:pressed`, with `disabled`. It renders a `<button type="button" aria-pressed>`, 28px tall with 13px medium text: off on a surface with a line border, on in accent-wash with an accent-line border, accent text and a leading check. Group several in a `role="group"` with a label. A plain Tag is unchanged.
- d7cb065: Toasts take actions: `toast.success('Post approved', { action: { label: 'Undo', onClick: undo } })`, or `actions` with up to two (any more are ignored). They sit after the message as small `ghost-inverse` buttons, then a hairline and the close button; pressing one runs `onClick` and closes the toast.
  
  - A toast with an action stays 6s by default instead of 3s, and a thin bar at its bottom counts down. Hovering or focusing the toasts pauses the bar and the timer together. Summary and detail truncate to one line, so keep them short.
  - `onDismiss(reason)` reports why a toast left: `'action'`, `'close'` (the close button or Escape) or `'timeout'`. When an undo toast times out, nothing runs and the change stands.
  - The `Toaster` preview takes `action`, `actions` and `life` too, and its `close` event now passes the reason as a second argument.
  - `ToastAction` and `ToastDismissReason` are exported.
- b698fea: `toast.warning(summary, options)` adds a fourth severity, led by a warning-mid dot. It's announced politely, like info and success; only errors interrupt. `ToastSeverity` includes `'warning'`.

### Patch Changes

- e32cd57: `Avatar`'s `size` also takes a number of px. 20 is the supported off-scale size, for list rows and activity feeds, with a 10px initial; the initial steps up with the size (11px up to 28, xs up to 36, sm above). The named sizes are unchanged.

## 0.5.0

### Minor Changes

- 25b79a2: `Board` drags with pointer events instead of the browser's drag and drop, so cards move with a finger too. A mouse drags once it moves a few pixels, so a click still clicks. A finger drags after a short press, so a swipe still scrolls the page. A copy of the card follows the pointer, a column scrolls near its top and bottom, the board scrolls near its sides, and Escape cancels. `move` is emitted as before.
  
  Cards are buttons only when you listen to `card-click` (Enter and Space open them, as before). Without a listener, the card slot carries its own link or buttons, so a card with a menu no longer nests buttons. `cardFrame: false` drops the card's border, padding and surface, for a slot that draws its own.
- 3edfb69: - `FilterChip` takes a `summary` (`{ field, op, value }`, each optional) to word the chip yourself, in place of the field, operator and value it reads by default: "Not archived", "Last message in the last 7 days". The `FilterSummary` type is exported.
  - A `FilterField` can set `sortDir: 'desc'` so `SortMenu` starts it newest first when picked; fields start ascending by default, as before.
  - A boolean `FilterChip` with no value yet leaves Yes and No unpicked; it used to show No as chosen while the chip read empty.
- 81a3512: `TableColumn` takes `wrap: true` to let a cell's content run onto more lines, such as a name over a two-line summary. Cells still truncate to one line by default.

## 0.4.2

### Patch Changes

- 4599a4f: `Popover`'s panel no longer shows the browser's focus outline. Since 0.4.0 the panel takes focus when it opens without an `[autofocus]` field inside, and browsers drew their default outline around it.

## 0.4.1

### Patch Changes

- ebbc435: - `AlertDialog` opens above an open `Dialog` and the floating `ActionBar` (z-index 1160). Mounted once near the app root, it used to sit behind any dialog it was asked from, since layers on one z-index stack in the order they mount.
  - `Popover` stays inside the window: its panel is never taller than the room on the side it opens to, keeps 8px from the window's edge, and scrolls inside when its content is taller.

## 0.4.0

### Minor Changes

- ece7e43: - `PropertyList` takes a `field-<id>` slot to draw a field of its own, such as a server-backed picker. It gets `id` (for the label), `value` and `update(value)`, and `update` saves and emits `change` like the built-in fields.
  - `Editable` puts `class` on the value in the page, which the editing textarea overlays, instead of only on the textarea, so a class like `-ml-3` lines it up. Leaving it untouched no longer saves: an empty value stays as it came instead of becoming `null`.
  - `Popover` moves focus into the panel when it opens (an `[autofocus]` field inside, or else the panel itself), so Tab and Escape work at once. Focus goes back to the trigger when it closes with focus inside, and stays on what you pressed when you click outside. It no longer traps focus: with a trap, a click on a field outside could lose focus to the page. A new `width` prop (default `16rem`) sets the panel's width.
  - `Collapsible` can be folded again after `filled` opens it.
  - `Dialog`'s title is a single heading; it used to be an `h2` inside an `h2`. A `title` slot now goes straight into that heading, so don't wrap it in one.
  - `Calendar` names the weekdays in its `locale` (L M M J V S D in French), matching the month. Pass `weekdays` to set them yourself.
- 2a3d519: `Select` handles a search answered by your server:
  
  - `:filter="false"` shows `options` as they are, for when you replace them on `query-change`. `filter` also takes a function `(option, query) => boolean`, to match on more than the label.
  - `selectedOptions` names chosen values that aren't in `options`, such as a saved choice while `options` holds search results. An option picked from the list keeps its name after `options` change, without it.
  - `clearable` lets a single choice be removed: it shows as a removable tag in the filter row, and Backspace there clears it, as with `multiple`. The model becomes `null`.
  - When `createOption` rejects, the typed text stays and `create-error` is emitted with the error, instead of an unhandled rejection. A second Enter while it's pending does nothing.
  - Clicking the trigger of an open list closes it; it used to close and reopen.
- 984eed6: `Input`, `Textarea` and `Select` rest on a softer border (`line-strong`) and darken to `ink-muted` on hover, so forms look calmer and hovering a field is visible. Focus is unchanged. Checkbox and Radio keep the stronger `line-control` border.
- 7056835: Fields (`Input`, `Textarea`, `Select` and `Editable`) show keyboard focus as their accent border with a soft 3px halo, instead of a 2px accent outline. Buttons, checkboxes and menu items keep the outline. Apps can tune the halo with `--sui-focus-ring`.

### Patch Changes

- d4fca76: `Radio` hovers like `Checkbox`: its border turns `accent-solid`, and an invalid radio keeps its danger border on hover.
- f4cb825: `Popover`, `Select`, `DropdownMenu`, `FilterChip`, `FilterMenu` and `SortMenu` open above a `Dialog` they're inside instead of behind it. Every floating layer now shares the Dialog's z-index (1100), so the one opened last is on top. If your app stacks its own overlays against these panels, they were at 1000.

## 0.3.0

### Minor Changes

- 222a612: `Icon` draws 36 more icons from the set, so they no longer need an app icon: `lightbulb`, `square-pen`, `message-square`, `messages`, `message-quote`, `reply`, `send`, `image`, `images`, `captions`, `globe`, `webhook`, `external-link`, `calendar-check`, `calendar-x`, `calendar-clock`, `clock`, `history`, `split`, `merge`, `layers`, `undo-2`, `list-checks`, `maximize`, `minimize`, `panel-right`, `panel-right-close`, `sun-moon`, `sun`, `moon`, `circle-dashed`, `circle-half`, `circle-check`, `circle-alert`, `triangle-alert` and `key-round`. Common names resolve to them too, among them `thread` (messages), `collection` (layers), `focus` (maximize), `warning`, `error` and `success`. Icons an app adds with `setIconResolver` still win over the set.

## 0.2.2

### Patch Changes

- 4188e73: Button rendered as a link (`as="a"` or `asChild`) is no longer underlined by the app's link styles.

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
