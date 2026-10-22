import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { people, stageLabels } from '../../stories/people'
import Avatar from '../Avatar/Avatar.vue'
import Badge from '../Badge/Badge.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Tag from '../Tag/Tag.vue'
import DataList from './DataList.vue'

const groups = (['contacted', 'lead', 'customer'] as const).map((stage) => ({
  id: stage,
  name: stageLabels[stage],
  items: people.filter((person) => person.stage === stage)
}))

// No `component`: DataList is generic over its items, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Collections/DataList',
  args: { groups, selectable: true, loading: false },
  render: (args, { parameters }) => ({
    components: { Avatar, Badge, EmptyState, DataList: DataList as Component, Tag },
    setup: () => ({
      args,
      selected: ref<unknown[]>(parameters.selected ?? []),
      tones: parameters.tones,
      collapsed: ref<string[]>(parameters.collapsed ?? []),
      open: () => {},
      add: () => {}
    }),
    template: `
      <DataList v-bind="args" v-model:collapsed="collapsed" v-model:selected="selected" @new="add" @row-click="open">
        <template #leading="{ item }">
          <span class="w-12">ID-{{ item.id }}</span>
          <Avatar :name="item.name" size="xs" />
        </template>
        <template #meta="{ item }">
          <Tag v-if="item.company" :name="item.company" />
          <span v-if="item.lastContact" class="w-12 text-right">{{ item.lastContact }}</span>
        </template>
        ${parameters.slots ?? ''}
        <template #empty>
          <EmptyState icon="users" title="No people yet" description="People are individual contacts you interact with." />
        </template>
      </DataList>
    `
  })
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const Selecting: Story = { parameters: { selected: [1, 4] } }

export const Collapsed: Story = { parameters: { collapsed: ['lead'] } }

export const Children: Story = {
  args: {
    groups: [
      {
        id: 'all',
        name: 'Companies',
        items: [
          { id: 1, name: 'Analytical Engines' },
          { id: 2, name: 'Ada Lovelace', depth: 1 },
          { id: 3, name: 'Charles Babbage', depth: 1 },
          { id: 4, name: 'Bell Labs' },
          { id: 5, name: 'Dennis Ritchie', depth: 1 }
        ]
      }
    ]
  }
}

export const Ungrouped: Story = { args: { groups: [{ id: 'all', items: people.slice(0, 5) }], selectable: false } }

export const Loading: Story = { args: { loading: true } }

export const Empty: Story = { args: { groups: groups.map((group) => ({ ...group, items: [] })) } }

export const Cards: Story = { args: { variant: 'cards' } }

const tones = { contacted: 'warning', lead: 'neutral', customer: 'success' } as const

const labelledGroups = groups.map((group) => ({ ...group, name: undefined, label: group.name }))

export const StatusHeaders: Story = {
  args: { variant: 'cards', groups: labelledGroups },
  parameters: {
    tones,
    slots: `
      <template #group-header="{ group, count }">
        <Badge :label="group.label" :tone="tones[group.id]" dot />
        <span class="font-normal text-sui-ink-muted tabular-nums">{{ count }}</span>
      </template>
    `
  }
}

export const JoinedWithStatusHeaders: Story = {
  args: { groups: labelledGroups },
  parameters: StatusHeaders.parameters
}
