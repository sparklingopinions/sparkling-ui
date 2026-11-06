<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useId } from 'vue'

import Icon from '../Icon/Icon.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import { useDragMove } from '../internal/useDragMove'
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
  /** The columns' ground: a soft fill by default; `canvas` (the page's, with a hairline) or `sunken` match a Table's or
   *  DataList's header tone, so the cards stand out on it. */
  columnTone?: 'fill' | 'canvas' | 'sunken'
}

const props = withDefaults(defineProps<BoardProps<T>>(), {
  rowKey: 'id' as never,
  fill: true,
  headingLevel: 3,
  cardFrame: true,
  onCardClick: undefined,
  onNew: undefined,
  newLabel: 'New',
  emptyLabel: 'No cards',
  columnTone: 'fill'
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

const { dragged, target, onPointerDown, endedDrag } = useDragMove({
  root,
  countOf: (column) => props.columns.find((c) => c.id === column)?.items.length ?? 0,
  sortable: () => props.sortable,
  onMove: (id, column, index) => emit('move', id, column, index)
})

function clickCard(event: MouseEvent, item: T) {
  if (endedDrag()) {
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

const grounds = { fill: 'bg-sui-fill', canvas: 'border border-sui-line-subtle bg-sui-canvas', sunken: 'sui-band' }
const columnGround = computed(() => grounds[props.columnTone])

const isTarget = (column: string, index: number, item: T) =>
  target.value?.zone === column && target.value.index === index && dragged.value?.id !== idOf(item)
// Past a column's last card, or into an empty one.
const dropsAtEnd = (column: BoardColumn<T>) =>
  target.value?.zone === column.id &&
  target.value.index >= column.items.length &&
  !(dragged.value?.zone === column.id && dragged.value.index === column.items.length - 1)

const frame =
  'border border-sui-edge bg-sui-raised p-4 transition-[border-color,opacity] duration-150 hover:border-sui-line-strong'
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
          class="ml-2 inline-flex h-5 items-center justify-center rounded-full bg-sui-fill px-2 text-xs text-sui-ink-muted tabular-nums"
        >
          <slot :column="column" name="count">{{ column.items.length }}</slot>
        </span>
      </header>
      <div
        class="group/body flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto rounded-xl p-2.5 transition-shadow duration-150"
        :class="[columnGround, target?.zone === column.id && 'ring-2 ring-sui-accent-line ring-inset']"
        :data-board-column="column.id"
        :data-drag-zone="column.id"
      >
        <template v-if="loading">
          <div v-for="i in 3" :key="i" aria-hidden="true" class="rounded-xl border border-sui-edge bg-sui-raised p-4">
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
              :data-drag-index="index"
              :role="onCardClick ? 'button' : undefined"
              :tabindex="onCardClick ? 0 : undefined"
              @click.capture="clickCard($event, item)"
              @contextmenu="dragged && $event.preventDefault()"
              @dragstart.prevent
              @keydown="onCardKeydown($event, item)"
              @pointerdown="onPointerDown($event, idOf(item), column.id, index)"
            >
              <slot :column="column" :item="item" name="card">
                <p class="m-0 text-sm font-semibold text-sui-ink">{{ item.name }}</p>
              </slot>
            </div>
          </li>
        </ul>
        <!-- Where a card dropped past the last one lands. -->
        <div
          v-if="dragged && dropsAtEnd(column)"
          aria-hidden="true"
          class="h-1 shrink-0 rounded-full bg-sui-accent-solid"
        />
        <button
          v-if="onNew && !loading && !dragged"
          class="flex h-(--sui-control-height) w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-dashed border-sui-line-strong text-xs font-medium text-sui-ink-muted opacity-0 outline-hidden transition-all duration-150 group-hover/body:opacity-100 hover:border-sui-ink-muted hover:bg-sui-surface/60 hover:text-sui-ink-body focus-visible:opacity-100 focus-visible:sui-ring"
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
