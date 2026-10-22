import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SegmentedControl from './SegmentedControl.vue'

const options = [
  { value: 'note', label: 'Note', iconName: 'search' },
  {
    value: 'call',
    label: 'Call',
    icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2'
  },
  { value: 'meeting', label: 'Meeting' }
]

// No `component`: SegmentedControl is generic over its values, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Forms/SegmentedControl',
  render: () => ({
    components: { SegmentedControl: SegmentedControl as Component },
    setup: () => ({ options, value: ref('call') }),
    template: '<SegmentedControl v-model="value" aria-label="Activity type" :options="options" />'
  })
}

export default meta

export const Default: StoryObj = {}

const views = [
  { value: 'queue', label: 'Queue' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published and archived' }
]

export const Block: StoryObj = {
  render: () => ({
    components: { SegmentedControl: SegmentedControl as Component },
    setup: () => ({ views, value: ref('scheduled') }),
    template:
      '<div class="w-[22rem] max-w-full"><SegmentedControl v-model="value" aria-label="View" block :options="views" /></div>'
  })
}

export const BlockWithIcons: StoryObj = {
  render: () => ({
    components: { SegmentedControl: SegmentedControl as Component },
    setup: () => ({ options, value: ref('note') }),
    template:
      '<div class="w-[20rem] max-w-full"><SegmentedControl v-model="value" aria-label="Activity type" block :options="options" /></div>'
  })
}
