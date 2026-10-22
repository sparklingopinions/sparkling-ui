---
'@sparklingopinions/sparkling-ui': minor
---

A new `ContextMenu`: DropdownMenu's items opened at the pointer, for right-click on rows and cards. It takes the same `items` (icons, shortcuts, separators, danger, confirm-first) and emits the same `click-item`, `show` and `hide`, plus `update:open`.

```vue
<ContextMenu :items="items" label="Post actions" @click-item="run">
  <PostRow tabindex="0" />
</ContextMenu>
```

- The default slot is the target, rendered with no wrapper of its own; make it focusable.
- From the keyboard, Shift+F10 or the Menu key opens it at the focused target with its first item focused. Arrow keys, Home, End and typeahead move; Escape closes and returns focus to the target.
- It opens at the pointer and stays inside the window. `disabled` lets the browser's own menu through.
- Keep every action reachable from a visible control too, such as the row's More menu: context menus aren't discoverable.
