import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Spinner from './Spinner.vue'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  args: { size: 'lg', label: 'Loading' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } }
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-6">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    `
  })
}
