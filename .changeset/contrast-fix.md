---
'@sparklingopinions/sparkling-ui': minor
---

Every text pair now meets WCAG AA (4.5:1) in light and dark, with the colour values Claude Design proposed for MustLoop. Muted and subtle greys are darker in light mode; the accent and danger text colours change, and new fill roles carry the buttons: `--sui-accent-solid` and `--sui-danger-solid`, with `--sui-danger-hover`. Hovers deepen in both modes. `--sui-ink-faint` (placeholders) is now as dark as `--sui-ink-muted`; `--sui-mark-faint` keeps the old faint grey for dots and scrollbars. Pills colour their text with the status's solid colour (`--sui-success`, `--sui-warning`, `--sui-info`), and the light orange and pink avatar inks are darker. If you override colour roles, keep text roles and fill roles apart.
