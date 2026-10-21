import { computed, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import FilterChip from './FilterChip.vue'
import FilterMenu from './FilterMenu.vue'
import SortMenu from './SortMenu.vue'
import type { FilterField, FilterValue, ViewSort } from './types'

const fields: FilterField[] = [
  { name: 'name', label: 'Name', type: 'text', group: 'Person' },
  { name: 'stage', label: 'Stage', type: 'enum', group: 'Person' },
  { name: 'company', label: 'Company', type: 'company', group: 'Person' },
  { name: 'vip', label: 'VIP', type: 'boolean', group: 'Person' },
  { name: 'lastContact', label: 'Last contact', type: 'date', group: 'Activity' },
  { name: 'replies', label: 'Replies', type: 'number', group: 'Activity' }
]
const stages = [
  { value: 'lead', label: 'Lead', color: 'slate', count: 412 },
  { value: 'contacted', label: 'Contacted', color: 'amber', count: 96 },
  { value: 'customer', label: 'Customer', color: 'green', count: 120 }
]
const companies = [
  'Acme',
  'Analytical Engines',
  'Bell Labs',
  'Bletchley',
  'CERN',
  'Kernel Co',
  'Langley',
  'Navy Labs'
].map((label) => ({ value: label, label }))

const meta: Meta = { title: 'Components/Collections/FilterChip' }

export default meta
type Story = StoryObj

const chipStory = (args: Record<string, unknown>, value: FilterValue, op: string): Story => ({
  render: () => ({
    components: { FilterChip },
    setup: () => ({ args, value: ref(value), op: ref(op) }),
    template: '<FilterChip v-bind="args" v-model="value" v-model:op="op" status="532 people" @remove="() => {}" />'
  })
})

export const EnumFilter = chipStory(
  { field: 'Stage', type: 'enum', options: stages, valueLabel: 'stages' },
  ['lead', 'customer'],
  'is any of'
)

export const ManyValues = chipStory(
  { field: 'Stage', type: 'enum', options: stages, valueLabel: 'stages' },
  ['lead', 'contacted', 'customer'],
  'is any of'
)

export const TextFilter = chipStory({ field: 'Name', type: 'text' }, 'Ada', 'contains')

export const EmptyOperator = chipStory({ field: 'Company', type: 'company', options: companies }, null, 'is empty')

export const OwnSummary = chipStory(
  { field: 'Last contact', type: 'date', summary: { field: 'Last contact', op: 'in', value: 'the last 7 days' } },
  'Last 7 days',
  'is within'
)

const openChip = (story: Story, name: string): Story => ({
  ...story,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name }))
    await waitFor(() => expect(within(document.body).getByRole('dialog')).toBeVisible())
  }
})

export const EnumPanel = openChip(EnumFilter, 'Stage is any of Lead, Customer')

export const CompanyPanel = openChip(
  chipStory({ field: 'Company', type: 'company', options: companies, valueLabel: 'companies' }, ['Acme'], 'is any of'),
  'Company is any of Acme'
)

export const TextPanel = openChip(TextFilter, 'Name contains Ada')

export const DatePanel = openChip(
  chipStory({ field: 'Last contact', type: 'date' }, 'Last 7 days', 'is within'),
  'Last contact is within Last 7 days'
)

export const BooleanPanel = openChip(chipStory({ field: 'VIP', type: 'boolean' }, true, 'is'), 'VIP is Yes')

// A view bar: the sort, a divider, the filters, "+ Filter", and Reset and Save once the view has changed.
export const ViewBar: Story = {
  render: () => ({
    components: { Button, FilterChip, FilterMenu, SortMenu },
    setup: () => {
      const sort = ref<ViewSort | null>({ name: 'name', dir: 'asc' })
      const stage = ref<FilterValue>(['customer'])
      const op = ref('is any of')
      const changed = computed(() => sort.value?.dir !== 'asc' || op.value !== 'is any of')
      return { fields, stages, sort, stage, op, changed }
    },
    template: `
      <div class="flex min-h-18 items-center justify-between gap-4 border-b border-sui-line-subtle px-6">
        <div class="flex flex-wrap items-center gap-1.5">
          <SortMenu v-model="sort" :options="fields" />
          <span v-if="sort" class="mx-1.5 h-5 w-px bg-sui-line" />
          <FilterChip v-model="stage" v-model:op="op" field="Stage" :options="stages" status="120 people" type="enum" value-label="stages" @remove="() => {}" />
          <FilterMenu :fields="fields" :in-use="['stage']" />
        </div>
        <div v-if="changed" class="flex gap-2">
          <Button size="sm" variant="ghost">Reset</Button>
          <Button size="sm" variant="tinted">Save</Button>
        </div>
      </div>
    `
  })
}
