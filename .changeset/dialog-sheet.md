---
'@sparklingopinions/sparkling-ui': minor
---

`Dialog` takes `presentation="sheet"` to show as a bottom sheet, or `"auto"` to be a sheet on viewports narrower than `sheetBelow` (640px by default) and a dialog above it. `dialog` stays the default.

- The sheet sits full width at the bottom with rounded top corners (a new `--sui-radius-sheet` token, 1.25rem), a grab handle, the title row, a scrolling body and a sticky footer. The confirm runs full width at 48px with the `hint` centred above it, and the footer clears the device's safe area.
- Drag the handle or title row down and the sheet follows; let go past a third of its height, or with a flick, and it closes, otherwise it springs back. A tap on the scrim and Escape close it too, so it draws no Cancel button. Each of these emits `cancel`.
- It slides up from the bottom and back down, without animation when reduced motion is on.
- `:closable="false"` hides the close button but keeps a Close that appears on keyboard focus, so keyboard and screen-reader users can always leave.
- Focus, labelling and the ⌘/Ctrl Enter confirm work as in a dialog. A sheet doesn't draw `band` or the `hero` slot.
