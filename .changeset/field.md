---
'@sparklingopinions/sparkling-ui': minor
---

`Field`: a label, hint, error and character counter around one control, wired for assistive tech. Put a `TextInput` or `Textarea` inside and it gets the id, `aria-describedby`, `aria-required` and invalid state on its own; any other control takes the slot's `id`, `describedBy` and `invalid`. `error` replaces the hint, as an alert, and turns the control's border danger; `maxLength` adds a counter, which turns danger past the limit. `required` adds an asterisk, `optional` a muted "Optional", and `layout="inline"` puts the label in an 88px column, like LedgerRow. Set `id` on the Field, not on the control. Translate it with `optionalLabel`, `requiredLabel` and `counterLabel`.
