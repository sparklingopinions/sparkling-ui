---
'@sparklingopinions/sparkling-ui': patch
---

`Icon`: icons from the library's set now get the attributes `Icon` gives them. Decorative ones are `aria-hidden` again, and a `label` makes one a named `role="img"`. Before, only `class` and `style` reached the `<svg>`; icons from an app's resolver were unaffected.
