<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'

import Checkbox from '../Checkbox/Checkbox.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import type { TableColumn, TableSort } from './types'

export interface TableProps<T> {
  columns: TableColumn[]
  rows: T[]
  /** The row field that identifies it. */
  rowKey?: keyof T & string
  /** A checkbox column bound to `v-model:selected`; selected rows tint accent-wash. */
  selectable?: boolean
  /** Skeleton rows in place of the body. */
  loading?: boolean
  loadingRows?: number
  /** md: 57px rows. sm: 40px, for dense lists. */
  size?: 'md' | 'sm'
  /** A row height in px between the sizes, such as 44, for body and header rows; sets `--sui-table-row`. */
  rowHeight?: number
  /** canvas lays the header on the page colour, for a table directly on the canvas. */
  headerTone?: 'sunken' | 'canvas'
  /** The table's name for screen readers. */
  caption?: string
  selectAllLabel?: string
  selectRowLabel?: string
  /** Makes rows clickable (`@row-click`), e.g. to open the record. */
  onRowClick?: (row: T) => void
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  rowKey: 'id' as never,
  loadingRows: 5,
  size: 'md',
  rowHeight: undefined,
  headerTone: 'sunken',
  caption: undefined,
  selectAllLabel: 'Select all rows',
  selectRowLabel: 'Select row',
  onRowClick: undefined
})

const sort = defineModel<TableSort | null>('sort', { default: null })
const selected = defineModel<unknown[]>('selected', { default: () => [] })

const slots = defineSlots<
  {
    /** Shown in place of the body when there are no rows, e.g. an EmptyState. */
    empty?: () => unknown
    /** Replaces the body when given, e.g. an inset danger Alert with a retry. */
    error?: () => unknown
    /** A canvas strip under the rows: a rows-per-page Select, the range, Pagination. */
    footer?: () => unknown
  } & {
    [K in `cell-${string}`]?: (props: { row: T; value: unknown }) => unknown
  }
>()

const idOf = (row: T): unknown => row[props.rowKey ?? 'id']
const ids = computed(() => props.rows.map(idOf))
const allSelected = computed(() => ids.value.length > 0 && ids.value.every((id) => selected.value.includes(id)))
const someSelected = computed(() => !allSelected.value && ids.value.some((id) => selected.value.includes(id)))

function toggleAll() {
  selected.value = allSelected.value
    ? selected.value.filter((id) => !ids.value.includes(id))
    : [...new Set([...selected.value, ...ids.value])]
}

function toggle(id: unknown) {
  selected.value = selected.value.includes(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id]
}

// Sorting a column cycles ascending, descending, unsorted.
function sortBy(key: string) {
  const dir = sort.value?.key === key ? sort.value.dir : null
  const next = dir === null ? 'asc' : dir === 'asc' ? 'desc' : null
  sort.value = next ? { key, dir: next } : null
}

function dirOf(key: string) {
  return sort.value?.key === key ? sort.value.dir : null
}

function ariaSort(column: TableColumn) {
  const dir = dirOf(column.key)
  if (dir) return dir === 'asc' ? 'ascending' : 'descending'
  return column.sortable ? 'none' : undefined
}

const state = computed(() => {
  if (slots.error) return 'error'
  if (props.loading) return 'loading'
  return props.rows.length === 0 && slots.empty ? 'empty' : 'rows'
})

const columnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0))
const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }
const skeletonWidths = ['60%', '45%', '70%', '35%', '55%']

const sm = computed(() => props.size === 'sm')
const fixed = computed(() => props.rowHeight !== undefined)
const rowStyle = computed(() => (fixed.value ? { '--sui-table-row': `${props.rowHeight}px` } : undefined))
const th = computed(() => [
  'border-b border-sui-line-subtle text-13 font-medium whitespace-nowrap',
  sm.value ? 'h-[var(--sui-table-row,2.25rem)]' : 'h-[var(--sui-table-row,2.75rem)]'
])
const td = computed(() => [
  'border-b border-sui-line-subtle align-middle text-sui-ink-body group-last/row:border-b-0',
  sm.value ? 'h-[var(--sui-table-row,2.5rem)]' : 'h-[var(--sui-table-row,3.5625rem)]'
])
// A set row height takes the cells' vertical padding with it.
const pad = computed(() => [sm.value ? 'px-3' : 'px-4', !fixed.value && (sm.value ? 'py-1.5' : 'py-3')])
const headTone = computed(() => (props.headerTone === 'canvas' ? 'bg-sui-canvas' : 'bg-sui-sunken'))
const headPad = computed(() => (sm.value ? 'px-3' : 'px-4'))
const checkCell = 'w-12 pl-4'
</script>

