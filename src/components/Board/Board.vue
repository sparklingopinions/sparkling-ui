<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, useId } from 'vue'

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
  /** Adds a dashed "New" button at the foot of each column, shown on hover (`@new`). */
  onNew?: (column: BoardColumn<T>) => void
  newLabel?: string
  emptyLabel?: string
}

const props = withDefaults(defineProps<BoardProps<T>>(), {
  rowKey: 'id' as never,
  fill: true,
  headingLevel: 3,
  onNew: undefined,
  newLabel: 'New',
  emptyLabel: 'No cards'
})

const emit = defineEmits<{
  'card-click': [item: T]
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

const dragged = ref<{ id: unknown; column: string; index: number } | null>(null)
const target = ref<{ column: string; index: number } | null>(null)

function onDragStart(event: DragEvent, item: T, column: string, index: number) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(idOf(item)))
  }
  dragged.value = { id: idOf(item), column, index }
}

function onDragEnd() {
  dragged.value = null
  target.value = null
}

function overColumn(event: DragEvent, column: BoardColumn<T>) {
  if (!dragged.value) return
  event.preventDefault()
  if (target.value?.column !== column.id) target.value = { column: column.id, index: column.items.length }
}

// The card's top half drops before it, the bottom half after.
function overCard(event: DragEvent, column: string, index: number) {
  if (!dragged.value) return
  event.preventDefault()
  event.stopPropagation()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const at = event.clientY < rect.top + rect.height / 2 ? index : index + 1
  if (target.value?.column !== column || target.value.index !== at) target.value = { column, index: at }
}

function onLeave(event: DragEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) target.value = null
}

function onDrop(event: DragEvent, column: BoardColumn<T>) {
  event.preventDefault()
  const from = dragged.value
  if (from) {
    let index = target.value?.column === column.id ? target.value.index : column.items.length
    if (from.column === column.id) {
      // Within a column the dragged card leaves its old slot first.
      if (index > from.index) index--
      if (props.sortable && index !== from.index) emit('move', from.id, column.id, index)
    } else {
      emit('move', from.id, column.id, index)
    }
  }
  onDragEnd()
}

function onCardKeydown(event: KeyboardEvent, item: T) {
  if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
  event.preventDefault()
  emit('card-click', item)
}

const isTarget = (column: string, index: number, item: T) =>
  target.value?.column === column && target.value.index === index && dragged.value?.id !== idOf(item)
</script>

<!-- A board: cards in columns by a field (a stage, a status), dragged between columns. -->
<template>
  <div
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
        @dragleave="onLeave"
        @dragover="overColumn($event, column)"
        @drop="onDrop($event, column)"
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
              class="relative cursor-pointer rounded-xl border border-sui-line-subtle bg-sui-surface p-4 outline-hidden transition-[border-color,opacity] duration-150 hover:border-sui-line focus-visible:sui-ring"
              :class="[
                dragged?.id === idOf(item) && 'opacity-40',
                isTarget(column.id, index, item) && 'shadow-[0_-6px_0_-4px_rgb(var(--sui-accent-solid))]'
              ]"
              draggable="true"
              role="button"
              tabindex="0"
              @click="emit('card-click', item)"
              @dragend="onDragEnd"
              @dragover="overCard($event, column.id, index)"
              @dragstart="onDragStart($event, item, column.id, index)"
              @keydown="onCardKeydown($event, item)"
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
