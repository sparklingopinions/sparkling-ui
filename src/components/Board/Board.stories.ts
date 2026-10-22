import { type Component, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

import { type Person, people, stageLabels } from '../../stories/people'
import Avatar from '../Avatar/Avatar.vue'
import Board from './Board.vue'

const stages = ['lead', 'contacted', 'customer'] as const

// No `component`: Board is generic over its items, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Collections/Board',
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
      const opened = ref<string[]>([])
      return { args, columns, move, add: () => {}, opened, open: (item: Person) => opened.value.push(item.name) }
    },
    template: `
      <Board v-bind="args" :columns="columns()" @card-click="open" @move="move" @new="add">
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
      <p class="mt-3 text-13 text-sui-ink-body" data-opened>{{ opened.join(', ') || 'Nothing opened' }}</p>
    `
  })
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const EmptyColumn: Story = { parameters: { people: people.filter((p) => p.stage !== 'customer') } }

export const Loading: Story = { args: { loading: true } }

const center = (el: Element) => {
  const r = el.getBoundingClientRect()
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
}
const column = (root: HTMLElement, id: string) => root.querySelector<HTMLElement>(`[data-board-column="${id}"]`)!
const firstCard = (root: HTMLElement, id: string) => column(root, id).querySelector<HTMLElement>('[data-board-index]')!
const names = (root: HTMLElement, id: string) =>
  [...column(root, id).querySelectorAll('[data-board-index] p:first-child')].map((p) => p.textContent?.trim())
const opened = (root: HTMLElement) => root.querySelector('[data-opened]')!.textContent

export const DragWithMouse: Story = {
  play: async ({ canvasElement }) => {
    const card = firstCard(canvasElement, 'lead')
    const name = names(canvasElement, 'lead')[0]
    const from = center(card)
    const to = center(column(canvasElement, 'customer'))
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: card, coords: { clientX: from.x, clientY: from.y } },
      { coords: { clientX: from.x + 10, clientY: from.y + 10 } },
      { coords: { clientX: to.x, clientY: to.y } },
      { keys: '[/MouseLeft]', coords: { clientX: to.x, clientY: to.y } }
    ])
    await waitFor(() => expect(names(canvasElement, 'customer')).toContain(name))
    // The press that ended the drag didn't open the card; a plain click does.
    await expect(opened(canvasElement)).toBe('Nothing opened')
    await userEvent.click(firstCard(canvasElement, 'lead'))
    await expect(opened(canvasElement)).not.toBe('Nothing opened')
  }
}

// A finger, as the browser reports it: pointer events of type touch.
const touch = (type: string, el: Element, x: number, y: number) =>
  el.dispatchEvent(
    new PointerEvent(type, {
      pointerType: 'touch',
      pointerId: 7,
      isPrimary: true,
      clientX: x,
      clientY: y,
      bubbles: true
    })
  )

export const DragWithTouch: Story = {
  play: async ({ canvasElement }) => {
    const before = names(canvasElement, 'customer').length
    const to = center(column(canvasElement, 'customer'))

    // A swipe that moves before the press is long enough scrolls instead of dragging.
    let card = firstCard(canvasElement, 'lead')
    let from = center(card)
    touch('pointerdown', card, from.x, from.y)
    touch('pointermove', card, from.x, from.y + 40)
    touch('pointermove', card, to.x, to.y)
    touch('pointerup', card, to.x, to.y)
    await expect(names(canvasElement, 'customer')).toHaveLength(before)

    // A press held a moment, then moved, drags.
    card = firstCard(canvasElement, 'lead')
    from = center(card)
    touch('pointerdown', card, from.x, from.y)
    await new Promise((resolve) => setTimeout(resolve, 350))
    touch('pointermove', card, from.x + 20, from.y)
    touch('pointermove', card, to.x, to.y)
    touch('pointerup', card, to.x, to.y)
    await waitFor(() => expect(names(canvasElement, 'customer')).toHaveLength(before + 1))
  }
}

export const ReorderInAColumn: Story = {
  play: async ({ canvasElement }) => {
    const [first, ...rest] = names(canvasElement, 'lead')
    const cards = column(canvasElement, 'lead').querySelectorAll('[data-board-index]')
    const card = cards[0]!
    const last = cards[cards.length - 1]!.getBoundingClientRect()
    const from = center(card)
    // The lower half of the last card: after it.
    const to = { x: last.x + last.width / 2, y: last.y + last.height * 0.75 }
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: card, coords: { clientX: from.x, clientY: from.y } },
      { coords: { clientX: from.x, clientY: from.y + 10 } },
      { coords: { clientX: to.x, clientY: to.y } },
      { keys: '[/MouseLeft]', coords: { clientX: to.x, clientY: to.y } }
    ])
    await waitFor(() => expect(names(canvasElement, 'lead')).toEqual([...rest, first]))
  }
}

export const EscapeCancelsADrag: Story = {
  play: async ({ canvasElement }) => {
    const before = names(canvasElement, 'customer')
    const card = firstCard(canvasElement, 'lead')
    const from = center(card)
    const to = center(column(canvasElement, 'customer'))
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: card, coords: { clientX: from.x, clientY: from.y } },
      { coords: { clientX: to.x, clientY: to.y } }
    ])
    await waitFor(() => expect(column(canvasElement, 'customer').className).toContain('ring-sui-accent-line'))
    await userEvent.keyboard('{Escape}')
    await userEvent.pointer({ keys: '[/MouseLeft]', coords: { clientX: to.x, clientY: to.y } })
    await expect(names(canvasElement, 'customer')).toEqual(before)
    await expect(document.querySelectorAll('[data-board-index][aria-hidden="true"]')).toHaveLength(0)
  }
}

// The card slot draws its own frame and its own link: the board adds no border and no button around it.
export const OwnCards: Story = {
  render: () => ({
    components: { Board: Board as Component },
    setup: () => ({
      columns: stages.map((stage) => ({
        id: stage,
        name: stageLabels[stage],
        items: people.slice(0, 7).filter((p) => p.stage === stage)
      }))
    }),
    template: `
      <Board :card-frame="false" :columns="columns" :fill="false">
        <template #card="{ item }">
          <div class="rounded-lg border border-sui-line bg-sui-surface px-4 py-3.5">
            <a class="text-sm font-medium text-sui-accent" href="#">{{ item.name }}</a>
            <p class="m-0 text-xs text-sui-ink-body">{{ item.company }}</p>
          </div>
        </template>
      </Board>
    `
  }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[role="button"]')).toHaveLength(0)
    await expect(firstCard(canvasElement, 'lead').className).not.toContain('border')
  }
}
