---
'@sparklingopinions/sparkling-ui': minor
---

`Button`: `variant` (`primary`, `secondary`, `tinted`, `ghost`, `contrast`, `danger`, `danger-outline`), `size` (`xs`, `sm`, `md`, `lg`), `pill`, `iconOnly`, `iconPosition` and `disabled`. It renders a `<button>`; `as="a"` or `asChild` style a link or a router link instead, which are marked `aria-disabled` when disabled. Attributes and listeners, `type` included, pass through to the element.

Tokens are easier to override: the defaults now have zero specificity, so an app's own `:root` rule wins wherever it sits in its CSS. New tokens: `--sui-on-danger`, and the button's `--sui-button-height`, `--sui-button-padding-x`, `--sui-button-text`, `--sui-radius-button` and `--sui-shadow-raised`.
