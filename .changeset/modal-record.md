---
'@sparklingopinions/sparkling-ui': minor
---

`Dialog` is now the one dialog, and `LedgerModal` is gone (breaking).

- A record form is a Modal with a `band` (a CSS colour such as `rgb(var(--sui-hue-blue-soft))`, or `true` for the accent wash) and a `hero` slot. `LedgerModal`'s `bandClass` becomes `band`, its `band` slot becomes `hero`, and its `submit` event becomes `confirm`.
- The save hint is no longer automatic: pass `:hint="saveHint()"`, with `saveHint` exported alongside Modal (`{key} Enter to save` by default, `{key}` being ⌘ or Ctrl).
- Every Modal with a `confirmLabel` confirms on ⌘ or Ctrl Enter, unless `confirmDisabled`.
- New: `confirmVariant` (`primary`, `danger` or `contrast`), a `footer-start` slot in the standard footer, `hint`, and sizes `sm` (432px) and `record` (520px, the default with a band) besides `md`, `lg` and `xl`.
- `Collapsible`'s `filled` is optional.
