---
'@sparklingopinions/sparkling-ui': minor
---

New `CopyBlock`: a block of text to copy, as code blocks do. Copy to clipboard is an icon button in the top right corner, shown while the pointer is over the block or focus is in it, and always on devices without hover; the text keeps clear of it. `text` is what's copied, and the default slot can draw it richer (a list, a lead line). `size` is `md` or `sm`; `copyLabel` and `copiedLabel` translate the tooltip. Emits `copy` with the text, or `error` when the clipboard refuses.
