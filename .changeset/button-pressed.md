---
'@sparklingopinions/sparkling-ui': minor
---

Button: `pressed` makes it a toggle. It sets `aria-pressed` and draws the button on: an 18% on-inverse wash for `ghost-inverse` (22% hovered, past hover's 12%, and white text still holds 4.5:1), and the accent wash for `ghost` and `secondary` (accent-soft hovered). It works with `iconOnly` at every size. Leave `pressed` unset on a plain button.

New `Toolbar`: a `role="toolbar"` row for your own controls, named by `label`. Tab enters it once; the arrow keys move between its controls (skipping disabled ones, wrapping unless `loop` is false), Home and End jump to the ends. `orientation="vertical"` uses up and down. It draws no surface, so it fits a bubble menu on an inverse ground or a bar on the page.
