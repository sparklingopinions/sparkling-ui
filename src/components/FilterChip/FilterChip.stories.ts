import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Select from '../Select/Select.vue'
import FilterChip from './FilterChip.vue'

const meta: Meta<typeof FilterChip> = {
  title: 'Components/FilterChip',
  component: FilterChip,
  args: { kind: 'filter', icon: 'pipeline', field: 'Stage', op: 'is', value: 'Customer' },
  argTypes: { kind: { control: 'inline-radio', options: ['filter', 'sort', 'add'] } },
  render: (args) => ({
    components: { FilterChip },
    setup: () => ({ args }),
    template: '<FilterChip v-bind="args" />'
  })
}

export default meta
type Story = StoryObj<typeof FilterChip>

export const Filter: Story = {}

export const Sort: Story = { args: { kind: 'sort', field: 'Name', op: 'ascending', value: undefined, dir: 'asc' } }

export const Add: Story = { args: { kind: 'add' } }

const stages = ['Lead', 'Contacted', 'Customer'].map((label) => ({ value: label, label }))

// A view bar: the sort, a divider, the filters, "+ Filter", and Reset and Save once the view has changed.
export const ViewBar: Story = {
  render: () => ({
    components: { Button, FilterChip, Select: Select as Component },
    setup: () => ({ stage: ref('Customer'), stages, sorted: ref(true) }),
    template: `
      <div class="flex min-h-18 items-center justify-between gap-4 border-b border-sui-line-subtle px-6">
        <div class="flex flex-wrap items-center gap-1.5">
          <FilterChip v-if="sorted" dir="asc" field="Name" kind="sort" op="ascending" @remove="sorted = false" />
          <span class="mx-1.5 h-5 w-px bg-sui-line" />
          <FilterChip field="Stage" icon="pipeline" op="is" :value="stage" @remove="() => {}">
            <Select v-model="stage" aria-label="Stage" class="w-full" :options="stages" />
          </FilterChip>
          <FilterChip kind="add" />
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="ghost">Reset</Button>
          <Button size="sm" variant="tinted">Save</Button>
        </div>
      </div>
    `
  })
}

export const Open: Story = {
  render: ViewBar.render,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Stage is Customer' }))
    const panel = await within(document.body).findByRole('dialog', { name: 'Stage is Customer' })
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'Remove' })).toBeVisible())
  }
}
