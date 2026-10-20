---
'@sparklingopinions/sparkling-ui': minor
---

`FilterChip`: a view's filter or sort read as a sentence ("Stage is Customer", "Name, ascending"), for the bar under a page header. `field`, `op` and `value`, with an optional `icon`; `kind="sort"` shows `dir`'s arrow, and `kind="add"` is the quiet dashed "+ Filter" that starts one. The default slot fills a panel the chip opens (`v-model:open`), such as a Select for the value, and `@remove` adds a Remove action to it. `removeLabel`, `addLabel` and `sortLabel` translate. The chip's words are its name, and the panel is named by the chip.
