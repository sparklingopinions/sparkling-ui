import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { contrastGap } from '../../stories/contrast'
import Pill from './Pill.vue'

const tones = ['neutral', 'accent', 'success', 'warning', 'info', 'danger']

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  args: { tone: 'success', variant: 'soft', dot: true, label: 'Warm' },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['soft', 'text'] }
  }
}

export default meta
type Story = StoryObj<typeof Pill>

// success-mid on success-soft: 3.32 light, 4.20 dark.
export const Default: Story = { parameters: contrastGap }

// Most tones' text on their soft fill, see Foundations/Contrast gaps.
export const Soft: Story = {
  parameters: contrastGap,
  render: (args) => ({
    components: { Pill },
    setup: () => ({ args, tones }),
    template:
      '<div class="flex flex-wrap gap-2"><Pill v-for="tone in tones" :key="tone" v-bind="args" :tone="tone" :label="tone" /></div>'
  })
}

// The status mids and ink-muted on the canvas.
export const Text: Story = { ...Soft, args: { variant: 'text' } }

// accent on accent-wash: 4.46 light, 3.53 dark.
export const NoDot: Story = { args: { tone: 'accent', dot: false, label: 'New' }, parameters: contrastGap }
