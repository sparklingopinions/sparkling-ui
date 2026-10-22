---
'@sparklingopinions/sparkling-ui': minor
---

- `FilterChip` takes a `summary` (`{ field, op, value }`, each optional) to word the chip yourself, in place of the field, operator and value it reads by default: "Not archived", "Last message in the last 7 days". The `FilterSummary` type is exported.
- A `FilterField` can set `sortDir: 'desc'` so `SortMenu` starts it newest first when picked; fields start ascending by default, as before.
- A boolean `FilterChip` with no value yet leaves Yes and No unpicked; it used to show No as chosen while the chip read empty.
