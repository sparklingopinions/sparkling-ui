import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Chip from '../Chip/Chip.vue'
import Select from './Select.vue'

const rows = [
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
]

const companies = [
  'Analytical Engines',
  'Babbage & Co',
  'Difference Ltd',
  'Ada Labs',
  'Lovelace Partners',
  'Jacquard Looms',
  'Somerville Press',
  'Byron Holdings',
  'Menabrea Studio',
  'De Morgan Logic'
].map((label, index) => ({ value: index + 1, label }))

const tags = [
  { value: 'vip', label: 'VIP', color: 'purple' as const },
  { value: 'investor', label: 'Investor', color: 'green' as const },
  { value: 'press', label: 'Press', color: 'orange' as const }
]

const openOnPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getAllByRole('button')[0]!)
  await expect(await within(document.body).findByRole('listbox')).toBeInTheDocument()
}

// No `component`: Select is generic over its values, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Select',
  render: (args, { parameters }) => ({
    components: { Select: Select as Component },
    setup: () => ({ args, value: ref(parameters.value ?? null), options: parameters.options ?? rows }),
    template: '<Select v-bind="args" v-model="value" :options="options" />'
  })
}

export default meta
type Story = StoryObj

export const Placeholder: Story = { args: { 'aria-label': 'Rows per page', class: 'w-40' } }

export const Small: Story = { args: { 'aria-label': 'Rows per page', size: 'sm' }, parameters: { value: 25 } }

export const Invalid: Story = { args: { 'aria-label': 'Rows per page', class: 'w-40', invalid: true } }

export const Disabled: Story = { args: { 'aria-label': 'Rows per page', disabled: true }, parameters: { value: 25 } }

export const Open: Story = {
  args: { 'aria-label': 'Rows per page', class: 'w-40' },
  parameters: { value: 50 },
  play: openOnPlay
}

export const Searchable: Story = {
  args: { 'aria-label': 'Company', class: 'w-56', placeholder: 'Pick a company' },
  parameters: { options: companies, value: 4 },
  play: openOnPlay
}

export const MultipleTags: Story = {
  args: { 'aria-label': 'Tags', class: 'w-72', multiple: true, canCreate: true },
  parameters: { options: tags, value: ['vip'] },
  play: openOnPlay
}

export const CustomTrigger: Story = {
  render: () => ({
    components: { Chip, Select: Select as Component },
    setup: () => ({ options: rows, value: ref(50) }),
    template: `
      <Select v-model="value" aria-label="Rows per page" :options="options">
        <template #trigger="{ open, toggle, selected }">
          <button type="button" aria-haspopup="listbox" :aria-expanded="open" @click="toggle">
            <Chip>{{ selected[0]?.label ?? 'Rows' }}</Chip>
          </button>
        </template>
      </Select>
    `
  })
}
