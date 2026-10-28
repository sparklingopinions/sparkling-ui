import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fireEvent, waitFor, within } from 'storybook/test'

import { people, stageLabels } from '../../stories/people'
import Avatar from '../Avatar/Avatar.vue'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Icon from '../Icon/Icon.vue'
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

export const LoadingCards: Story = { args: { loading: true, variant: 'cards', loadingGroups: [4, 1, 2] } }

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

const drafts = [
  { id: 1, title: 'Behind the name', icon: 'document', when: 'Today, 14:00', status: 'review' },
  { id: 2, title: 'Customer story', icon: 'image', when: 'Today, 16:30', status: 'review' },
  { id: 3, title: 'What we learned this year', icon: 'text', when: 'Tomorrow, 9:00', status: 'review' },
  { id: 4, title: 'Launch week, day one', icon: 'document', when: 'Mon, 9:00', status: 'scheduled' },
  { id: 5, title: 'A short thread on pricing', icon: 'messages', when: 'Tue, 11:00', status: 'scheduled' }
]
const draftGroups = [
  { id: 'review', label: 'In review', items: drafts.filter((d) => d.status === 'review') },
  { id: 'scheduled', label: 'Scheduled', items: drafts.filter((d) => d.status === 'scheduled') }
]

// Cards drawn denser: 40px canvas headers that don't fold, 44px rows with hairlines, the item's mark giving way to its
// checkbox, and a right-click menu whose inapplicable actions stay, disabled.
export const CardsWithLeadingSelection: Story = {
  render: () => ({
    components: { Badge, Button, DataList: DataList as Component, Icon },
    setup: () => {
      const selected = ref<unknown[]>([])
      const chosen = ref('Nothing chosen yet')
      const contextItems = (item: (typeof drafts)[number]) => [
        { type: 'action', label: 'Open', action: 'open', icon: 'external-link' },
        { type: 'separator' },
        {
          type: 'action',
          label: 'Approve',
          action: 'approve',
          icon: 'check',
          disabled: item.status !== 'review',
          disabledReason: item.status !== 'review' ? 'Already approved' : undefined
        },
        {
          type: 'action',
          label: 'Unschedule',
          action: 'unschedule',
          icon: 'calendar-x',
          disabled: item.status !== 'scheduled'
        }
      ]
      return { draftGroups, selected, chosen, contextItems }
    },
    template: `
      <div class="flex w-[40rem] flex-col gap-3 text-sm text-sui-ink">
        <DataList
          v-model:selected="selected"
          checkbox-placement="leading"
          :collapsible="false"
          context-label="Draft actions"
          :context-items="contextItems"
          dividers
          :group-header-height="40"
          group-header-tone="canvas"
          :groups="draftGroups"
          :row-height="44"
          selectable
          variant="cards"
          @context-item="(action, item) => (chosen = action.label + ' ' + item.title)"
          @row-click="(item) => (chosen = 'Open ' + item.title)"
        >
          <template #group-header="{ group, count }">
            <Badge :label="group.label" :tone="group.id === 'review' ? 'warning' : 'neutral'" dot />
            <span class="font-normal text-sui-ink-muted tabular-nums">{{ count }}</span>
          </template>
          <template #group-actions="{ group }">
            <Button v-if="group.id === 'scheduled'" size="sm" variant="ghost">Hide</Button>
          </template>
          <template #leading="{ item }">
            <Icon color="ink-subtle" :name="item.icon" />
          </template>
          <template #title="{ item }">{{ item.title }}</template>
          <template #meta="{ item }">{{ item.when }}</template>
        </DataList>
        <span>{{ chosen }} · {{ selected.length }} selected</span>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rows = canvas.getAllByRole('button').filter((el) => el.hasAttribute('data-list-row'))
    await fireEvent.click(rows[0]!, { ctrlKey: true })
    await fireEvent.click(rows[3]!, { shiftKey: true })
    await expect(canvas.getByText(/Nothing chosen yet/)).toBeInTheDocument()
    await expect(await canvas.findByText(/· 4 selected/)).toBeInTheDocument()
    await expect(canvas.getAllByRole('checkbox', { name: 'Select' }).filter((box) => box.offsetParent)).toHaveLength(5)

    await fireEvent.contextMenu(rows[4]!, { clientX: 200, clientY: 300 })
    const menu = await within(document.body).findByRole('menu', { name: 'Draft actions' })
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'))
    await expect(within(menu).getByRole('menuitem', { name: /Approve/ })).toHaveAttribute('aria-disabled', 'true')
  }
}
