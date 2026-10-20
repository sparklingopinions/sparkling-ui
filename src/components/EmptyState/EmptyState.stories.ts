import type { Meta, StoryObj } from '@storybook/vue3-vite'

import EmptyState from './EmptyState.vue'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: { icon: 'users', title: 'No people yet', description: 'People are individual contacts you interact with.' }
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    icon: 'building',
    title: 'No companies yet',
    description: 'Companies are the organisations your contacts work for.',
    actionLabel: 'New company'
  }
}

export const NoMatches: Story = {
  args: { icon: 'search', tone: 'neutral', title: 'No matches', description: 'No records match your current filters.' }
}

export const WithoutIcon: Story = {
  args: { icon: undefined, title: 'Nothing here', description: 'Items you add show up here.' }
}
