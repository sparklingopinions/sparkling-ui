---
'@sparklingopinions/sparkling-ui': patch
---

- `AlertDialog` opens above an open `Dialog` and the floating `ActionBar` (z-index 1160). Mounted once near the app root, it used to sit behind any dialog it was asked from, since layers on one z-index stack in the order they mount.
- `Popover` stays inside the window: its panel is never taller than the room on the side it opens to, keeps 8px from the window's edge, and scrolls inside when its content is taller.
