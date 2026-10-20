import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import { toast } from '../../composables/toast'
import Button from '../Button/Button.vue'
import Toaster from './Toaster.vue'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          'Mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)` or `toast.error(...)`, with `{ detail, life, closable }`. `preview` draws toasts in place instead, for docs and designs.'
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
