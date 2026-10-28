<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, useId, useTemplateRef } from 'vue'

import Checkbox from '../Checkbox/Checkbox.vue'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import type { DropdownMenuAction, DropdownMenuEntry } from '../internal/menu'
import type { DataListGroup } from './types'

export interface DataListProps<T> {
  groups: DataListGroup<T>[]
  /** The item field that identifies it. An item's `depth` indents it as a child. */
  rowKey?: keyof T & string
  /** A checkbox bound to `v-model:selected`: it shows on hover and focus, and on every row once anything is selected.
   *  Shift-click (or Shift+Space) selects a range, Cmd or Ctrl-click toggles one row, Shift+↑ ↓ extends. */
  selectable?: boolean
  /** gutter: the checkbox in its own column. leading: it takes the place of the `leading` slot's first mark. */
  checkboxPlacement?: 'gutter' | 'leading'
  loading?: boolean
  /** While loading, the placeholder groups drawn, as each one's number of rows. */
  loadingGroups?: number[]
  /** joined: one frame, sticky sunken group headers. cards: each group its own card, 12px apart, headers not sticky. */
  variant?: 'joined' | 'cards'
  /** The group headings' level, to fit the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** The group headers' ground; by default sunken when joined, surface as cards. */
  groupHeaderTone?: 'sunken' | 'surface' | 'canvas'
  /** The group headers' height in px (36 by default); sets `--sui-list-header`. */
  groupHeaderHeight?: number
  /** Groups fold away under a chevron; a group's own `collapsible` wins. */
  collapsible?: boolean
  /** The rows' height in px, such as 44 (40 by default); sets `--sui-list-row`. */
  rowHeight?: number
  /** A hairline between rows. */
  dividers?: boolean
  /** Wraps each row in a ContextMenu of these items (`@context-item`); return [] for none. */
  contextItems?: (item: T) => DropdownMenuEntry[]
  /** The context menu's accessible name. */
  contextLabel?: string
  /** Makes rows open on click and Enter (`@row-click`). */
  onRowClick?: (item: T) => void
  /** Adds a + to each group's header (`@new`). */
  onNew?: (group: DataListGroup<T>) => void
  /** The + button's name; `{group}` is the group's name. */
  newLabel?: string
  collapseLabel?: string
  expandLabel?: string
  selectLabel?: string
}

const props = withDefaults(defineProps<DataListProps<T>>(), {
  rowKey: 'id' as never,
  loadingGroups: () => [4, 2],
  variant: 'joined',
  checkboxPlacement: 'gutter',
  headingLevel: 3,
  groupHeaderTone: undefined,
  groupHeaderHeight: undefined,
  collapsible: true,
  rowHeight: undefined,
  dividers: false,
  contextItems: undefined,
  contextLabel: undefined,
  onRowClick: undefined,
  onNew: undefined,
  newLabel: 'New in {group}',
  collapseLabel: 'Collapse group',
  expandLabel: 'Expand group',
  selectLabel: 'Select'
})

const emit = defineEmits<{ 'context-item': [action: DropdownMenuAction, item: T] }>()

const selected = defineModel<unknown[]>('selected', { default: () => [] })
const collapsed = defineModel<string[]>('collapsed', { default: () => [] })

