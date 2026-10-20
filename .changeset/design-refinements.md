---
'@sparklingopinions/sparkling-ui': minor
---

Refinements from the Sparkling UI design system.

- **Breaking:** `EmptyState` takes an `icon` (an icon name such as `users`, `inbox` or `search`) instead of `emoji`, drawn in a tile with `tone` `accent` (default, a list waiting to be filled) or `neutral` (no matches, a filtered view).
- **Breaking:** `ToastMessage` is no longer exported. To draw toasts in place (docs, designs), pass `preview` to `Toaster`: `<Toaster :preview="[{ summary: 'Reply sent', severity: 'success' }]" />`.
- Toasts have more room: 8px radius, the detail on its own line under the summary, a larger close button.
- `SegmentedControl` sits on a sunken track with a hairline, and the chosen segment has one too, so it reads on any surface.
- `ErrorSummary` is a quieter danger-tinted notice with an icon, its list in body text.
- `Kbd` is drawn as a raised key; `Tooltip` text is 12px medium.
