---
'@sparklingopinions/sparkling-ui': minor
---

`useMenuConfirm()` runs a menu item's confirmation from anywhere, so a key can do what the menu item does: `if (await ask(item)) remove()`. It asks in the item's `confirm` words (or the menu's defaults, which it takes as options), with the same buttons the menu shows, and resolves false for a disabled item or a declined ask. DropdownMenu and ContextMenu now ask through it too.