const slots = defineSlots<{
  /** Marks before a group's name, e.g. a status icon. */
  'group-leading'?: (props: { group: DataListGroup<T> }) => unknown
  /** Your own group header in place of the name and count, e.g. a status Badge and a count; inside the heading. */
  'group-header'?: (props: { group: DataListGroup<T>; count: number; collapsed: boolean }) => unknown
  /** Small marks before an item's title: a status icon, an id, an avatar. With `checkboxPlacement="leading"`, the
   *  first mark gives way to the checkbox. */
  leading?: (props: { item: T; selected: boolean; selecting: boolean; toggle: () => void }) => unknown
  /** The item's title; `item.name` by default. */
  title?: (props: { item: T }) => unknown
  /** Right-aligned meta: tags, an avatar, a date. Keep it to three or four things. */
  meta?: (props: { item: T }) => unknown
  /** Controls at the end of a group's header, e.g. Show and Hide. */
  'group-actions'?: (props: { group: DataListGroup<T> }) => unknown
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

const collapsibleGroup = (group: DataListGroup<T>) => group.collapsible ?? props.collapsible
const isCollapsed = (group: DataListGroup<T>) => collapsibleGroup(group) && collapsed.value.includes(group.id)
const visibleItems = computed(() => props.groups.filter((group) => !isCollapsed(group)).flatMap((group) => group.items))

// Where a range starts: the row last toggled.
let anchorKey: unknown = undefined

function toggle(item: T) {
  const key = idOf(item)
  anchorKey = key
  selected.value = selected.value.includes(key) ? selected.value.filter((x) => x !== key) : [...selected.value, key]
}

function selectRange(item: T) {
  const keys = visibleItems.value.map(idOf)
  const to = keys.indexOf(idOf(item))
  const from = keys.indexOf(anchorKey)
  const span = from < 0 ? [keys[to]] : keys.slice(Math.min(from, to), Math.max(from, to) + 1)
  if (from < 0) anchorKey = idOf(item)
  selected.value = [...selected.value, ...span.filter((key) => !selected.value.includes(key))]
}

function select(...items: T[]) {
  const keys = items.map(idOf).filter((key) => !selected.value.includes(key))
  if (keys.length) selected.value = [...selected.value, ...new Set(keys)]
}

function clickRow(event: MouseEvent, item: T) {
  if (props.selectable && event.shiftKey) selectRange(item)
  else if (props.selectable && (event.metaKey || event.ctrlKey)) toggle(item)
  // Leading checkboxes stand in for the row's mark, so while selecting a click selects, as in a mail list.
  else if (props.selectable && leading.value && selected.value.length) toggle(item)
  else props.onRowClick?.(item)
}

// A shift-click selects rather than highlighting the text between.
function onRowMousedown(event: MouseEvent) {
  if (props.selectable && event.shiftKey) event.preventDefault()
}

// ↑ ↓ or j k move between rows, x selects, Enter and Space open; with Shift, ↑ ↓ extend the selection and Space
// selects a range.
function onKeydown(event: KeyboardEvent, item: T) {
  if (event.target !== event.currentTarget || event.metaKey || event.ctrlKey || event.altKey) return
  // A collapsed group's rows are still in the DOM, hidden.
  const rows = [...(root.value?.querySelectorAll<HTMLElement>('[data-list-row]') ?? [])].filter(
    (row) => row.closest('ul')?.style.display !== 'none'
  )
  const i = rows.indexOf(event.currentTarget as HTMLElement)
  const down = event.key === 'ArrowDown' || event.key === 'j'
  const up = event.key === 'ArrowUp' || event.key === 'k'
  if ((down || up) && event.shiftKey && props.selectable) {
    const j = down ? Math.min(rows.length - 1, i + 1) : Math.max(0, i - 1)
    const next = visibleItems.value[j]
    select(item, ...(next ? [next] : []))
    rows[j]?.focus()
  } else if (down) rows[Math.min(rows.length - 1, i + 1)]?.focus()
  else if (up) rows[Math.max(0, i - 1)]?.focus()
  else if (event.key === ' ' && event.shiftKey && props.selectable) selectRange(item)
  else if (event.key.toLowerCase() === 'x' && props.selectable) toggle(item)
  else if ((event.key === 'Enter' || event.key === ' ') && props.onRowClick) props.onRowClick(item)
  else return
  event.preventDefault()
}

const cards = computed(() => props.variant === 'cards')
const leading = computed(() => props.selectable && props.checkboxPlacement === 'leading')
const gutter = computed(() => props.selectable && props.checkboxPlacement === 'gutter')
const tones = { sunken: 'bg-sui-sunken', surface: 'bg-sui-surface', canvas: 'bg-sui-canvas' }
const headerTone = computed(() => tones[props.groupHeaderTone ?? (cards.value ? 'surface' : 'sunken')])
const sizes = computed(() => {
  const style: Record<string, string> = {}
  if (props.rowHeight !== undefined) style['--sui-list-row'] = `${props.rowHeight}px`
  if (props.groupHeaderHeight !== undefined) style['--sui-list-header'] = `${props.groupHeaderHeight}px`
  return Object.keys(style).length ? style : undefined
})
const card = 'overflow-clip rounded-xl border border-sui-line-subtle bg-sui-surface'
const custom = (group: DataListGroup<T>) => !!slots['group-header'] || group.header !== undefined
const groupName = (group: DataListGroup<T>) => group.label ?? group.name ?? ''

const skeletonWidths = ['42%', '58%', '35%', '50%', '46%', '38%']
const skeletonGroupWidths = ['5.5rem', '4rem', '4.75rem']
// A Skeleton is sunken, so on a sunken header band its bars go a step darker.
const headerBar = computed(() => [
  'animate-pulse',
  headerTone.value === tones.sunken ? 'bg-sui-line-subtle' : 'bg-sui-sunken'
])
const iconButton =
  'flex size-6 shrink-0 items-center justify-center rounded-md text-sui-ink-muted outline-hidden transition-colors duration-150 hover:bg-sui-line-subtle hover:text-sui-ink focus-visible:sui-ring-inset'
</script>

<!-- A grouped list: one dense line per record under sticky, collapsible group headers. -->
<template>
  <div ref="root" class="flex flex-col text-13 text-sui-ink" :class="cards ? 'gap-3' : card" :style="sizes">
    <div v-if="isEmpty && $slots.empty" :class="cards && card">
      <slot name="empty" />
    </div>
    <!-- Placeholder groups in the list's own shape: its header, rows, leading marks and meta. -->
    <template v-else-if="loading">
      <section
        v-for="(rows, g) in loadingGroups"
        :key="g"
        aria-busy="true"
        :class="cards ? card : 'border-t border-sui-line-subtle first:border-t-0'"
      >
        <div
          aria-hidden="true"
          class="flex h-[var(--sui-list-header,2.25rem)] items-center gap-2 border-b border-sui-line-subtle pr-2"
          :class="[headerTone, collapsible ? 'pl-1.5' : 'pl-4']"
        >
          <span v-if="collapsible" class="size-6 shrink-0" />
          <span
            v-if="$slots['group-leading'] || $slots['group-header']"
            class="size-3.5 rounded-full"
            :class="headerBar"
          />
          <span class="h-2.5 rounded-md" :class="headerBar" :style="{ width: skeletonGroupWidths[g % 3] }" />
          <span class="h-2.5 w-3.5 rounded-md" :class="headerBar" />
        </div>
        <div
          v-for="r in rows"
          :key="r"
          aria-hidden="true"
          class="flex h-[var(--sui-list-row,2.5rem)] items-center gap-2.5 pr-4"
          :class="[gutter ? 'pl-9.5' : 'pl-4', dividers && '[&+&]:border-t [&+&]:border-sui-line-subtle']"
        >
          <Skeleton v-if="$slots.leading || leading" shape="circle" size="1.25rem" />
          <Skeleton height="0.75rem" :width="skeletonWidths[(g * 3 + r) % skeletonWidths.length]" />
          <span class="flex-1" />
          <template v-if="$slots.meta">
            <Skeleton height="0.625rem" width="6rem" />
            <Skeleton height="0.625rem" width="3.5rem" />
          </template>
        </div>
      </section>
    </template>
    <template v-else>
      <section
        v-for="group in groups"
        :key="group.id"
        :aria-label="group.label"
        :aria-labelledby="!group.label && (group.name || custom(group)) ? `${id}-${group.id}-name` : undefined"
        :class="cards ? card : 'border-t border-sui-line-subtle first:border-t-0'"
      >
        <header
          v-if="group.name || custom(group)"
          class="flex h-[var(--sui-list-header,2.25rem)] items-center gap-2 border-b border-sui-line-subtle pr-2"
          :class="[headerTone, !cards && 'sticky top-0 z-10', collapsibleGroup(group) ? 'pl-1.5' : 'pl-4']"
        >
          <button
            v-if="collapsibleGroup(group)"
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
              :class="isCollapsed(group) && '-rotate-90'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 12 12"
            >
              <path d="M3 4.5 6 7.5l3-3" />
            </svg>
          </button>
          <component
            :is="`h${headingLevel}`"
            v-if="custom(group)"
            :id="`${id}-${group.id}-name`"
            class="m-0 flex min-w-0 items-center gap-2 text-13 font-medium text-sui-ink"
          >
            <slot
              :collapsed="collapsed.includes(group.id)"
              :count="group.count ?? group.items.length"
              :group="group"
              name="group-header"
              >{{ group.header }}</slot
            >
          </component>
          <template v-else>
            <slot :group="group" name="group-leading" />
            <component
              :is="`h${headingLevel}`"
              :id="`${id}-${group.id}-name`"
              class="m-0 text-13 font-medium text-sui-ink"
            >
              {{ group.name }}
            </component>
            <span class="text-13 text-sui-ink-muted tabular-nums">{{ group.count ?? group.items.length }}</span>
          </template>
          <span class="ml-auto flex items-center gap-1">
            <slot :group="group" name="group-actions" />
          </span>
          <button
            v-if="onNew"
            :aria-label="newLabel.replace('{group}', groupName(group))"
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
        <ul v-show="!isCollapsed(group)" :id="`${id}-${group.id}`" class="m-0 list-none p-0">
          <ContextMenu
            v-for="item in group.items"
            :key="idOf(item) as PropertyKey"
            :disabled="!contextItems"
            :items="contextItems?.(item)"
            :label="contextLabel"
            @click-item="emit('context-item', $event, item)"
          >
            <li
              class="group/row relative flex h-[var(--sui-list-row,2.5rem)] items-center transition-colors duration-100 has-focus-visible:sui-ring-inset"
              :class="[
                dividers && '[&+&]:border-t [&+&]:border-sui-line-subtle',
                selected.includes(idOf(item))
                  ? 'bg-sui-accent-wash'
                  : 'hover:bg-sui-sunken has-focus-visible:bg-sui-sunken'
              ]"
              :style="item.depth ? { paddingLeft: `${item.depth * 22}px` } : undefined"
            >
              <!-- Outside the row, which is a button, over the leading slot's first mark: 16px in, or more for a child. -->
              <span
                v-if="leading"
                class="absolute top-1/2 z-[1] flex size-4 -translate-y-1/2 items-center justify-center"
                :class="!selected.length && 'hidden group-hover/row:flex group-has-focus-visible/row:flex'"
                data-list-check
                :style="{ left: `${16 + (item.depth ?? 0) * 22}px` }"
              >
                <Checkbox
                  :aria-label="selectLabel"
                  :model-value="selected.includes(idOf(item))"
                  tabindex="-1"
                  @update:model-value="toggle(item)"
                />
              </span>
              <span
                v-if="gutter"
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
                :class="[gutter ? 'pl-2.5' : 'pl-4', (onRowClick || selectable) && 'cursor-pointer']"
                data-list-row
                :role="onRowClick ? 'button' : undefined"
                :tabindex="interactive ? 0 : undefined"
                @click="clickRow($event, item)"
                @keydown="onKeydown($event, item)"
                @mousedown="onRowMousedown"
              >
                <span
                  v-if="$slots.leading"
                  class="flex shrink-0 items-center gap-2 text-sui-ink-muted tabular-nums"
                  :class="
                    leading &&
                    (selected.length
                      ? '[&>*:first-child]:invisible'
                      : 'group-hover/row:[&>*:first-child]:invisible group-has-focus-visible/row:[&>*:first-child]:invisible')
                  "
                >
                  <slot
                    :item="item"
                    name="leading"
                    :selected="selected.includes(idOf(item))"
                    :selecting="selected.length > 0"
                    :toggle="() => toggle(item)"
                  />
                </span>
                <span class="min-w-0 flex-1 truncate font-medium text-sui-ink">
                  <slot :item="item" name="title">{{ item.name }}</slot>
                </span>
                <span
                  v-if="$slots.meta"
                  class="flex shrink-0 items-center gap-2 text-xs text-sui-ink-muted tabular-nums"
                >
                  <slot :item="item" name="meta" />
                </span>
              </div>
            </li>
          </ContextMenu>
        </ul>
      </section>
    </template>
  </div>
</template>
