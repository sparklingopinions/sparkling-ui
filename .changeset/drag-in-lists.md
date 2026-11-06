---
'@sparklingopinions/sparkling-ui': minor
---

DataList rows drag between groups (`draggable`, `@move`), to change a record's status, and `hideEmpty` leaves empty groups out except while a row is dragged. Board's drag is fixed: the card that follows the pointer is now pinned with inline styles, so an app's CSS order can't drop it into the page (it showed nowhere in apps whose `relative` won over `fixed`); it takes the floating shadow, a line marks a drop past a column's last card, and the column's New button hides while dragging. Both share one internal drag helper.
