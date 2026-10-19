import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { contrastGap } from '../../stories/contrast'
import Chip from './Chip.vue'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: { label: 'Customer', muted: false }
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {}

// ink-muted on the canvas: 2.91 light.
export const Muted: Story = { args: { label: 'Lead', muted: true }, parameters: contrastGap }

// The muted chip: ink-muted on the canvas.
export const Transition: Story = {
  parameters: contrastGap,
  render: () => ({
    components: { Chip },
    template:
      '<div class="flex items-center gap-2 text-sm"><Chip label="Lead" muted /> to <Chip label="Customer" /></div>'
  })
}
