---
'@sparklingopinions/sparkling-ui': minor
---

`Pagination`, a table paginator: first, previous, the pages with gaps (1 … 7 8 9 … 40), next and last, with the current page as a solid accent tile. Bind the page with `v-model:page` and pass `pageCount`; `siblingCount` and `boundaryCount` (1 each) set how many pages show around the current one and at each end, `showEnds` (on) the first and last buttons, and `disabled` turns it all off. Translate it with `label`, `firstLabel`, `previousLabel`, `nextLabel`, `lastLabel` and `pageLabel` (`Page {page}`).
