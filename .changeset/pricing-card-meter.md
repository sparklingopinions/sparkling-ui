---
'@sparklingopinions/sparkling-ui': minor
---

Two new components:

- `PricingCard`: one plan a person can choose. It shows the plan's `name`, `price` and `period`, an optional `description` and accent `badge`, and a full-width button (`actionLabel`, default "Choose") that emits `select`. `highlighted` marks the recommended plan with an accent border and a primary button; `loading` and `disabled` cover the button's states. A default slot adds lines under the button, and the `action` slot replaces the button.
- `Meter`: a thin bar for how much of a limit is used. It takes `value`, an optional `reserved` amount drawn after it in a lighter shade, `max`, a `tone` (`neutral`, `warning`, `accent`), a required `label` and an optional `valueText`. It clamps to `max` and is a `role="meter"` for assistive tech; put the numbers beside it.
