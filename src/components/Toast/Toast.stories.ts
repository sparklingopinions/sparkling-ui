import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { toast } from '../../composables/toast'
import Button from '../Button/Button.vue'
import Toaster from './Toaster.vue'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Feedback/Toaster',
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          'Mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)` or `toast.error(...)`, with `{ detail, life, closable }`. `preview` draws toasts in place instead, for docs, designs and demos: give each an `id` to animate them in and out as the list changes, and remove one on `close`.'
      }
    }
  },
  args: { preview: [{ summary: 'Draft saved' }] }
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Info: Story = {}

export const Success: Story = { args: { preview: [{ severity: 'success', summary: 'Reply sent' }] } }

export const Error: Story = { args: { preview: [{ severity: 'error', summary: 'Couldn’t send the reply' }] } }

export const WithDetail: Story = { args: { preview: [{ summary: 'Imported', detail: '12 people added' }] } }

export const Stack: Story = {
  args: {
    preview: [
      { severity: 'success', summary: 'Reply sent' },
      { summary: 'Imported', detail: '12 people added', closable: false }
    ]
  }
}

export const PreviewInMotion: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup: () => {
      const items = ref<{ id: number; summary: string }[]>([])
      let next = 0
      const add = () => items.value.push({ id: ++next, summary: `Loop ${next} snoozed` })
      const close = (id: string | number) => (items.value = items.value.filter((item) => item.id !== id))
      return { items, add, close }
    },
    template:
      '<div class="flex flex-col items-start gap-3"><Button size="sm" @click="add">Snooze</Button><Toaster :preview="items" @close="close" /></div>'
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Snooze' }))
    await expect(await canvas.findByText('Loop 1 snoozed')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(canvas.queryByText('Loop 1 snoozed')).not.toBeInTheDocument())
  }
}

export const Live: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup: () => ({
      show: () => toast.success('Reply sent', { life: 0 })
    }),
    template: '<Button size="sm" @click="show">Send</Button><Toaster />'
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Send' }))
    await expect(await within(document.body).findByText('Reply sent')).toBeInTheDocument()
  }
}
