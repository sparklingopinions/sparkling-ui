<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from 'vue'

import type { Editor as CoreEditor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Input from '../Input/Input.vue'
import PopoverDialog from '../Popover/PopoverDialog.vue'
import Toolbar from '../Toolbar/Toolbar.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

export type MarkdownHeadingLevel = 1 | 2 | 3 | 4

/** A heading in the document, in order: what an outline lists. */
export interface MarkdownHeading {
  index: number
  level: MarkdownHeadingLevel
  text: string
}

export interface MarkdownEditorLabels {
  /** The toolbar's accessible name. */
  toolbar: string
  /** Followed by the level: "Heading 2". */
  heading: string
  bold: string
  italic: string
  bulletList: string
  numberedList: string
  quote: string
  link: string
  linkAddress: string
  linkApply: string
  linkRemove: string
  cancel: string
}

export interface MarkdownEditorProps {
  /** The editing area's accessible name. */
  label?: string
  /** Shown faintly while the document is empty. For more than a line, use the `placeholder` slot. */
  placeholder?: string
  /** Shows the document without a toolbar, and it can't be changed. */
  readonly?: boolean
  /** The formatting row above the text. Without it, Markdown typed as you go (## , - , > ) still formats. */
  toolbar?: boolean
  /** A short note at the toolbar's end, e.g. how Markdown shortcuts work. Empty hides it. */
  hint?: string
  /** The heading levels the toolbar offers. Any level in the Markdown still shows and is kept. */
  headingLevels?: MarkdownHeadingLevel[]
  labels?: Partial<MarkdownEditorLabels>
}

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
  label: 'Text',
  placeholder: undefined,
  toolbar: true,
  hint: 'Markdown works as you type: ## for a heading, - for a list',
  headingLevels: () => [2, 3],
  labels: () => ({})
})

const emit = defineEmits<{
  /** The headings and the one the caret is under (its index, or null above the first), whenever either changes. */
  outline: [headings: MarkdownHeading[], current: number | null]
}>()

defineSlots<{
  /** Shown faintly over the empty document instead of `placeholder`, e.g. headings and a line under each: plain
   *  `h2`, `h3` and `p`, styled as the document is. */
  placeholder?: () => unknown
}>()

/** The document as Markdown. Only edits emit it: a value that arrives is kept as written until someone types. */
const model = defineModel<string | null>()

const text = computed<MarkdownEditorLabels>(() => ({
  toolbar: 'Formatting',
  heading: 'Heading',
  bold: 'Bold',
  italic: 'Italic',
  bulletList: 'Bulleted list',
  numberedList: 'Numbered list',
  quote: 'Quote',
  link: 'Link',
  linkAddress: 'Address',
  linkApply: 'Apply',
  linkRemove: 'Remove link',
  cancel: 'Cancel',
  ...props.labels
}))

// What the editor last emitted or was given, so a value coming back down isn't set again (it would move the caret).
let last = model.value ?? ''
// Bumped on every transaction: the toolbar's pressed states and the empty state read the editor, which isn't reactive.
const version = ref(0)
const headings = shallowRef<MarkdownHeading[]>([])
const current = ref<number | null>(null)

const editor = useEditor({
  content: last,
  contentType: 'markdown',
  editable: !props.readonly,
  extensions: [
    StarterKit.configure({
      link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      // Underline has no Markdown of its own; it would come back as HTML.
      underline: false
    }),
    Markdown,
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' })
  ],
  editorProps: {
    attributes: () => ({
      role: 'textbox',
      'aria-multiline': 'true',
      'aria-label': props.label,
      ...(props.readonly ? { 'aria-readonly': 'true' } : {}),
      class: 'sui-markdown min-h-full px-6 py-5 outline-hidden'
    }),
    handleKeyDown: (_view, event) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openLink()
        return true
      }
      return false
    }
  },
  onCreate: ({ editor }) => readOutline(editor),
  onUpdate: ({ editor }) => {
    last = editor.getMarkdown()
    model.value = last
  },
  onTransaction: ({ editor, transaction }) => {
    version.value++
    if (transaction.docChanged || transaction.selectionSet) readOutline(editor)
  }
})

