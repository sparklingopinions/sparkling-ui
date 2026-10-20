import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Select from './Select.vue'

const options = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page', disabled: true }
]

// No `component`: Select is generic over its values, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Select',
  render: (args) => ({
    components: { Select: Select as Component },
    setup: () => {
      const { value, ...rest } = args
      return { rest, options, value: ref(value ?? null) }
    },
    template: '<Select v-bind="rest" v-model="value" aria-label="Rows per page" class="w-44" :options="options" />'
  })
}

export default meta

type Story = StoryObj

export const Placeholder: Story = {}

export const Chosen: Story = { args: { value: 25 } }

export const Small: Story = { args: { value: 25, size: 'sm' } }

export const Disabled: Story = { args: { value: 25, disabled: true } }
