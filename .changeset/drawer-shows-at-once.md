---
'@sparklingopinions/sparkling-ui': patch
---

`Drawer` is visible the moment it opens, so whatever opens it can move the focus inside straight away (its visibility used to fade in with the slide, refusing focus for the first moments). Closing, it stays visible until the slide ends, as before.
