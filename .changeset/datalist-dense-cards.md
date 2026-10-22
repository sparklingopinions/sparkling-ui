---
'@sparklingopinions/sparkling-ui': minor
---

DataList, for denser cards and richer selection:

- `groupHeaderTone` (`sunken`, `surface` or `canvas`; by default sunken when joined, surface as cards) and `groupHeaderHeight` in px (36 by default, sets `--sui-list-header`).
- `collapsible`: `false` drops the chevron, for the list or per group through the group's own `collapsible`. A new `group-actions` slot puts controls at the end of a header, such as Show and Hide.
- `rowHeight` in px (40 by default, sets `--sui-list-row`), and `dividers` for a hairline between rows.
- `checkboxPlacement="leading"`: the checkbox takes the place of the `leading` slot's first mark on hover, on focus, and on every row once anything is selected. While anything is selected, a click on a row toggles it instead of opening it. The `leading` slot now also gets `selected`, `selecting` and `toggle`.
- Selecting anywhere: shift-click selects a range from the row last toggled, Cmd or Ctrl-click toggles one row, Shift+↑ ↓ extends the selection, and Shift+Space selects a range.
- `contextItems(item)` puts a ContextMenu on each row, named by `contextLabel`, and emits `context-item` with the chosen action and its row. Disabled items work as in ContextMenu.

The arrow keys now skip rows in collapsed groups.
