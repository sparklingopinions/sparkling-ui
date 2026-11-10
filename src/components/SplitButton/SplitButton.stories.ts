import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from '../Icon/Icon.vue'
import SplitButton from './SplitButton.vue'

const items = [
  { type: 'action' as const, label: 'Approve and schedule…', icon: 'calendar', shortcut: 'S' },
  { type: 'action' as const, label: 'Approve and publish now', icon: 'send', shortcut: '⇧P' }
]

const meta: Meta<typeof SplitButton> = {
  title: 'Components/Actions/SplitButton',
  component: SplitButton,
  args: { variant: 'primary', size: 'md', disabled: false, items, menuLabel: 'More ways to approve' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tinted'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    side: { control: 'inline-radio', options: ['bottom', 'top'] }
  },
  render: (args) => ({
    components: { SplitButton, Icon },
    setup: () => ({ args }),
    template: '<SplitButton v-bind="args"><Icon name="check" />Approve</SplitButton>'
  })
}

export default meta
type Story = StoryObj<typeof SplitButton>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Disabled: Story = { args: { disabled: true } }

/** At the foot of the screen (a floating decision bar): the menu opens above, and the chevron points up. */
export const OpensAbove: Story = {
  args: { side: 'top' },
  render: (args) => ({
    components: { SplitButton, Icon },
    setup: () => ({ args }),
    template:
      '<div class="flex h-48 items-end"><SplitButton v-bind="args"><Icon name="check" />Approve</SplitButton></div>'
  })
}

export const Sizes: Story = {
  render: (args) => ({
    components: { SplitButton, Icon },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <SplitButton v-for="size in ['sm', 'md', 'lg']" :key="size" v-bind="args" :size="size">
          <Icon name="check" />Approve
        </SplitButton>
      </div>
    `
  })
}
