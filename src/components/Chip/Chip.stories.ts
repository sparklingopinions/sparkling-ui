import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Chip from './Chip.vue'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: { label: 'Customer', muted: false }
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {}

export const Muted: Story = { args: { label: 'Lead', muted: true } }

export const Transition: Story = {
  render: () => ({
    components: { Chip },
    template:
      '<div class="flex items-center gap-2 text-sm"><Chip label="Lead" muted /> to <Chip label="Customer" /></div>'
  })
}
