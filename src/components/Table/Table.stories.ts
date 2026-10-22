import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { people, stageLabels, stageTones } from '../../stories/people'
import Alert from '../Alert/Alert.vue'
import Avatar from '../Avatar/Avatar.vue'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Pagination from '../Pagination/Pagination.vue'
import Select from '../Select/Select.vue'
import Table from './Table.vue'
import type { TableColumn, TableSort } from './types'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'stage', label: 'Stage', width: 140, sortable: true },
  { key: 'lastContact', label: 'Last contact', width: 140, align: 'right' },
  { key: 'menu', width: 56, align: 'right' }
]
const menu = [
  { type: 'action', label: 'Edit', icon: 'edit' },
  { type: 'action', label: 'Delete', icon: 'trash', variant: 'danger' }
]

// No `component`: Table is generic over its rows, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Collections/Table',
  args: { columns, rows: people.slice(0, 6), caption: 'People', size: 'md', loading: false, selectable: false },
  render: (args, { parameters }) => ({
    components: {
      Avatar,
      Alert,
      Button,
      EmptyState,
      DropdownMenu,
      Pagination,
      Badge,
      Select,
      Table: Table as Component
    },
    setup: () => ({
      args,
      menu,
      stageLabels,
      stageTones,
      sort: ref<TableSort | null>(parameters.sort ?? null),
      selected: ref<unknown[]>(parameters.selected ?? []),
      page: ref(1),
      perPage: ref(25)
    }),
    template: `
      <Table v-bind="args" v-model:selected="selected" v-model:sort="sort">
        <template #cell-name="{ row }">
          <span class="flex items-center gap-3"><Avatar :name="row.name" size="md" />{{ row.name }}</span>
        </template>
        <template #cell-stage="{ row }">
          <Badge :label="stageLabels[row.stage]" :tone="stageTones[row.stage]" dot variant="text" />
        </template>
        <template #cell-menu>
          <DropdownMenu align="end" :items="menu" />
        </template>
        ${parameters.slots ?? ''}
      </Table>
    `
  })
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const Sorted: Story = { parameters: { sort: { key: 'name', dir: 'asc' } } }

export const Selectable: Story = { args: { selectable: true }, parameters: { selected: [2, 3] } }

export const Small: Story = { args: { size: 'sm' } }

export const Loading: Story = { args: { loading: true, selectable: true } }

export const Empty: Story = {
  args: { rows: [] },
  parameters: {
    slots: `
      <template #empty>
        <EmptyState icon="users" title="No people yet" description="People are individual contacts you interact with." />
      </template>
    `
  }
}

export const Failed: Story = {
  parameters: {
    slots: `
      <template #error>
        <div class="p-4">
          <Alert inset tone="danger">
            Couldn’t load people.
            <template #action><Button size="sm">Try again</Button></template>
          </Alert>
        </div>
      </template>
    `
  }
}

export const WithFooter: Story = {
  parameters: {
    slots: `
      <template #footer>
        <div class="flex items-center gap-2">
          <Select v-model="perPage" aria-label="Rows per page" :options="[10, 25, 50].map((n) => ({ value: n, label: String(n) }))" size="sm" />
          <span>1–25 of 1,000</span>
        </div>
        <Pagination v-model:page="page" :page-count="40" />
      </template>
    `
  }
}

export const WrappedCells: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Thread', wrap: true },
      { key: 'stage', label: 'Stage', width: 140 }
    ]
  },
  render: (args) => ({
    components: { Table: Table as Component },
    setup: () => ({ args }),
    template: `
      <Table v-bind="args">
        <template #cell-name="{ row }">
          <span class="flex flex-col gap-0.5">
            <span class="font-medium text-sui-ink">{{ row.name }}</span>
            <span class="line-clamp-2 text-13 text-sui-ink-muted">
              Asked about pricing for a team of five, then about onboarding, and whether the import keeps tags and notes.
            </span>
          </span>
        </template>
      </Table>
    `
  })
}
