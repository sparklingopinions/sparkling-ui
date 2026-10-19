import type { Meta, StoryObj } from '@storybook/vue3-vite'

import EmptyState from './EmptyState.vue'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: { emoji: '👤', title: 'No people yet', description: 'People are individual contacts you interact with.' }
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    emoji: '💼',
    title: 'No companies yet',
    description: 'Companies associated with your contacts and loops.',
    actionLabel: 'New company'
  }
}

export const NoEmoji: Story = {
  args: { emoji: undefined, title: 'No matches', description: 'No records match your current filters.' }
}
