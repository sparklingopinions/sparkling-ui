---
'@sparklingopinions/sparkling-ui': minor
---

`Select` handles a search answered by your server:

- `:filter="false"` shows `options` as they are, for when you replace them on `query-change`. `filter` also takes a function `(option, query) => boolean`, to match on more than the label.
- `selectedOptions` names chosen values that aren't in `options`, such as a saved choice while `options` holds search results. An option picked from the list keeps its name after `options` change, without it.
- `clearable` lets a single choice be removed: it shows as a removable tag in the filter row, and Backspace there clears it, as with `multiple`. The model becomes `null`.
- When `createOption` rejects, the typed text stays and `create-error` is emitted with the error, instead of an unhandled rejection. A second Enter while it's pending does nothing.
- Clicking the trigger of an open list closes it; it used to close and reopen.
