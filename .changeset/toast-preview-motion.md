---
'@sparklingopinions/sparkling-ui': minor
---

`Toaster`'s `preview` can now stand in for live toasts in a demo. Give each preview item an `id` and its toasts animate in and out as you add and remove items, as live ones do; their close button emits `close` with the item's `id` (or its index without one), so you can remove it. A preview that never changes renders as before.
