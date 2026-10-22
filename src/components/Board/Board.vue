<script setup lang="ts" generic="T extends Record<string, any>">
import { onBeforeUnmount, ref, useId } from 'vue'

import Icon from '../Icon/Icon.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import type { BoardColumn } from './types'

export interface BoardProps<T> {
  columns: BoardColumn<T>[]
  /** The item field that identifies it. */
  rowKey?: keyof T & string
  /** Cards also reorder within a column, for records that carry a position. */
  sortable?: boolean
  /** Columns run to the bottom of the parent and scroll inside it; give the parent a height. False sizes them to their cards. */
  fill?: boolean
  loading?: boolean
  /** The columns' heading level, to fit the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Draws each card's border, padding and surface. False when the `card` slot draws its own. */
  cardFrame?: boolean
  /** Makes a card a button that opens on click, Enter and Space (`@card-click`). Without it, the card slot carries its
   *  own link or buttons. */
  onCardClick?: (item: T) => void
  /** Adds a dashed "New" button at the foot of each column, shown on hover (`@new`). */
  onNew?: (column: BoardColumn<T>) => void
  newLabel?: string
  emptyLabel?: string
}

const props = withDefaults(defineProps<BoardProps<T>>(), {
  rowKey: 'id' as never,
  fill: true,
  headingLevel: 3,
  cardFrame: true,
  onCardClick: undefined,
  onNew: undefined,
  newLabel: 'New',
  emptyLabel: 'No cards'
})

const emit = defineEmits<{
  /** A card dropped into a column, at its new index there. Show it moved at once; put it back if saving fails. */
  move: [id: unknown, column: string, index: number]
}>()

defineSlots<{
  /** A card's content; `item.name` as a title by default. */
  card?: (props: { item: T; column: BoardColumn<T> }) => unknown
  /** Replaces a column's count, e.g. its summed deal value. */
  count?: (props: { column: BoardColumn<T> }) => unknown
}>()

const id = useId()
const idOf = (item: T): unknown => item[props.rowKey ?? 'id']
const root = ref<HTMLElement>()

const dragged = ref<{ id: unknown; column: string; index: number } | null>(null)
const target = ref<{ column: string; index: number } | null>(null)

// Dragging runs on pointer events, so it works with a mouse, a pen and a finger. A mouse drags once it moves a few
// pixels, so a click still clicks; a finger after a short press, so a swipe still scrolls.
const MOUSE_SLOP = 4
const TOUCH_SLOP = 8
const TOUCH_DELAY = 250
const EDGE = 48

let pending: {
  item: T
  column: string
  index: number
  x: number
  y: number
  card: HTMLElement
  touch: boolean
} | null = null
let pressTimer: number | undefined
let ghost: HTMLElement | null = null
let grab = { x: 0, y: 0 }
let justDragged = false

function onPointerDown(event: PointerEvent, item: T, column: string, index: number) {
  if (event.button !== 0 || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  const touch = event.pointerType === 'touch'
  pending = { item, column, index, x: event.clientX, y: event.clientY, card: event.currentTarget as HTMLElement, touch }
  if (touch) pressTimer = window.setTimeout(() => pending && start(), TOUCH_DELAY)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', stop)
  window.addEventListener('touchmove', holdScroll, { passive: false })
  window.addEventListener('keydown', onEscape)
}

function start() {
  if (!pending) return
  const rect = pending.card.getBoundingClientRect()
  grab = { x: pending.x - rect.left, y: pending.y - rect.top }
  ghost = pending.card.cloneNode(true) as HTMLElement
  ghost.removeAttribute('id')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.classList.add('pointer-events-none', 'fixed', 'top-0', 'left-0', 'z-[1300]', 'shadow-lg', 'opacity-95')
  ghost.style.width = `${rect.width}px`
  document.body.appendChild(ghost)
  follow(pending.x, pending.y)
  dragged.value = { id: idOf(pending.item), column: pending.column, index: pending.index }
}

function onPointerMove(event: PointerEvent) {
  if (!pending) return
  if (!dragged.value) {
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y)
    // A finger that moves before the press is long enough is scrolling.
    if (pending.touch) return moved > TOUCH_SLOP ? stop() : undefined
    if (moved < MOUSE_SLOP) return
    start()
  }
  event.preventDefault()
  follow(event.clientX, event.clientY)
  aim(event.clientX, event.clientY)
  scrollNear(event.clientX, event.clientY)
}

function follow(x: number, y: number) {
  if (ghost) ghost.style.transform = `translate(${x - grab.x}px, ${y - grab.y}px) rotate(1.5deg)`
}

// What's under the pointer: a card's top half drops before it, the bottom half after; an empty spot, at the end.
function aim(x: number, y: number) {
  const under = document.elementFromPoint(x, y)
  const body = under?.closest<HTMLElement>('[data-board-column]')
  if (!body || !root.value?.contains(body)) {
    target.value = null
    return
  }
  const column = body.dataset.boardColumn!
  const card = under!.closest<HTMLElement>('[data-board-index]')
  let index = props.columns.find((c) => c.id === column)?.items.length ?? 0
  if (card && body.contains(card)) {
    const rect = card.getBoundingClientRect()
    index = Number(card.dataset.boardIndex) + (y < rect.top + rect.height / 2 ? 0 : 1)
  }
  if (target.value?.column !== column || target.value.index !== index) target.value = { column, index }
}

// Near a column's top or bottom, or the board's sides, it scrolls that way.
function scrollNear(x: number, y: number) {
  const body = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-board-column]')
  if (body) {
    const rect = body.getBoundingClientRect()
    if (y < rect.top + EDGE) body.scrollTop -= 12
    else if (y > rect.bottom - EDGE) body.scrollTop += 12
  }
  const board = root.value?.getBoundingClientRect()
  if (board && root.value) {
    if (x < board.left + EDGE) root.value.scrollLeft -= 12
    else if (x > board.right - EDGE) root.value.scrollLeft += 12
  }
}

