---
'@sparklingopinions/sparkling-ui': minor
---

`SortMenu` and `FilterMenu` fit a page header:

- `variant="ghost"` (with `as="button"`) draws a ghost Sort or Filters button. Without it they stay secondary, tinted while sorting or filtering.
- A `#trigger` slot draws your own opener: `#trigger="{ open, toggle, active, label, props }"` on SortMenu (`label` reads like the sort chip) and `#trigger="{ open, toggle, count, props }"` on FilterMenu. Spread `props` on your button (`v-bind="props"`): it carries `aria-haspopup`, `aria-expanded`, `aria-controls`, the click and a ref, so the panel opens from it and focus returns to it. With a trigger, SortMenu renders even while unsorted.
- Both already take `v-model:open` to open and close them from outside.
- `FilterTriggerProps` is exported.
