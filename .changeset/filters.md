---
'@sparklingopinions/sparkling-ui': minor
---

View filters and sort. All three open a 340px panel with the live result count (`status`) and the ↵ and Esc hints in its footer.

- `FilterChip`: a filter read as a sentence ("Stage is any of Lead, Customer"; "3 stages" past two values, with `valueLabel`). `field` and `type` (`text`, `enum`, `person`, `company`, `date`, `number`, `boolean`); `v-model:op` picks from `operators` (English ones by type, as `{ value, label, noValue }`, exported as `filterOperators`), and `v-model` holds the value. The panel edits it by type, applying as you go: a checklist of `options` (with a search above six, hue dots and counts) for enum, person and company, an input for text and number, `datePresets` for date, and Yes / No for boolean. Operators with `noValue` ("is empty") hide the editor. The default slot replaces the editor; `@remove` adds Remove; `v-model:open` opens a chip just added. `kind="add"` is the dashed "+ Filter".
- `FilterFieldPicker`: the field list behind "+ Filter" (or, `as="button"`, the header's Filters button, tinted while `inUse` has fields). A "Filter by…" search, `fields` grouped by `group` with a tile for their type, "In use" marks; ↑ ↓ and Enter pick, emitting `pick` with the field's name.
- `SortControl`: one sort per view, `v-model` as `{ name, dir }` or null. As a chip it reads "Name, A → Z" and shows only while sorted; `as="button"` is the header's Sort button (`disabled` for boards). The panel lists `options` with type tiles, a direction switch worded for the field's type (`directionLabels`, defaults in `sortDirections`) and Clear sort.

Every label is a prop with an English default.
