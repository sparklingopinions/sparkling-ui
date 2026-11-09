---
'@sparklingopinions/sparkling-ui': minor
---

`Drawer`: a non-modal panel pinned to one edge of its container, `<Drawer :open="open" side="end" width="340px" :floating="covers">…</Drawer>`. It slides in and out (none with reduced motion); closed, it turns hidden and inert once it has slid out, and gives the focus back if it held it. `floating` raises it with the floating shadow where it covers content. Its container is `position: relative` and clips it (`overflow: clip`), so a closed drawer never widens the page.
