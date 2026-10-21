---
'@sparklingopinions/sparkling-ui': patch
---

`Popover`'s panel no longer shows the browser's focus outline. Since 0.4.0 the panel takes focus when it opens without an `[autofocus]` field inside, and browsers drew their default outline around it.
