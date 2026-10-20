---
'@sparklingopinions/sparkling-ui': minor
---

One `Select` for every choice, and `Editable` for every value edited in place (breaking).

- **`Select`** replaces `SelectInput`. Bind its value with `v-model` (a value, or an array with `multiple`) and pass `options` (`value`, `label`, optional `color` to show it as a Tag, optional `disabled`). It draws a bordered trigger (`size` `md` 36px or `sm` 28px); `searchable` adds a filter row, on by default for `multiple`, `canCreate` or more than 8 options; `multiple` holds tags; `canCreate` offers to create what was typed, through `createOption` (by default the new option's value is its label). Also `loading`, `invalid`, `placeholder`, `searchPlaceholder`, `emptyLabel`, `createLabel`, `removeLabel`, `side`, `align`, `panelWidth`, the `query-change` event for searching on a server, and `trigger` and `option` slots. Inside a `FormField` it's wired like a text field.
- Moving from `SelectInput`: `items` (`{ id, name, color }`) become `options` (`{ value, label, color }`), and the model holds values, not items; `createFn` becomes `createOption`; `inputPlaceholder` becomes `searchPlaceholder`, `emptyPlaceholder` `emptyLabel`, and `label` the trigger's `aria-label`; the `trigger` slot's `onClick` and `expanded` become `toggle` and `open`, plus `selected`; the `option` slot's `item` becomes `option`; `inline` is gone: draw an inline trigger in the slot.
- **`Editable`** replaces `InlineFormInputText`, `InlineFormInputTitle` and `InlineFormInputSelect`, with `variant` `text`, `multiline` (was `multipleRows`), `select` (with `options`) or `title`. Every variant can now be reached with Tab.
- **`PropertyList`** fields take a `type` (`text`, `multiline` or `select`), `options` and `disabled` instead of a `component` and `props`.
