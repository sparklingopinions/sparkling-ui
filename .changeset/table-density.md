---
'@sparklingopinions/sparkling-ui': minor
---

`Table` takes `rowHeight` (px) to set its rows and header between the two sizes, such as 44; cells keep their side padding and drop the vertical one. It works through a new `--sui-table-row` token, which an app can also set on `:root` to put every table at one height. `headerTone="canvas"` lays the header on the page colour, for a table directly on the canvas; a sorted header stays accent-wash. The defaults are unchanged.
