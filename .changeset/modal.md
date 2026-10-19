---
'@sparklingopinions/sparkling-ui': minor
---

`Modal` (`v-model:open`, `title` or a `title` slot, `closable`, `size` `md`/`lg`/`xl`, `headerless`, and a standard footer from `confirmLabel`, `confirmIcon`, `confirmDisabled` and `cancelLabel`, emitting `confirm` and `cancel`, or a `footer` slot), and `ConfirmDialog` with `useConfirm()`, which returns a promise: `await confirm({ title, message, confirmLabel, confirmVariant: 'danger' })` is true when confirmed and false when cancelled or dismissed. Mount one `<ConfirmDialog />` near the app root.
