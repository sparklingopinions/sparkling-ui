import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Badge from './Badge.vue'

const tones = ['neutral', 'accent', 'success', 'warning', 'info', 'danger']

const meta: Meta<typeof Badge> = {
  title: 'Components/Data display/Badge',
  component: Badge,
  args: { tone: 'success', variant: 'soft', dot: true, label: 'Warm' },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['soft', 'text'] }
  }
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Soft: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args, tones }),
    template:
      '<div class="flex flex-wrap gap-2"><Badge v-for="tone in tones" :key="tone" v-bind="args" :tone="tone" :label="tone" /></div>'
  })
}

export const Text: Story = { ...Soft, args: { variant: 'text' } }

export const NoDot: Story = { args: { tone: 'accent', dot: false, label: 'New' } }
