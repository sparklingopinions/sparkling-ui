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
  title: 'Components/SegmentedControl',
  render: () => ({
    components: { SegmentedControl: SegmentedControl as Component },
    setup: () => ({ options, value: ref('call') }),
    // On the tinted band it sits on in MustLoop's ledger modals.
    template:
      '<div class="w-fit bg-sui-sunken p-2"><SegmentedControl v-model="value" aria-label="Activity type" :options="options" /></div>'
  })
}

export default meta

export const Default: StoryObj = {}
