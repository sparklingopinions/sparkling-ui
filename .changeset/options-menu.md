---
'@sparklingopinions/sparkling-ui': minor
---

`OptionsMenu`: a trigger and a menu of actions. `items` are `{ type: 'action', label, action, icon, variant: 'danger', shortcut, confirm, confirmed }` or `{ type: 'separator' }`; a chosen action emits `click-item` with the menu's `id`, after a confirmation when `confirm` or `confirmed` is set (needs a `<ConfirmDialog />`). The default trigger is an icon button (`buttonIcon`, `buttonLabel`, `tooltip`); a `trigger` slot takes any other. The confirmation's generic wording is translatable through props. `Tooltip` now passes its attributes to its trigger.
