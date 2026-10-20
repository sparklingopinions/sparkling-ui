import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import Popover from './Popover.vue'

const meta: Meta<typeof Popover> = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  args: { offset: 4, closeOnEscape: true },
  parameters: {
    docs: {
      description: {
        component:
          'Opened from code: `popover.value.toggle(event)`, `show(event, target?)` and `hide()`. It sits below its trigger (or `target`), closes on Escape, an outside click, a scroll or a resize, and only moves focus to an `[autofocus]` field inside.'
      }
    }
  },
  render: (args) => ({
    components: { Button, Popover },
    setup: () => ({ args, popover: ref() }),
    template: `
      <Button size="sm" @click="popover.toggle($event)">Workspace</Button>
      <Popover ref="popover" v-bind="args">
        <ul class="py-1 text-sm">
          <li class="px-3 py-1.5">Settings</li>
          <li class="px-3 py-1.5">Members</li>
          <li class="px-3 py-1.5">Sign out</li>
        </ul>
      </Popover>
    `
  })
}

export default meta
type Story = StoryObj<typeof Popover>

// Opened in the test, so axe checks the open popover too.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Workspace' }))
    const dialog = await within(document.body).findByRole('dialog', { name: 'Workspace' })
    // Past its fade-in, so axe checks it as drawn.
    await waitFor(() => expect(dialog).toBeVisible())
  }
}

export const WithAutofocus: Story = {
  render: (args) => ({
    components: { Button, Popover, Input },
    setup: () => ({ args, popover: ref(), name: ref('') }),
    template: `
      <Button size="sm" @click="popover.toggle($event)">Rename</Button>
      <Popover ref="popover" v-bind="args" aria-label="Rename" class="p-3">
        <Input v-model="name" aria-label="New name" autofocus placeholder="New name" />
      </Popover>
    `
  })
}
