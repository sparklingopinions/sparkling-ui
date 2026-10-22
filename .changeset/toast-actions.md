---
'@sparklingopinions/sparkling-ui': minor
---

Toasts take actions: `toast.success('Post approved', { action: { label: 'Undo', onClick: undo } })`, or `actions` with up to two (any more are ignored). They sit after the message as small `ghost-inverse` buttons, then a hairline and the close button; pressing one runs `onClick` and closes the toast.

- A toast with an action stays 6s by default instead of 3s, and a thin bar at its bottom counts down. Hovering or focusing the toasts pauses the bar and the timer together. Summary and detail truncate to one line, so keep them short.
- `onDismiss(reason)` reports why a toast left: `'action'`, `'close'` (the close button or Escape) or `'timeout'`. When an undo toast times out, nothing runs and the change stands.
- The `Toaster` preview takes `action`, `actions` and `life` too, and its `close` event now passes the reason as a second argument.
- `ToastAction` and `ToastDismissReason` are exported.
