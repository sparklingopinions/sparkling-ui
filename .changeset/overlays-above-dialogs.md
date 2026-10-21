---
'@sparklingopinions/sparkling-ui': patch
---

`Popover`, `Select`, `DropdownMenu`, `FilterChip`, `FilterMenu` and `SortMenu` open above a `Dialog` they're inside instead of behind it. Every floating layer now shares the Dialog's z-index (1100), so the one opened last is on top. If your app stacks its own overlays against these panels, they were at 1000.
