---
'@sparklingopinions/sparkling-ui': minor
---

Toaster: `position` places live toasts at `bottom-center` (the default), `bottom-left`, `bottom-right`, `top-center`, `top-left` or `top-right`. New tokens keep them clear of your own chrome: `--sui-toaster-inset-top`, `-right`, `-bottom` and `-left` (0px by default) for a sidebar or a tab bar, set on `:root`, under a media query, or on an element around the Toaster, so they can change per route or breakpoint; `--sui-toaster-margin` (1.25rem) is the gap to those edges and `--sui-toaster-width` (24rem) the width. The safe area is now added to the edge they sit on, on top of the inset. From the top, toasts slide in from above, with the newest nearest the edge. With reduced motion, toasts fade in and out instead of sliding and collapsing.
