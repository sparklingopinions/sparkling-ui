---
'@sparklingopinions/sparkling-ui': minor
---

`Board`: records as cards in columns by a field (a stage, a status), dragged between columns. `columns` (`id`, `name`, an optional `icon` and `iconColor`, `items`); the `card` slot draws a card (its `name` by default) and the `count` slot replaces a column's count. Dropping a card emits `move` with its id, the column and its index there; `sortable` also reorders within a column. Cards are focusable and emit `card-click` on click, Enter or Space. `@new` adds a dashed "New" button to each column, shown on hover. It fills its parent's height and each column scrolls on its own; `:fill="false"` sizes columns to their cards. `loading` draws skeleton cards; `headingLevel`, `newLabel` and `emptyLabel` fit the page and translate. Dragging needs a pointer, so offer another way to change the field, such as a Select on the record.
