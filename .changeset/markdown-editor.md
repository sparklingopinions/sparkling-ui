---
'@sparklingopinions/sparkling-ui': minor
---

Add `MarkdownEditor` and `MarkdownOutline`, from a new entry, `sparkling-ui/markdown-editor`.

`MarkdownEditor` edits a Markdown document as formatted text: headings (the toolbar offers `headingLevels`, 2 and 3 by default), bold, italic, bulleted and numbered lists, quotes and links, with Markdown shortcuts as you type and ⌘K for a link. `v-model` is the Markdown, and only edits emit it, so a value you load is kept as written until someone types. It takes a `placeholder`, or a `placeholder` slot for a faint outline of what to write; `readonly`; `toolbar: false`; a `hint` at the toolbar's end; and `labels` for every string.

`MarkdownOutline` lists the document's headings beside it: give it what the editor's `outline` event sends (the headings and the current one), and call the editor's `reveal(index)` on `select`.

It needs TipTap 3, as optional peer dependencies the main entry never imports. To use the editor, install them:

```sh
npm i @tiptap/core @tiptap/pm @tiptap/vue-3 @tiptap/starter-kit @tiptap/markdown @tiptap/extensions
```

```ts
import { MarkdownEditor, MarkdownOutline } from 'sparkling-ui/markdown-editor'
```
