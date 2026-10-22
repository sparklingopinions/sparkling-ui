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
          'Mount one `<Toaster />` near the app root, then `toast.info(message)`, `toast.success(...)`, `toast.warning(...)` or `toast.error(...)`, with `{ detail, life, closable, action, actions, onDismiss }`. An `action` (or up to two `actions`) adds ghost-inverse buttons after the message; pressing one runs it and closes the toast. A toast with an action stays 6s and draws a bar counting down, paused while the toasts are hovered or focused; when it runs out, `onDismiss` gets `timeout` and nothing runs. `position` puts live toasts at the bottom centre (the default), left or right, or the top centre, left or right. Keep them clear of your own chrome with `--sui-toaster-inset-top`, `-right`, `-bottom` and `-left` (set on :root, per breakpoint, or on an element around the Toaster); `--sui-toaster-margin` is their gap to those edges and `--sui-toaster-width` their width. The safe area is added on top. `preview` draws toasts in place instead, for docs, designs and demos: give each an `id` to animate them in and out as the list changes, and remove one on `close`.'
      }
    }
  },
  args: { preview: [{ summary: 'Draft saved' }] }
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Info: Story = {}

export const Success: Story = { args: { preview: [{ severity: 'success', summary: 'Reply sent' }] } }

export const Warning: Story = {
  args: { preview: [{ severity: 'warning', summary: 'Sync is slow', detail: 'Changes may take a minute to appear' }] }
}

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

const noop = () => {}

export const WithAction: Story = {
  args: { preview: [{ severity: 'success', summary: 'Post approved', action: { label: 'Undo', onClick: noop } }] }
}

export const TwoActions: Story = {
  args: {
    preview: [
      {
        summary: 'Draft archived',
        detail: 'It stays in Archive for 30 days',
        actions: [
          { label: 'Undo', onClick: noop },
          { label: 'View', onClick: noop }
        ]
      }
    ]
  }
}

export const ActionCountdown: Story = {
  args: {
    preview: [
      {
        severity: 'success',
        summary: 'Post approved and scheduled for the morning slot',
        action: { label: 'Undo', onClick: noop },
        life: 600000
      }
    ]
  }
}

export const ActionWithoutClose: Story = {
  args: { preview: [{ summary: 'Reply sent', closable: false, action: { label: 'Undo', onClick: noop } }] }
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

export const LiveWithUndo: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup: () => {
      const status = ref('Approved')
      const approve = () => {
        status.value = 'Approved'
        toast.success('Post approved', {
          life: 0,
          action: { label: 'Undo', onClick: () => (status.value = 'Undone') }
        })
      }
      return { status, approve }
    },
    template:
      '<div class="flex items-center gap-3"><Button size="sm" @click="approve">Approve</Button><span class="text-sm text-sui-ink">{{ status }}</span></div><Toaster />'
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }))
    await userEvent.click(await within(document.body).findByRole('button', { name: 'Undo' }))
    await expect(await canvas.findByText('Undone')).toBeInTheDocument()
    await waitFor(() => expect(within(document.body).queryByText('Post approved')).not.toBeInTheDocument())
  }
}

const positions = ['bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'top-left', 'top-right'] as const

export const Positions: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup: () => {
      const position = ref<(typeof positions)[number]>('bottom-center')
      const show = (at: (typeof positions)[number]) => {
        position.value = at
        toast.info(`Toasts at ${at.replace('-', ' ')}`, { life: 0 })
      }
      return { positions, position, show }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button v-for="at in positions" :key="at" size="sm" @click="show(at)">{{ at.replace('-', ' ') }}</Button>
      </div>
      <Toaster :position="position" />
    `
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'top right' }))
    const message = await within(document.body).findByText('Toasts at top right')
    await waitFor(() => {
      const box = message.closest('[data-sui-toasts]')!.getBoundingClientRect()
      expect(box.top).toBeCloseTo(20, 0)
      expect(window.innerWidth - box.right).toBeCloseTo(20, 0)
    })
  }
}

// The app keeps toasts clear of its own chrome with the inset tokens, set wherever suits it: on :root, under a media
// query, or on an element around the Toaster, as here.
export const ClearOfAppChrome: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup: () => ({
      show: () => toast.success('Post approved', { life: 0, action: { label: 'Undo', onClick: noop } })
    }),
    template: `
      <div
        class="fixed inset-0 flex text-sm text-sui-ink"
        style="--sui-toaster-inset-left: 200px; --sui-toaster-inset-bottom: 56px; --sui-toaster-margin: 1.5rem"
      >
        <nav aria-label="Sidebar" class="w-[200px] shrink-0 border-r border-sui-line-subtle bg-sui-canvas p-4">Sidebar</nav>
        <main class="flex flex-1 flex-col">
          <div class="flex-1 p-6"><Button size="sm" @click="show">Approve</Button></div>
          <div class="flex h-14 items-center border-t border-sui-line-subtle bg-sui-surface px-6">Bottom bar</div>
        </main>
        <Toaster position="bottom-left" />
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Approve' }))
    const message = await within(document.body).findByText('Post approved')
    await waitFor(() => {
      const box = message.closest('[data-sui-toasts]')!.getBoundingClientRect()
      expect(box.left).toBeCloseTo(224, 0)
      expect(window.innerHeight - box.bottom).toBeCloseTo(80, 0)
    })
  }
}
