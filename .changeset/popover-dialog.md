---
'@sparklingopinions/sparkling-ui': minor
---

New `PopoverDialog`, for a small decision such as a date or a link. On the desktop it's a popover under its `anchor`: an element, a component or a ref to one, so a keyboard shortcut or a button elsewhere can open it, with `v-model:open`. Without an `anchor`, it opens under the `trigger` slot's button; spread the slot's `props` on that button. Below `sheetBelow` (640px) it's a Dialog bottom sheet. Without an anchor or a trigger, it's a small dialog on the desktop.

The popover has the `title` as its heading and accessible name, your fields, and a footer with Cancel and `confirmLabel`. The confirm button emits `confirm`, as ⌘ or Ctrl Enter does; `confirmDisabled` turns it off and the `footer` slot replaces both buttons. `width` is in px (320) or any CSS width. Escape, Cancel and a click outside emit `cancel` and close it; confirming doesn't, so close it when you're done. Focus moves to an `[autofocus]` field inside, or else the panel, and goes back to what had it when it opened, or else the anchor.
