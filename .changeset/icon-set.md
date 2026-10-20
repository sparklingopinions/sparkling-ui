---
'@sparklingopinions/sparkling-ui': minor
---

`Icon` ships with the library's own set of 78 icons, so it works with no setup: `<Icon name="users" />`. Names are neutral (`users`, `building`, `calendar-today`, `cycle`, `more-vertical`, `bell`, `chart`, `funnel`, `plug`...); older names such as `people`, `companies`, `today`, `loops` and `dot-vertical`, and common ones such as `x`, `trash-2` and `pencil`, resolve as aliases. `iconNames` lists the set. `setIconResolver` now adds to the set: names it returns a component for win, so an app can keep its own icons and replace any of the library's. OptionsMenu's default `buttonIcon` is `more-vertical`.
