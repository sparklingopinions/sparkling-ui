---
'@sparklingopinions/sparkling-ui': minor
---

DropdownMenu and ContextMenu: an item can be `disabled`, with an optional `disabledReason` shown under its label. A disabled item stays in place, dimmed, so the menu keeps its shape. It's announced as disabled (with the reason as its description), the arrow keys still reach it and typeahead skips it. Choosing it does nothing: no `click-item`, no confirm, and the menu stays open. Show actions that don't apply this way instead of leaving them out.
