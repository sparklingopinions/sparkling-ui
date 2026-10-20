---
'@sparklingopinions/sparkling-ui': minor
---

`BulkActions`: actions on the records selected in a Table or List, as a pill floating at the foot of the viewport (`:floating="false"` draws it in place). It shows only while `count` is above zero, as a toolbar named by `label` (`{count} selected`). `actions` (`label`, `action`, `icon`, `variant: 'danger'`, `disabled`) render as small secondary buttons, danger ones outlined, and emit `click-item`; the default slot takes more, such as an OptionsMenu. `@clear` adds a clear button (`clearLabel`) and makes Escape clear, unless a dialog is open. Confirm destructive actions with `useConfirm`.
