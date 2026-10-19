---
'@sparklingopinions/sparkling-ui': minor
---

`Popover`, opened from code as PrimeVue's was: give it a ref and call `toggle(event)`, `show(event, target?)` or `hide()`; it emits `show` and `hide`. It sits below its trigger (or `target`) at `offset` px (4 by default), and closes on Escape (unless `closeOnEscape` is false), an outside click, a scroll or a resize. Class and attributes go to the panel; it's named by an `aria-label`, or else by the element that opened it. The default slot gets `hide`.
