---
'@sparklingopinions/sparkling-ui': minor
---

DataList: while `loading`, the list draws placeholder groups in its own shape instead of plain lines: each group with its header (in the header's tone and height, with room for the chevron), rows at the list's row height with dividers when set, a leading mark when the list has a `leading` slot and meta when it has a `meta` slot, and each group its own card with `variant="cards"`. The new `loadingGroups` prop sets how many placeholder groups there are and their rows (`[4, 2]` by default).
