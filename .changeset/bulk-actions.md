---
'@sparklingopinions/sparkling-ui': minor
---

What a bulk action needs, shared instead of rebuilt per app: ActionBar actions take a `shortcut` (a key that runs them while records are selected, shown on the button), `options` (a menu; picking one emits `click-item` with its `value`) and a `disabledReason` tooltip; `toast.undo(summary, undo)` is a receipt whose Undo runs only when pressed and says why a refused undo failed; `settleEach(items, run)` runs an action on each record and returns the ones done and the ones refused with the server's reason (`errorMessage`).
