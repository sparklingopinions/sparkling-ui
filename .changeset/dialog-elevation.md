---
'@sparklingopinions/sparkling-ui': minor
---

A new look for dialogs and everything that floats or that you press, after Linear: it reads as well in dark as in light.

- **Dialog** opens near the top (`--sui-dialog-offset`, 12vh) over a light dim with no blur, as one raised piece with a hairline edge: no header divider, no tinted footer and **no Cancel button** (Escape and the close button cancel; `cancelLabel` is deprecated and ignored). It draws the ⌘ or Ctrl ↵ shortcut as keys next to its confirm, so drop "⌘ Enter to save" from your `hint`. A new `context` slot sits before the title behind a chevron, for where the thing lands: plain text, or a picker such as a `Button size="xs" variant="secondary"`. The sheet and AlertDialog get the same ground and edge; AlertDialog keeps its Cancel.
- **New colour roles**: `raised` and `edge` for floating layers (Dialog, sheet, AlertDialog, Popover, PopoverDialog, Select and menu panels), `fill`, `fill-hover` and `fill-line` (ink at a low alpha) for anything that sits on a ground, `track` and `lifted` for segmented controls, plus `--sui-shadow-floating`, `--sui-shadow-lifted` and `--sui-scrim-alpha`. The fills carry their own alpha: don't add an opacity modifier to them.
- **One control height**: `--sui-control-height` is 32px, shared by Button md, Input and Select; button text is 13px.
- **Fields** (Input, Textarea, Select) are a soft fill instead of a bordered white box. `Textarea` takes `bare` for text that is the content itself, filling a dialog with no box.
- **Buttons**: secondary is a soft fill; every filled variant turns neutral when disabled instead of fading; ghost and menu hovers lighten in dark instead of darkening.
- **SegmentedControl** and the sort direction toggle lift the chosen segment out of a darker track. **Kbd** is a soft key without the heavy bottom edge. Pressable **Tag** and **FilterChip** are pills. Popovers round to 12px like the other panels.
- **Contrast**: `ink-muted` and `ink-faint` are a step darker in light (105 105 111) and lighter in dark (152 152 159), and the default dark `accent` is lighter (154 144 255), so text keeps 4.5:1 on the new fills.
