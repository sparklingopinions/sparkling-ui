<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, useId, useTemplateRef } from 'vue'

import Checkbox from '../Checkbox/Checkbox.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import type { ListGroup } from './types'

export interface ListProps<T> {
  groups: ListGroup<T>[]
  /** The item field that identifies it. An item's `depth` indents it as a child. */
  rowKey?: keyof T & string
  /** A checkbox gutter bound to `v-model:selected`: it shows on hover, and on every row once anything is selected. */
  selectable?: boolean
  loading?: boolean
  /** The group headings' level, to fit the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Makes rows open on click and Enter (`@row-click`). */
  onRowClick?: (item: T) => void
  /** Adds a + to each group's header (`@new`). */
  onNew?: (group: ListGroup<T>) => void
  /** The + button's name; `{group}` is the group's name. */
  newLabel?: string
  collapseLabel?: string
  expandLabel?: string
  selectLabel?: string
}

const props = withDefaults(defineProps<ListProps<T>>(), {
  rowKey: 'id' as never,
  headingLevel: 3,
  onRowClick: undefined,
  onNew: undefined,
  newLabel: 'New in {group}',
  collapseLabel: 'Collapse group',
  expandLabel: 'Expand group',
  selectLabel: 'Select'
})

const selected = defineModel<unknown[]>('selected', { default: () => [] })
const collapsed = defineModel<string[]>('collapsed', { default: () => [] })

defineSlots<{
  /** Marks before a group's name, e.g. a status icon. */
  'group-leading'?: (props: { group: ListGroup<T> }) => unknown
  /** Small marks before an item's title: a status icon, an id, an avatar. */
  leading?: (props: { item: T }) => unknown
  /** The item's title; `item.name` by default. */
  title?: (props: { item: T }) => unknown
  /** Right-aligned meta: tags, an avatar, a date. Keep it to three or four things. */
  meta?: (props: { item: T }) => unknown
  /** Shown when every group is empty, e.g. an EmptyState. */
  empty?: () => unknown
}>()

const id = useId()
const root = useTemplateRef<HTMLElement>('root')

const idOf = (item: T): unknown => item[props.rowKey ?? 'id']
const interactive = computed(() => !!props.onRowClick || props.selectable)
const isEmpty = computed(() => !props.loading && props.groups.every((group) => group.items.length === 0))

function toggleGroup(groupId: string) {
  collapsed.value = collapsed.value.includes(groupId)
    ? collapsed.value.filter((x) => x !== groupId)
    : [...collapsed.value, groupId]
}

function toggle(item: T) {
  const key = idOf(item)
  selected.value = selected.value.includes(key) ? selected.value.filter((x) => x !== key) : [...selected.value, key]
}

// ↑ ↓ or j k move between rows, x selects, Enter and Space open.
function onKeydown(event: KeyboardEvent, item: T) {
  if (event.target !== event.currentTarget || event.metaKey || event.ctrlKey || event.altKey) return
  const rows = [...(root.value?.querySelectorAll<HTMLElement>('[data-list-row]') ?? [])]
  const i = rows.indexOf(event.currentTarget as HTMLElement)
  if (event.key === 'ArrowDown' || event.key === 'j') rows[Math.min(rows.length - 1, i + 1)]?.focus()
  else if (event.key === 'ArrowUp' || event.key === 'k') rows[Math.max(0, i - 1)]?.focus()
  else if (event.key === 'x' && props.selectable) toggle(item)
  else if ((event.key === 'Enter' || event.key === ' ') && props.onRowClick) props.onRowClick(item)
  else return
  event.preventDefault()
}

const skeletonWidths = ['42%', '58%', '35%', '50%', '46%']
const iconButton =
  'flex size-6 shrink-0 items-center justify-center rounded-md text-sui-ink-muted outline-hidden transition-colors duration-150 hover:bg-sui-line-subtle hover:text-sui-ink focus-visible:sui-ring-inset'
</script>

