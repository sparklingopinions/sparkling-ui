import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Tag from '../Tag/Tag.vue'
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

const statuses = [
  { value: 'reply', label: 'To reply', icon: 'reply', iconColor: 'accent' as const },
  { value: 'waiting', label: 'Waiting', icon: 'hourglass', iconColor: 'ink-muted' as const },
  { value: 'nudge', label: 'Follow-up', icon: 'bell-ring', iconColor: 'warning' as const },
  { value: 'done', label: 'Done', icon: 'circle-check', iconColor: 'success' as const }
]

const openOnPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getAllByRole('button')[0]!)
  await expect(await within(document.body).findByRole('listbox')).toBeInTheDocument()
}

// No `component`: Select is generic over its values, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Forms/Select',
  render: (args, { parameters }) => ({
    components: { Select: Select as Component },
    setup: () => ({ args, value: ref(parameters.value ?? null), options: parameters.choices ?? rows }),
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

export const WithIcons: Story = {
  args: { 'aria-label': 'Status', class: 'w-44' },
  parameters: { choices: statuses, value: 'nudge' },
  play: openOnPlay
}

export const Searchable: Story = {
  args: { 'aria-label': 'Company', class: 'w-56', placeholder: 'Pick a company' },
  parameters: { choices: companies, value: 4 },
  play: openOnPlay
}

export const MultipleTags: Story = {
  args: { 'aria-label': 'Tags', class: 'w-72', multiple: true, canCreate: true },
  parameters: { choices: tags, value: ['vip'] },
  play: openOnPlay
}

export const CustomTrigger: Story = {
  render: () => ({
    components: { Select: Select as Component, Tag },
    setup: () => ({ options: rows, value: ref(50) }),
    template: `
      <Select v-model="value" aria-label="Rows per page" :options="options">
        <template #trigger="{ open, toggle, selected }">
          <button type="button" aria-haspopup="listbox" :aria-expanded="open" @click="toggle">
            <Tag :name="selected[0]?.label ?? 'Rows'" variant="outline" />
          </button>
        </template>
      </Select>
    `
  })
}

export const ServerSearch: Story = {
  render: () => ({
    components: { Select: Select as Component },
    setup: () => {
      const results = ref(companies.slice(0, 5))
      // Stands in for a request: matches anywhere in the name, as a server might, which a label filter wouldn't.
      const search = (query: string) =>
        (results.value = companies.filter((company) =>
          company.label
            .toLowerCase()
            .replace(/[^a-z]/g, '')
            .includes(query.toLowerCase().replace(/[^a-z]/g, ''))
        ))
      return {
        results,
        search,
        value: ref(9),
        saved: [{ value: 9, label: 'Menabrea Studio' }]
      }
    },
    template: `
      <Select v-model="value" aria-label="Company" class="w-56" clearable :filter="false" :options="results"
        :selected-options="saved" @query-change="search" />
    `
  }),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Company/ })
    await expect(trigger).toHaveTextContent('Menabrea Studio')
    await userEvent.click(trigger)
    await userEvent.keyboard('babbageco')
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Babbage & Co' }))
    await expect(trigger).toHaveTextContent('Babbage & Co')
  }
}

export const ClosesOnSecondClick: Story = {
  args: { 'aria-label': 'Rows per page', class: 'w-40' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button')
    await userEvent.click(trigger)
    await within(document.body).findByRole('listbox')
    await userEvent.click(trigger)
    await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull())
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  }
}
