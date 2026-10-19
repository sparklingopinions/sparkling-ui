import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import { toast } from '../../composables/toast'
import Button from '../Button/Button.vue'
import ToastMessage from './ToastMessage.vue'
import Toaster from './Toaster.vue'

const meta: Meta<typeof ToastMessage> = {
  title: 'Components/Toast',
  component: ToastMessage,
  parameters: {
    docs: {
      description: {
        component:
          'Mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)` or `toast.error(...)`, with `{ detail, life, closable }`. `ToastMessage` draws a single toast, for previews.'
      }
    }
  },
  args: { summary: 'Draft saved', severity: 'info', closable: true },
  argTypes: { severity: { control: 'inline-radio', options: ['info', 'success', 'error'] } },
  render: (args) => ({
    components: { ToastMessage },
    setup: () => ({ args }),
    template: '<div class="w-96"><ToastMessage v-bind="args" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof ToastMessage>

export const Info: Story = {}

export const Success: Story = { args: { severity: 'success', summary: 'Reply sent' } }

export const Error: Story = { args: { severity: 'error', summary: 'Couldn’t send the reply' } }

export const WithDetail: Story = { args: { summary: 'Imported', detail: '12 people added' } }

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
