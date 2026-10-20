---
'@sparklingopinions/sparkling-ui': minor
---

`Table`: a data table with a sunken header strip, 57px rows (40px with `size="sm"`), sunken hover. `columns` (`key`, `label`, `width`, `align`, `sortable`) and `rows`, identified by `rowKey` (`id` by default). Sortable headers cycle ascending, descending and unsorted through `v-model:sort` and set `aria-sort`; `selectable` adds a checkbox column bound to `v-model:selected`, with an indeterminate select-all. `@row-click` makes rows clickable. Draw a cell with a `cell-<key>` slot (`row`, `value`); empty cells show a muted dash. `loading` draws skeleton rows, the `empty` slot shows when there are no rows, an `error` slot replaces the body, and the `footer` slot is a strip for a rows-per-page Select and Pagination. Below 720px wide it scrolls sideways; set `--sui-table-min` to change that. `caption`, `selectAllLabel` and `selectRowLabel` name it for screen readers.

`Checkbox` takes `indeterminate`: a dash for "some of these", announced as mixed.
