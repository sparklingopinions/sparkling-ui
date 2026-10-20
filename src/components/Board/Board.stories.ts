import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { type Person, people, stageLabels } from '../../stories/people'
import Avatar from '../Avatar/Avatar.vue'
import Board from './Board.vue'

const stages = ['lead', 'contacted', 'customer'] as const

// No `component`: Board is generic over its items, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Board',
  args: { loading: false, sortable: true, fill: false },
  render: (args, { parameters }) => ({
    components: { Avatar, Board: Board as Component },
    setup: () => {
      const records = ref<Person[]>(parameters.people ?? people.slice(0, 7))
      const columns = () =>
        stages.map((stage) => ({
          id: stage,
          name: stageLabels[stage],
          items: records.value.filter((p) => p.stage === stage)
        }))
      // Moves the record, keeping the order the board showed.
      const move = (id: number, stage: Person['stage'], index: number) => {
        const person = records.value.find((p) => p.id === id)!
        const rest = records.value.filter((p) => p.id !== id)
        const inStage = rest.filter((p) => p.stage === stage)
        const before = inStage[index]
        const moved = { ...person, stage }
        const at = before ? rest.indexOf(before) : rest.length
        records.value = [...rest.slice(0, at), moved, ...rest.slice(at)]
      }
      return { args, columns, move, add: () => {} }
    },
    template: `
      <Board v-bind="args" :columns="columns()" @move="move" @new="add">
        <template #card="{ item }">
          <div class="flex items-center gap-3">
            <Avatar :name="item.name" size="md" />
            <div class="min-w-0">
              <p class="m-0 truncate text-sm font-medium text-sui-ink">{{ item.name }}</p>
              <p class="m-0 truncate text-xs text-sui-ink-body">{{ item.email }}</p>
            </div>
          </div>
        </template>
      </Board>
    `
  })
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const EmptyColumn: Story = { parameters: { people: people.filter((p) => p.stage !== 'customer') } }

export const Loading: Story = { args: { loading: true } }
