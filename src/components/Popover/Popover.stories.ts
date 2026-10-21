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
          'Opened from code: `popover.value.toggle(event)`, `show(event, target?)` and `hide()`. It sits below its trigger (or `target`), closes on Escape, an outside click, a scroll or a resize. Focus moves to an `[autofocus]` field inside, or else the panel, and returns to the trigger when it closes with focus inside. `width` sets how wide the panel is (16rem).'
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

export const KeyboardFocus: Story = {
  render: (args) => ({
    components: { Button, Input, Popover },
    setup: () => ({ args, popover: ref() }),
    template: `
      <div class="flex gap-2">
        <Button size="sm" @click="popover.toggle($event)">Share</Button>
        <Input aria-label="Elsewhere" placeholder="Elsewhere" />
      </div>
      <Popover ref="popover" v-bind="args" aria-label="Share" class="flex gap-2 p-3" width="20rem">
        <Button size="sm">Copy link</Button>
        <Button size="sm">Invite</Button>
      </Popover>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Share' })
    await userEvent.click(trigger)
    const panel = await body.findByRole('dialog', { name: 'Share' })
    await waitFor(() => expect(panel).toHaveFocus())
    await expect(panel.getBoundingClientRect().width).toBe(320)
    await userEvent.tab()
    await expect(body.getByRole('button', { name: 'Copy link' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole('dialog', { name: 'Share' })
    await userEvent.click(canvas.getByRole('textbox', { name: 'Elsewhere' }))
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(canvas.getByRole('textbox', { name: 'Elsewhere' })).toHaveFocus()
  }
}

// Taller than the room on either side: it stays in the window and scrolls inside.
export const TallerThanTheWindow: Story = {
  render: (args) => ({
    components: { Button, Popover },
    setup: () => ({ args, popover: ref(), days: Array.from({ length: 60 }, (_, i) => `Day ${i + 1}`) }),
    template: `
      <div class="flex h-[60vh] items-center">
        <Button size="sm" @click="popover.toggle($event)">Pick a day</Button>
      </div>
      <Popover ref="popover" v-bind="args" aria-label="Pick a day">
        <div class="flex flex-col p-1">
          <Button v-for="day in days" :key="day" size="sm" variant="ghost">{{ day }}</Button>
        </div>
      </Popover>
    `
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Pick a day' }))
    const panel = await within(document.body).findByRole('dialog', { name: 'Pick a day' })
    await waitFor(() => {
      const box = panel.getBoundingClientRect()
      expect(box.top).toBeGreaterThanOrEqual(0)
      expect(box.bottom).toBeLessThanOrEqual(window.innerHeight)
    })
    await expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight)
  }
}
