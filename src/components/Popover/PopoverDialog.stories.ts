import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import PopoverDialog from './PopoverDialog.vue'

const meta: Meta<typeof PopoverDialog> = {
  title: 'Components/Overlays/PopoverDialog',
  component: PopoverDialog,
  parameters: {
    docs: {
      description: {
        component:
          "A small decision, such as a date or a link. On the desktop it opens as a popover under its `anchor` (an element, a component or a ref to one), or under the `trigger` slot's button: spread the slot's `props` on it. Below `sheetBelow` (640px) it is a bottom sheet. It has a title, your fields, and a footer with Cancel and the `confirmLabel` button, which emits `confirm`, as ⌘ or Ctrl Enter does; the `footer` slot replaces them. Escape, Cancel and a click outside emit `cancel` and close it. Confirming doesn't: close it when you're done. Focus moves to an `[autofocus]` field inside, or else the panel, and goes back to what had it when it opened, or else the anchor. Without an anchor or a trigger it is a small dialog on the desktop."
      }
    }
  },
  args: { title: 'Schedule', confirmLabel: 'Schedule' }
}

export default meta
type Story = StoryObj<typeof PopoverDialog>

export const FromItsTrigger: Story = {
  render: (args) => ({
    components: { Button, Input, PopoverDialog },
    setup: () => {
      const open = ref(false)
      const when = ref('Tomorrow, 9:00')
      const result = ref('Not scheduled')
      const confirm = () => {
        result.value = `Scheduled for ${when.value}`
        open.value = false
      }
      return { args, open, when, result, confirm }
    },
    template: `
      <div class="flex items-center gap-3 text-sm text-sui-ink">
        <PopoverDialog v-bind="args" v-model:open="open" :confirm-disabled="!when" @confirm="confirm">
          <template #trigger="{ props }">
            <Button v-bind="props" size="sm">Schedule</Button>
          </template>
          <Input v-model="when" aria-label="When" autofocus />
        </PopoverDialog>
        <span>{{ result }}</span>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const opener = canvas.getByRole('button', { name: 'Schedule' })
    await userEvent.click(opener)
    const dialog = await within(document.body).findByRole('dialog', { name: 'Schedule' })
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
    await expect(opener).toHaveAttribute('aria-expanded', 'true')
    await expect(within(dialog).getByRole('textbox', { name: 'When' })).toHaveFocus()
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}')
    await expect(await canvas.findByText('Scheduled for Tomorrow, 9:00')).toBeInTheDocument()
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
    await expect(opener).toHaveFocus()
  }
}

// Opened with a shortcut on the focused row, under a control elsewhere on it; focus goes back to the row.
export const AnchoredElsewhere: Story = {
  render: (args) => ({
    components: { Button, Input, PopoverDialog },
    setup: () => {
      const open = ref(false)
      const anchor = ref<HTMLElement | null>(null)
      const link = ref('')
      const onKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'l') return
        // Otherwise the key types into the field that takes focus.
        event.preventDefault()
        open.value = true
      }
      return { args, open, anchor, link, onKeydown }
    },
    template: `
      <div
        class="flex w-96 items-center gap-3 rounded-lg border border-sui-line-subtle bg-sui-surface px-4 py-2.5 text-sm text-sui-ink outline-hidden focus-visible:sui-ring"
        tabindex="0"
        @keydown="onKeydown"
      >
        <span class="flex-1">Behind the name (press L)</span>
        <span ref="anchor" class="text-13 text-sui-ink-muted">No link</span>
      </div>
      <PopoverDialog
        v-bind="args"
        v-model:open="open"
        :anchor="anchor"
        confirm-label="Add"
        :confirm-disabled="!link"
        title="Add a link"
        :width="280"
        @confirm="open = false"
      >
        <Input v-model="link" aria-label="Link" autofocus placeholder="https://" type="url" />
      </PopoverDialog>
    `
  }),
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByText('Behind the name (press L)').parentElement!
    row.focus()
    await userEvent.keyboard('l')
    const dialog = await within(document.body).findByRole('dialog', { name: 'Add a link' })
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
    await expect(within(dialog).getByRole('button', { name: 'Add' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
    await expect(row).toHaveFocus()
  }
}

// What a phone gets: here `sheetBelow` is set high so the sheet shows at any width.
export const AsASheet: Story = {
  args: { sheetBelow: 100000 },
  render: (args) => ({
    components: { Button, Input, PopoverDialog },
    setup: () => ({ args, open: ref(false), when: ref('Tomorrow, 9:00') }),
    template: `
      <PopoverDialog v-bind="args" v-model:open="open" @confirm="open = false">
        <template #trigger="{ props }">
          <Button v-bind="props" size="sm">Schedule</Button>
        </template>
        <Input v-model="when" aria-label="When" />
      </PopoverDialog>
    `
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Schedule' }))
    const dialog = await within(document.body).findByRole('dialog', { name: 'Schedule' })
    await waitFor(() => expect(dialog.className).toContain('rounded-t-'))
    await expect(within(dialog).getByRole('button', { name: 'Schedule' })).toBeInTheDocument()
  }
}
