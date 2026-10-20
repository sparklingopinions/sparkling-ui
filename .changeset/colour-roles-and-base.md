---
'@sparklingopinions/sparkling-ui': minor
---

Colour roles to theme the components with. `sparkling-ui/tailwind.css` now defines `--sui-<role>` RGB channels (surfaces, lines, ink, contrast, accent, success, warning, danger, info, inverse and scrim) with the base theme's light and dark values, the `bg-sui-*`, `text-sui-*` and other colour classes over them, off-scale text sizes (`text-13`, `text-12.5` and so on) and `tracking-snug`/`tracking-caps`, and a `dark:` variant on `[data-mode='dark']`. Import it at the end of your Tailwind entry, after your own theme, and set the roles you want to change for `:root` and `[data-mode='dark']`.

`sparkling-ui/base.css` is new and optional: themed text colour and page background, selection, and thin scrollbars.