type Tiptap = NonNullable<typeof editor.value>

function readOutline(instance: CoreEditor) {
  const found: MarkdownHeading[] = []
  let here: number | null = null
  const caret = instance.state.selection.from
  instance.state.doc.forEach((node, offset) => {
    if (node.type.name !== 'heading') return
    if (offset < caret) here = found.length
    found.push({ index: found.length, level: node.attrs.level, text: node.textContent })
  })
  const changed =
    found.length !== headings.value.length ||
    found.some((h, i) => h.level !== headings.value[i]?.level || h.text !== headings.value[i]?.text)
  if (!changed && here === current.value) return
  headings.value = found
  current.value = here
  emit('outline', found, here)
}

watch(model, (value) => {
  const next = value ?? ''
  if (!editor.value || next === last) return
  last = next
  editor.value.commands.setContent(next, { contentType: 'markdown', emitUpdate: false })
})

watch(
  () => props.readonly,
  (readonly) => editor.value?.setEditable(!readonly)
)

// The placeholder is a decoration: draw it again when it changes.
watch(
  () => props.placeholder,
  () => editor.value?.view.dispatch(editor.value.state.tr)
)

const empty = computed(() => (version.value, editor.value?.isEmpty ?? !last))
const active = (name: string, attrs?: Record<string, unknown>) => (version.value, !!editor.value?.isActive(name, attrs))
const run = (command: (chain: ReturnType<Tiptap['chain']>) => ReturnType<Tiptap['chain']>) => {
  if (editor.value) command(editor.value.chain().focus()).run()
}

const marks = computed(() => [
  { key: 'bold', label: text.value.bold, icon: 'bold', on: active('bold'), toggle: () => run((c) => c.toggleBold()) },
  {
    key: 'italic',
    label: text.value.italic,
    icon: 'italic',
    on: active('italic'),
    toggle: () => run((c) => c.toggleItalic())
  }
])

const blocks = computed(() => [
  {
    key: 'bulletList',
    label: text.value.bulletList,
    icon: 'list',
    on: active('bulletList'),
    toggle: () => run((c) => c.toggleBulletList())
  },
  {
    key: 'orderedList',
    label: text.value.numberedList,
    icon: 'ordered-list',
    on: active('orderedList'),
    toggle: () => run((c) => c.toggleOrderedList())
  },
  {
    key: 'blockquote',
    label: text.value.quote,
    icon: 'quote',
    on: active('blockquote'),
    toggle: () => run((c) => c.toggleBlockquote())
  }
])

// Links: a small dialog under the toolbar's link button, from the button or ⌘K.
const linkButton = useTemplateRef<InstanceType<typeof Button>>('linkButton')
const linkOpen = ref(false)
const linkAddress = ref('')
const linkActive = computed(() => active('link'))

function openLink() {
  if (!editor.value || props.readonly) return
  linkAddress.value = (editor.value.getAttributes('link').href as string | undefined) ?? ''
  linkOpen.value = true
}

// "example.com" means https://example.com; anything with a scheme, a path or an anchor is kept as typed.
const withProtocol = (address: string) => (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(address) ? address : `https://${address}`)

function applyLink() {
  const address = linkAddress.value.trim()
  linkOpen.value = false
  if (!address) return removeLink()
  const href = withProtocol(address)
  const { empty: nothingPicked } = editor.value?.state.selection ?? {}
  if (nothingPicked && !linkActive.value) {
    run((c) => c.insertContent({ type: 'text', text: address, marks: [{ type: 'link', attrs: { href } }] }))
  } else {
    run((c) => c.extendMarkRange('link').setLink({ href }))
  }
}

function removeLink() {
  linkOpen.value = false
  run((c) => c.extendMarkRange('link').unsetLink())
}

/** Puts the caret at the end of a heading and scrolls it to the top, as an outline does when one is picked. */
function reveal(index: number) {
  const instance = editor.value
  if (!instance) return
  let position: number | null = null
  let seen = 0
  instance.state.doc.forEach((node, offset) => {
    if (position !== null || node.type.name !== 'heading') return
    if (seen++ === index) position = offset + node.nodeSize - 1
  })
  if (position === null) return
  instance.chain().setTextSelection(position).focus(undefined, { scrollIntoView: false }).run()
  const dom = instance.view.domAtPos(position).node
  const element = dom instanceof Element ? dom : dom.parentElement
  element?.closest('h1, h2, h3, h4')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
}