<!-- A grouped list: one dense line per record under sticky, collapsible group headers. -->
<template>
  <div
    ref="root"
    class="flex flex-col overflow-clip rounded-xl border border-sui-line-subtle bg-sui-surface text-13 text-sui-ink"
  >
    <slot v-if="isEmpty && $slots.empty" name="empty" />
    <section v-else-if="loading" :aria-busy="true">
      <div
        v-for="(width, i) in skeletonWidths"
        :key="i"
        aria-hidden="true"
        class="flex h-10 items-center gap-2.5 pr-4 pl-1"
      >
        <span class="w-6 shrink-0" />
        <Skeleton height="0.75rem" :width="width" />
        <span class="flex-1" />
        <Skeleton height="0.75rem" width="64px" />
      </div>
    </section>
    <template v-else>
      <section
        v-for="group in groups"
        :key="group.id"
        :aria-labelledby="group.name ? `${id}-${group.id}-name` : undefined"
        class="border-t border-sui-line-subtle first:border-t-0"
      >
        <header
          v-if="group.name"
          class="sticky top-0 z-10 flex h-9 items-center gap-2 border-b border-sui-line-subtle bg-sui-sunken pr-2 pl-1.5"
        >
          <button
            :aria-controls="`${id}-${group.id}`"
            :aria-expanded="!collapsed.includes(group.id)"
            :aria-label="collapsed.includes(group.id) ? expandLabel : collapseLabel"
            :class="iconButton"
            type="button"
            @click="toggleGroup(group.id)"
          >
            <svg
              aria-hidden="true"
              class="size-3 fill-none stroke-current transition-transform duration-150"
              :class="collapsed.includes(group.id) && '-rotate-90'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 12 12"
            >
              <path d="M3 4.5 6 7.5l3-3" />
            </svg>
          </button>
          <slot :group="group" name="group-leading" />
          <component
            :is="`h${headingLevel}`"
            :id="`${id}-${group.id}-name`"
            class="m-0 text-13 font-medium text-sui-ink"
          >
            {{ group.name }}
          </component>
          <span class="text-13 text-sui-ink-muted tabular-nums">{{ group.count ?? group.items.length }}</span>
          <button
            v-if="onNew"
            :aria-label="newLabel.replace('{group}', group.name)"
            class="ml-auto"
            :class="iconButton"
            type="button"
            @click="onNew(group)"
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
          </button>
        </header>
        <ul v-show="!collapsed.includes(group.id)" :id="`${id}-${group.id}`" class="m-0 list-none p-0">
          <li
            v-for="item in group.items"
            :key="idOf(item) as PropertyKey"
            class="group/row flex h-10 items-center transition-colors duration-100 has-focus-visible:sui-ring-inset"
            :class="
              selected.includes(idOf(item))
                ? 'bg-sui-accent-wash'
                : 'hover:bg-sui-sunken has-focus-visible:bg-sui-sunken'
            "
            :style="item.depth ? { paddingLeft: `${item.depth * 22}px` } : undefined"
          >
            <span
              v-if="selectable"
              class="flex w-7 shrink-0 justify-end transition-opacity duration-100"
              :class="selected.length ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'"
            >
              <Checkbox
                :aria-label="selectLabel"
                :model-value="selected.includes(idOf(item))"
                tabindex="-1"
                @update:model-value="toggle(item)"
              />
            </span>
            <div
              class="flex h-full min-w-0 flex-1 items-center gap-2.5 pr-4 outline-hidden"
              :class="[selectable ? 'pl-2.5' : 'pl-4', onRowClick && 'cursor-pointer']"
              data-list-row
              :role="onRowClick ? 'button' : undefined"
              :tabindex="interactive ? 0 : undefined"
              @click="onRowClick?.(item)"
              @keydown="onKeydown($event, item)"
            >
              <span v-if="$slots.leading" class="flex shrink-0 items-center gap-2 text-sui-ink-muted tabular-nums">
                <slot :item="item" name="leading" />
              </span>
              <span class="min-w-0 flex-1 truncate font-medium text-sui-ink">
                <slot :item="item" name="title">{{ item.name }}</slot>
              </span>
              <span v-if="$slots.meta" class="flex shrink-0 items-center gap-2 text-xs text-sui-ink-muted tabular-nums">
                <slot :item="item" name="meta" />
              </span>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
