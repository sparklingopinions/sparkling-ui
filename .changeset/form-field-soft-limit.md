---
'@sparklingopinions/sparkling-ui': minor
---

`FormField` takes `softLimit` for a recommended length, such as a 60-character title. The counter counts against it, and past it the count turns warning, in medium weight with a small warning triangle, and screen readers hear "Longer than recommended". The control stays valid: no danger colour, no `aria-invalid`, and the value still saves. A `maxLength` set as well stays the hard limit in danger, and takes over the counter once it's passed. New labels: `softCounterLabel` (`'{count} of {max} recommended characters'`) and `overSoftLabel` (`'Longer than recommended'`).
