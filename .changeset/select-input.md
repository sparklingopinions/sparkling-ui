---
'@sparklingopinions/sparkling-ui': minor
---

`SelectInput`: a field (drawn by the `trigger` slot, which gets `onClick`) that opens a filterable list. `v-model` holds an item (`{ id, name, color? }`), or an array with `multiple`, shown as removable tags. Type to filter, arrow keys and Enter to pick; Backspace removes the last choice. `can-create` with `create-fn` offers to create what was typed (`create-colored` gives it a tag colour); `query-change` reports the query for searching elsewhere; `loading` shows a spinner; `inline` opens over its trigger. An `option` slot draws each option, and long lists render only the rows in view. `label` names the list ("Options"); the other texts are props too. `Popover` gains `alignOffset`.
