import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

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
