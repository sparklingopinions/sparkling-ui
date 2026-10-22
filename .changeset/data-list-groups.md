---
'@sparklingopinions/sparkling-ui': minor
---

`DataList` groups can carry their own header:

- `variant="cards"` draws each group as its own bordered card, 12px apart, with headers on the surface colour that don't stick. `joined` stays the default.
- A `#group-header="{ group, count, collapsed }"` slot renders your content, such as a status Badge and a count, inside the group's heading in place of its name and count. A group's `header` does the same with plain text.
- A group's `label` is its accessible name when its header isn't just its name, and names its + button.
