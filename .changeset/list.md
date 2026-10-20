---
'@sparklingopinions/sparkling-ui': minor
---

`List`: a grouped list of one-line rows under sticky, collapsible group headers, for scanning and acting on many records (a loops inbox, people by stage). `groups` (`id`, `name`, `count`, `items`); `leading`, `title`, `meta` and `group-leading` slots draw each row; an item's `depth` indents it as a child. `@row-click` opens rows on click, Enter or Space; ↑ ↓ or j k move between them. `selectable` adds a checkbox gutter bound to `v-model:selected` that shows on hover, and on every row once anything is selected; x selects the focused row. `v-model:collapsed` holds the collapsed group ids, `@new` adds a + to each group header, `loading` draws skeleton rows and the `empty` slot shows when every group is empty. `headingLevel`, `newLabel` (`{group}` is the group's name), `collapseLabel`, `expandLabel` and `selectLabel` fit the page and translate.
