import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import ActionBar from './ActionBar.vue'

const actions = [
  { label: 'Snooze', action: 'snooze', icon: 'calendar' },
  { label: 'Archive', action: 'archive', icon: 'archive' },
  { label: 'Delete', action: 'delete', icon: 'trash', variant: 'danger' as const }
]

const meta: Meta<typeof ActionBar> = {
  title: 'Components/Collections/ActionBar',
  component: ActionBar,
  args: { actions, floating: false },
  render: (args) => ({
    components: { ActionBar },
    setup: () => ({ args, count: ref(3) }),
    template: '<ActionBar v-bind="args" :count="count" @clear="count = 0" />'
  })
}

export default meta
type Story = StoryObj<typeof ActionBar>

export const InPlace: Story = {}

export const Floating: Story = { args: { floating: true } }

export const WithDisabledAction: Story = {
  args: { actions: [{ label: 'Merge', action: 'merge', disabled: true }, ...actions.slice(1)] }
}

/** A key runs an action while records are selected; a menu action emits the option picked. */
export const ShortcutsAndMenus: Story = {
  args: {
    actions: [
      {
        label: 'Set status',
        action: 'status',
        options: [
          { label: 'To reply', value: 'to_reply', icon: 'reply', iconColor: 'warning' },
          { label: 'Done', value: 'done', icon: 'circle-check', iconColor: 'success' }
        ]
      },
      { label: 'Snooze', action: 'snooze', icon: 'calendar', shortcut: 's' },
      { label: 'Not relevant', action: 'junk', shortcut: 'n', disabled: true, disabledReason: 'None of these can be' }
    ]
  },
  render: (args) => ({
    components: { ActionBar },
    setup: () => {
      const done = ref<string[]>([])
      return { args, done, count: ref(2) }
    },
    template: `
      <ActionBar v-bind="args" :count="count" @clear="count = 0"
        @click-item="(item) => done.push(item.action + (item.value ? ':' + item.value : ''))" />
      <p data-done>{{ done.join(', ') }}</p>`
  }),
  play: async ({ canvasElement }) => {
    const done = () => canvasElement.querySelector('[data-done]')!.textContent
    await userEvent.keyboard('s')
    await waitFor(() => expect(done()).toBe('snooze'))
    // Not while typing into a field, but still with a checkbox focused.
    const field = document.createElement('input')
    canvasElement.appendChild(field)
    const press = () => field.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    press()
    await expect(done()).toBe('snooze')
    field.type = 'checkbox'
    press()
    await waitFor(() => expect(done()).toBe('snooze, snooze'))
    field.remove()
    // A disabled action's key does nothing.
    await userEvent.keyboard('n')
    await expect(done()).toBe('snooze, snooze')
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Set status/ }))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Done' }))
    await waitFor(() => expect(done()).toBe('snooze, snooze, status:done'))
  }
}
