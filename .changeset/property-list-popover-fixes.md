---
'@sparklingopinions/sparkling-ui': minor
---

- `PropertyList` takes a `field-<id>` slot to draw a field of its own, such as a server-backed picker. It gets `id` (for the label), `value` and `update(value)`, and `update` saves and emits `change` like the built-in fields.
- `Editable` puts `class` on the value in the page, which the editing textarea overlays, instead of only on the textarea, so a class like `-ml-3` lines it up. Leaving it untouched no longer saves: an empty value stays as it came instead of becoming `null`.
- `Popover` moves focus into the panel when it opens (an `[autofocus]` field inside, or else the panel itself), so Tab and Escape work at once. Focus goes back to the trigger when it closes with focus inside, and stays on what you pressed when you click outside. It no longer traps focus: with a trap, a click on a field outside could lose focus to the page. A new `width` prop (default `16rem`) sets the panel's width.
- `Collapsible` can be folded again after `filled` opens it.
- `Dialog`'s title is a single heading; it used to be an `h2` inside an `h2`. A `title` slot now goes straight into that heading, so don't wrap it in one.
- `Calendar` names the weekdays in its `locale` (L M M J V S D in French), matching the month. Pass `weekdays` to set them yourself.
