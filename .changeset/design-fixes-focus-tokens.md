---
'@sparklingopinions/sparkling-ui': minor
---

Fixes from the Sparkling UI design system: one keyboard focus ring and controls that meet WCAG 1.4.11.

- Every interactive component shows the same focus ring on keyboard focus: 2px in `accent`, outside buttons and small controls, on the edge of fields and inset in menus, segments and options (on toasts it uses `on-inverse`). Fields lose the soft 3px halo; their border turns `accent` instead. The ring is themable with `--sui-focus-width`, `--sui-focus-offset`, `--sui-focus-offset-field` and `--sui-focus-offset-inset`, and apps can use the same `sui-ring`, `sui-ring-field`, `sui-ring-inset` and `sui-ring-inverse` utilities behind a `focus-visible:` variant.
- New colour role `line-control` for field, checkbox and radio borders, at 3:1 on canvas, surface and sunken. Fields now darken to `ink-muted` on hover. An app that overrides colours should set `--sui-line-control` too.
- Light `ink-body`, `ink-subtle`, `ink-muted` and `ink-faint` are a step darker, and the orange hue is a real orange (it was close to red).
