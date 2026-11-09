import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import MarkdownEditor, { type MarkdownHeading } from './MarkdownEditor.vue'
import MarkdownOutline from './MarkdownOutline.vue'

const GUIDE = `## Who it's for

- Teams of two to ten who share one inbox.
- People who answer customers between other work.

## Voice

- Plain and warm. **Short sentences**, one idea each.
- Say what happened, then what happens next.

## Rules

1. Never promise a date we haven't agreed.
2. Link to the help article instead of pasting it.

> When unsure, ask one question and wait.`

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Components/Forms/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    docs: {
      description: {
        component:
          'A Markdown document edited as formatted text: headings, bold and italic, lists, quotes and links, with Markdown shortcuts as you type and ⌘K for a link. `v-model` is the Markdown; only edits emit it. Import it from `sparkling-ui/markdown-editor`, with the TipTap packages installed (optional peer dependencies). Pair it with MarkdownOutline: the `outline` event gives the headings and the current one, and `reveal(index)` goes to one.'
      }
    }
  },
  args: { label: 'Writing guide' },
  render: (args) => ({
    components: { MarkdownEditor, MarkdownOutline },
    setup() {
      const value = ref(GUIDE)
      const headings = ref<MarkdownHeading[]>([])
      const current = ref<number | null>(null)
      const editor = ref<InstanceType<typeof MarkdownEditor> | null>(null)
      const onOutline = (found: MarkdownHeading[], here: number | null) => {
        headings.value = found
        current.value = here
      }
      return { args, value, headings, current, editor, onOutline }
    },
    template: `
      <div class="grid max-w-4xl grid-cols-[minmax(0,1fr)_12rem] items-start gap-8">
        <MarkdownEditor ref="editor" v-model="value" v-bind="args" @outline="onOutline" />
        <MarkdownOutline class="sticky top-4" :current="current" :headings="headings" @select="editor?.reveal($event)" />
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof MarkdownEditor>

export const WithOutline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const outline = await canvas.findByRole('navigation', { name: 'On this page' })
    await expect(
      within(outline)
        .getAllByRole('button')
        .map((b) => b.textContent?.trim())
    ).toEqual(["Who it's for", 'Voice', 'Rules'])
    await userEvent.click(within(outline).getByRole('button', { name: 'Rules' }))
    await expect(within(outline).getByRole('button', { name: 'Rules' })).toHaveAttribute('aria-current', 'location')
    await expect(canvas.getByRole('button', { name: 'Numbered list' })).toHaveAttribute('aria-pressed', 'false')
  }
}

export const Formatting: Story = {
  render: (args) => ({
    components: { MarkdownEditor },
    setup: () => ({ args, value: ref('') }),
    template: `<div class="max-w-2xl"><MarkdownEditor v-model="value" v-bind="args" /><pre class="mt-4 text-xs text-sui-ink-muted whitespace-pre-wrap">{{ value }}</pre></div>`
  }),
  args: { placeholder: 'Start with who it is for' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const doc = canvas.getByRole('textbox', { name: 'Writing guide' })
    await userEvent.click(doc)
    await userEvent.keyboard('## Voice{Enter}- Warm')
    await expect(doc.querySelector('h2')).toHaveTextContent('Voice')
    await expect(doc.querySelector('ul li')).toHaveTextContent('Warm')
    await expect(canvas.getByRole('button', { name: 'Bulleted list' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvasElement.querySelector('pre')).toHaveTextContent('## Voice - Warm')

    // ⌘K links the word picked; "example.com" gets its https://.
    await userEvent.dblClick(doc.querySelector('ul li p')!)
    await userEvent.keyboard('{Control>}k{/Control}')
    const address = await within(document.body).findByRole('textbox', { name: 'Address' })
    await userEvent.type(address, 'example.com{Enter}')
    await expect(canvasElement.querySelector('pre')).toHaveTextContent('- [Warm](https://example.com)')
  }
}

export const EmptyWithOutlinePlaceholder: Story = {
  name: 'Empty, with a placeholder outline',
  render: (args) => ({
    components: { MarkdownEditor },
    setup: () => ({ args, value: ref('') }),
    template: `
      <div class="max-w-2xl">
        <MarkdownEditor v-model="value" v-bind="args">
          <template #placeholder>
            <h2>Who it's for</h2>
            <p>The people you write to, and what they need from you.</p>
            <h2>Voice</h2>
            <p>How it sounds, in a few lines.</p>
          </template>
        </MarkdownEditor>
      </div>
    `
  })
}

export const ReadOnly: Story = {
  args: { readonly: true }
}

export const WithoutToolbar: Story = {
  args: { toolbar: false }
}