function onPointerUp() {
  const from = dragged.value
  const to = target.value
  if (from && to) {
    let index = to.index
    if (from.column === to.column) {
      // Within a column the dragged card leaves its old slot first.
      if (index > from.index) index--
      if (props.sortable && index !== from.index) emit('move', from.id, to.column, index)
    } else {
      emit('move', from.id, to.column, index)
    }
  }
  stop()
}

function holdScroll(event: TouchEvent) {
  if (dragged.value) event.preventDefault()
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && dragged.value) {
    event.preventDefault()
    stop()
  }
}

function stop() {
  window.clearTimeout(pressTimer)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', stop)
  window.removeEventListener('touchmove', holdScroll)
  window.removeEventListener('keydown', onEscape)
  ghost?.remove()
  ghost = null
  // The click that ends a drag isn't a click on the card.
  if (dragged.value) {
    justDragged = true
    window.setTimeout(() => (justDragged = false))
  }
  pending = null
  dragged.value = null
  target.value = null
}

onBeforeUnmount(stop)

function clickCard(event: MouseEvent, item: T) {
  if (justDragged) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  props.onCardClick?.(item)
}

function onCardKeydown(event: KeyboardEvent, item: T) {
  if (!props.onCardClick || event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
  event.preventDefault()
  props.onCardClick(item)
}

const isTarget = (column: string, index: number, item: T) =>
  target.value?.column === column && target.value.index === index && dragged.value?.id !== idOf(item)

const frame =
  'border border-sui-line-subtle bg-sui-surface p-4 transition-[border-color,opacity] duration-150 hover:border-sui-line'
</script>

<!-- A board: cards in columns by a field (a stage, a status), dragged between columns. -->
<template>
  <div
    ref="root"
    class="flex items-stretch gap-5 overflow-x-auto pb-2 after:w-1 after:shrink-0 after:content-['']"
    :class="fill && 'h-full min-h-0 flex-1'"
  >
    <section
      v-for="column in columns"
      :key="column.id"
      :aria-labelledby="`${id}-${column.id}`"
      class="flex min-h-0 w-full max-w-xs min-w-[16rem] shrink-0 flex-col"
    >
      <header class="flex items-center justify-between px-1 pb-2.5">
        <component
          :is="`h${headingLevel}`"
          :id="`${id}-${column.id}`"
          class="m-0 flex items-center gap-2 text-sm font-semibold text-sui-ink"
        >
          <Icon v-if="column.icon" :color="column.iconColor ?? 'ink-subtle'" :name="column.icon" />
          {{ column.name }}
        </component>
        <span
          class="ml-2 inline-flex h-5 items-center justify-center rounded-full bg-sui-sunken px-2 text-xs text-sui-ink-muted tabular-nums"
        >
          <slot :column="column" name="count">{{ column.items.length }}</slot>
        </span>
      </header>
      <div
        class="group/body flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto rounded-xl bg-sui-sunken p-2.5 transition-shadow duration-150"
        :class="target?.column === column.id && 'ring-2 ring-sui-accent-line ring-inset'"
        :data-board-column="column.id"
      >
        <template v-if="loading">
          <div
            v-for="i in 3"
            :key="i"
            aria-hidden="true"
            class="rounded-xl border border-sui-line-subtle bg-sui-surface p-4"
          >
            <Skeleton class="mb-3" />
            <Skeleton height="0.75rem" width="70%" />
          </div>
        </template>
        <p
          v-else-if="column.items.length === 0 && !dragged"
          class="m-0 px-1 py-3 text-center text-13 text-sui-ink-muted"
        >
          {{ emptyLabel }}
        </p>
        <ul v-else class="m-0 flex list-none flex-col gap-2.5 p-0">
          <li v-for="(item, index) in column.items" :key="idOf(item) as PropertyKey">
            <div
              class="relative rounded-xl outline-hidden transition-opacity duration-150 select-none"
              :class="[
                cardFrame && frame,
                onCardClick && 'cursor-pointer focus-visible:sui-ring',
                dragged?.id === idOf(item) && 'opacity-40',
                isTarget(column.id, index, item) && 'shadow-[0_-6px_0_-4px_rgb(var(--sui-accent-solid))]'
              ]"
              :data-board-index="index"
              :role="onCardClick ? 'button' : undefined"
              :tabindex="onCardClick ? 0 : undefined"
              @click.capture="clickCard($event, item)"
              @contextmenu="dragged && $event.preventDefault()"
              @dragstart.prevent
              @keydown="onCardKeydown($event, item)"
              @pointerdown="onPointerDown($event, item, column.id, index)"
            >
              <slot :column="column" :item="item" name="card">
                <p class="m-0 text-sm font-semibold text-sui-ink">{{ item.name }}</p>
              </slot>
            </div>
          </li>
        </ul>
        <button
          v-if="onNew && !loading"
          class="flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-dashed border-sui-line-strong text-xs font-medium text-sui-ink-muted opacity-0 outline-hidden transition-all duration-150 group-hover/body:opacity-100 hover:border-sui-ink-muted hover:bg-sui-surface/60 hover:text-sui-ink-body focus-visible:opacity-100 focus-visible:sui-ring"
          type="button"
          @click="onNew(column)"
        >
          <svg
            aria-hidden="true"
            class="size-3.5 fill-none stroke-current"
            stroke-linecap="round"
            stroke-width="1.5"
            viewBox="0 0 14 14"
          >
            <path d="M7 2.5v9M2.5 7h9" />
          </svg>
          {{ newLabel }}
        </button>
      </div>
    </section>
  </div>
</template>
