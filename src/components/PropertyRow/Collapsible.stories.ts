import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Collapsible from './Collapsible.vue'
import PropertyRow from './PropertyRow.vue'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Data display/Collapsible',
  component: Collapsible,
  args: { summary: 'Phone, birthday', filled: false },
  render: (args) => ({
    components: { Collapsible, PropertyRow },
    setup: () => ({ args }),
    template: `
      <div class="max-w-md">
        <Collapsible v-bind="args">
          <PropertyRow label="Phone">+44 20 7946 0000</PropertyRow>
          <PropertyRow label="Birthday">10 December</PropertyRow>
        </Collapsible>
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Folded: Story = {}

export const Filled: Story = { args: { filled: true } }
