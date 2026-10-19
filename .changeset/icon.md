---
'@sparklingopinions/sparkling-ui': minor
---

`Icon` and `setIconResolver`. Register the app's icons once (`setIconResolver((name) => component)`), then render one with `<Icon name="mail" />`. `color` takes a colour role (`ink-muted`, `accent`, `danger`...) and sets stroke and fill; `label` names a meaningful icon, otherwise it's hidden from assistive tech.
