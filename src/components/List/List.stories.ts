import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { people, stageLabels } from '../../stories/people'
import Avatar from '../Avatar/Avatar.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Tag from '../Tag/Tag.vue'
import List from './List.vue'

const groups = (['contacted', 'lead', 'customer'] as const).map((stage) => ({
  id: stage,
  name: stageLabels[stage],
  items: people.filter((person) => person.stage === stage)
}))

// No `component`: List is generic over its items, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/List',
  args: { groups, selectable: true, loading: false },
  render: (args, { parameters }) => ({
    components: { Avatar, EmptyState, List: List as Component, Tag },
    setup: () => ({
      args,
      selected: ref<unknown[]>(parameters.selected ?? []),
      collapsed: ref<string[]>(parameters.collapsed ?? []),
      open: () => {},
      add: () => {}
    }),
    template: `
      <List v-bind="args" v-model:collapsed="collapsed" v-model:selected="selected" @new="add" @row-click="open">
        <template #leading="{ item }">
          <span class="w-12">ID-{{ item.id }}</span>
          <Avatar :name="item.name" size="xs" />
        </template>
        <template #meta="{ item }">
          <Tag v-if="item.company" :name="item.company" />
          <span v-if="item.lastContact" class="w-12 text-right">{{ item.lastContact }}</span>
        </template>
        <template #empty>
          <EmptyState icon="users" title="No people yet" description="People are individual contacts you interact with." />
        </template>
      </List>
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
