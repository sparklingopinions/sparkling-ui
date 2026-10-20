import { computed, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import FilterChip from './FilterChip.vue'
import FilterFieldPicker from './FilterFieldPicker.vue'
import SortControl from './SortControl.vue'
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

const meta: Meta = { title: 'Components/Filters' }

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

export const FieldPicker: Story = {
  render: () => ({
    components: { FilterFieldPicker },
    setup: () => ({ fields, picked: ref('') }),
    template: `
      <div class="flex items-center gap-3">
        <FilterFieldPicker :fields="fields" :in-use="['stage']" @pick="picked = $event" />
        <FilterFieldPicker as="button" :fields="fields" :in-use="['stage']" @pick="picked = $event" />
        <span class="text-13 text-sui-ink-muted">{{ picked }}</span>
      </div>
    `
  })
}

export const FieldPickerOpen: Story = {
  ...FieldPicker,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button', { name: 'Filter' })[0])
    const search = await within(document.body).findByRole('textbox', { name: 'Filter by…' })
    await userEvent.type(search, 'st')
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(document.body).getByRole('option', { name: /Last contact/ })).toBeVisible())
  }
}

const sortStory = (sort: ViewSort | null, open = false): Story => ({
  render: () => ({
    components: { SortControl },
    setup: () => ({ fields, sort: ref(sort) }),
    template: `
      <div class="flex items-center gap-3">
        <SortControl v-model="sort" as="button" :options="fields" />
        <SortControl v-model="sort" :options="fields" />
      </div>
    `
  }),
  play: open
    ? async ({ canvasElement }) => {
        await userEvent.click(within(canvasElement).getByRole('button', { name: 'Sort' }))
        await waitFor(() => expect(within(document.body).getByRole('dialog')).toBeVisible())
      }
    : undefined
})

export const Sort = sortStory({ name: 'lastContact', dir: 'desc' })

export const SortPanel = sortStory({ name: 'name', dir: 'asc' }, true)

export const Unsorted = sortStory(null)

// A view bar: the sort, a divider, the filters, "+ Filter", and Reset and Save once the view has changed.
export const ViewBar: Story = {
  render: () => ({
    components: { Button, FilterChip, FilterFieldPicker, SortControl },
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
          <SortControl v-model="sort" :options="fields" />
          <span v-if="sort" class="mx-1.5 h-5 w-px bg-sui-line" />
          <FilterChip v-model="stage" v-model:op="op" field="Stage" :options="stages" status="120 people" type="enum" value-label="stages" @remove="() => {}" />
          <FilterFieldPicker :fields="fields" :in-use="['stage']" />
        </div>
        <div v-if="changed" class="flex gap-2">
          <Button size="sm" variant="ghost">Reset</Button>
          <Button size="sm" variant="tinted">Save</Button>
        </div>
      </div>
    `
  })
}
