---
'@sparklingopinions/sparkling-ui': minor
---

Toasts: mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)` or `toast.error(...)` from anywhere, with `{ detail, life, closable }` (3s by default; `life: 0` stays until closed). They pause while hovered, and F8 focuses them. `ToastMessage` draws one toast on its own, for previews.
