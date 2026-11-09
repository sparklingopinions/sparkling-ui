---
'@sparklingopinions/sparkling-ui': minor
---

`SplitButton`: a main action joined to a chevron that opens the other ways to do it, `<SplitButton :items="items" menu-label="More ways to approve" @click="approve" @click-item="run">Approve</SplitButton>`. It takes Button's `variant`, `size` and `disabled`, and the menu's `items`; the chevron turns off when there are none. `Button` gains `attached: 'start' | 'end'`, which squares its corners on the side that meets a neighbour.