<!-- A data table: sunken header strip, sortable headers, selection, loading, empty and error states, a footer. -->
<template>
  <div
    class="overflow-hidden rounded-xl border border-sui-line-subtle bg-sui-surface text-sm text-sui-ink"
    :style="rowStyle"
  >
    <div class="overflow-x-auto">
      <table class="w-full min-w-[var(--sui-table-min,720px)] table-fixed border-collapse">
        <caption v-if="caption" class="sr-only">
          {{
            caption
          }}
        </caption>
        <colgroup>
          <col v-if="selectable" class="w-12" />
          <col
            v-for="column in columns"
            :key="column.key"
            :style="{ width: typeof column.width === 'number' ? `${column.width}px` : column.width }"
          />
        </colgroup>
        <thead>
          <tr>
            <th v-if="selectable" :class="[th, checkCell, headTone]">
              <Checkbox
                :aria-label="selectAllLabel"
                :disabled="loading || rows.length === 0"
                :indeterminate="someSelected"
                :model-value="allSelected"
                @update:model-value="toggleAll"
              />
            </th>
            <component
              :is="column.label ? 'th' : 'td'"
              v-for="column in columns"
              :key="column.key"
              :aria-sort="ariaSort(column)"
              :class="[
                th,
                headPad,
                alignClass[column.align ?? 'left'],
                dirOf(column.key) ? 'bg-sui-accent-wash text-sui-accent' : [headTone, 'text-sui-ink-subtle']
              ]"
              :scope="column.label ? 'col' : undefined"
            >
              <button
                v-if="column.sortable"
                class="inline-flex h-full w-full items-center gap-1.5 rounded-md outline-hidden focus-visible:sui-ring-inset"
                :class="[
                  column.align === 'right' && 'justify-end',
                  column.align === 'center' && 'justify-center',
                  !dirOf(column.key) && 'hover:text-sui-ink'
                ]"
                type="button"
                @click="sortBy(column.key)"
              >
                {{ column.label }}
                <svg
                  aria-hidden="true"
                  class="size-3 shrink-0 fill-none stroke-current"
                  :class="!dirOf(column.key) && 'opacity-50'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  viewBox="0 0 12 12"
                >
                  <path v-if="dirOf(column.key) === 'asc'" d="M3 7.5 6 4.5l3 3" />
                  <path v-else-if="dirOf(column.key) === 'desc'" d="M3 4.5 6 7.5l3-3" />
                  <path v-else d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
                </svg>
              </button>
              <template v-else>{{ column.label }}</template>
            </component>
          </tr>
        </thead>
        <tbody :aria-busy="loading || undefined">
          <tr v-if="state === 'error' || state === 'empty'">
            <td class="p-0" :colspan="columnCount">
              <slot :name="state" />
            </td>
          </tr>
          <template v-else-if="state === 'loading'">
            <tr v-for="i in loadingRows" :key="i" aria-hidden="true" class="group/row">
              <td v-if="selectable" :class="[td, checkCell]"><Skeleton size="1rem" /></td>
              <td v-for="(column, j) in columns" :key="column.key" :class="[td, pad]">
                <Skeleton height="0.75rem" :width="skeletonWidths[(i + j) % 5]" />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="idOf(row) as PropertyKey"
              :aria-selected="selectable ? selected.includes(idOf(row)) : undefined"
              class="group/row transition-colors duration-150"
              :class="[
                selected.includes(idOf(row)) ? 'bg-sui-accent-wash' : 'hover:bg-sui-sunken',
                onRowClick && 'cursor-pointer'
              ]"
              @click="onRowClick?.(row)"
            >
              <td v-if="selectable" :class="[td, checkCell]" @click.stop>
                <Checkbox
                  :aria-label="selectRowLabel"
                  :model-value="selected.includes(idOf(row))"
                  @update:model-value="toggle(idOf(row))"
                />
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  td,
                  pad,
                  alignClass[column.align ?? 'left'],
                  column.wrap ? 'break-words whitespace-normal' : 'truncate'
                ]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  <template v-if="row[column.key] != null && row[column.key] !== ''">{{ row[column.key] }}</template>
                  <span v-else class="text-sui-ink-muted">–</span>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="$slots.footer"
      class="flex flex-wrap items-center justify-between gap-3 border-t border-sui-line-subtle bg-sui-canvas py-2 pr-3 pl-4 text-13 text-sui-ink-muted"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