const focus = () => editor.value?.commands.focus()

defineExpose({ focus, reveal })

onBeforeUnmount(() => editor.value?.destroy())
</script>

<!-- A Markdown document edited as formatted text: headings, bold and italic, lists, quotes and links. -->
<template>
  <div
    class="flex flex-col rounded-xl border bg-sui-surface text-sui-ink transition-[border-color] duration-200"
    :class="readonly ? 'border-sui-line-subtle' : 'border-sui-line-subtle focus-within:border-sui-line'"
  >
    <div
      v-if="toolbar && !readonly"
      class="flex min-h-11 items-center gap-2 rounded-t-xl border-b border-sui-line-subtle px-2 py-1.5"
    >
      <Toolbar class="flex items-center gap-0.5" :label="text.toolbar">
        <Tooltip v-for="level in headingLevels" :key="level" :text="`${text.heading} ${level}`">
          <Button
            :aria-label="`${text.heading} ${level}`"
            icon-only
            :pressed="active('heading', { level })"
            size="sm"
            type="button"
            variant="ghost"
            @click="run((c) => c.toggleHeading({ level }))"
          >
            <!-- The level as text, so the visible "2" is part of the name, "Heading 2". -->
            <span class="flex items-center"
              ><Icon name="heading" /><span class="-ml-px text-11 leading-none font-semibold">{{ level }}</span></span
            >
          </Button>
        </Tooltip>
        <span aria-hidden="true" class="mx-1 h-4 w-px bg-sui-line-subtle" />
        <Tooltip v-for="tool in marks" :key="tool.key" :text="tool.label">
          <Button
            :aria-label="tool.label"
            icon-only
            :pressed="tool.on"
            size="sm"
            type="button"
            variant="ghost"
            @click="tool.toggle"
          >
            <Icon :name="tool.icon" />
          </Button>
        </Tooltip>
        <span aria-hidden="true" class="mx-1 h-4 w-px bg-sui-line-subtle" />
        <Tooltip v-for="tool in blocks" :key="tool.key" :text="tool.label">
          <Button
            :aria-label="tool.label"
            icon-only
            :pressed="tool.on"
            size="sm"
            type="button"
            variant="ghost"
            @click="tool.toggle"
          >
            <Icon :name="tool.icon" />
          </Button>
        </Tooltip>
        <Tooltip :text="text.link">
          <Button
            ref="linkButton"
            :aria-label="text.link"
            icon-only
            :pressed="linkActive"
            size="sm"
            type="button"
            variant="ghost"
            @click="openLink"
          >
            <Icon name="link" />
          </Button>
        </Tooltip>
      </Toolbar>
      <p v-if="hint" class="m-0 ml-auto truncate pr-1 text-xs text-sui-ink-muted max-md:hidden">{{ hint }}</p>
    </div>

    <!-- One grid cell for both, so a placeholder taller than the empty document makes room for itself. -->
    <div class="grid min-h-0 flex-1">
      <EditorContent class="[grid-area:1/1]" :editor="editor" />
      <div
        v-if="empty && $slots.placeholder && !readonly"
        aria-hidden="true"
        class="sui-markdown pointer-events-none px-6 py-5 [grid-area:1/1]"
        data-faint
      >
        <slot name="placeholder" />
      </div>
    </div>

    <PopoverDialog
      v-model:open="linkOpen"
      :anchor="linkButton"
      :cancel-label="text.cancel"
      :confirm-label="text.linkApply"
      :title="text.link"
      @confirm="applyLink"
    >
      <Input
        v-model="linkAddress"
        :aria-label="text.linkAddress"
        autofocus
        placeholder="https://"
        type="url"
        @keydown.enter.exact.prevent="applyLink"
      />
      <Button v-if="linkActive" class="self-start" size="sm" type="button" variant="ghost" @click="removeLink">
        {{ text.linkRemove }}
      </Button>
    </PopoverDialog>
  </div>
</template>
