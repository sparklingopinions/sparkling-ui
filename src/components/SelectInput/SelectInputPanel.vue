<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { ListboxContent, ListboxFilter, ListboxItem, ListboxRoot, ListboxVirtualizer } from 'reka-ui'

import type { Hue } from '../../utils/hues'
import Spinner from '../Spinner/Spinner.vue'
import Tag from '../Tag/Tag.vue'
import type { SelectInputItem } from './types'

const props = defineProps<{
  items: SelectInputItem[]
  loading: boolean
  multiple: boolean
  canCreate: boolean
  createFn: (item: { name: string; color?: Hue }) => SelectInputItem | Promise<SelectInputItem>
  createColored: boolean
  inputPlaceholder: string
  emptyPlaceholder: string
  createLabel: string
  removeLabel: string
  label: string
}>()

const emit = defineEmits<{ 'query-change': [query: string]; done: [] }>()

const model = defineModel<SelectInputItem | SelectInputItem[] | null>({ required: true })

const query = ref('')
watch(query, (value) => emit('query-change', value))

const selected = computed(() => (Array.isArray(model.value) ? model.value : model.value ? [model.value] : []))

const filtered = computed(() =>
  props.items
    .filter((item) => !selected.value.some((chosen) => chosen.id === item.id))
    .filter((item) => item.name.toLowerCase().includes(query.value.toLowerCase()))
)

// A single choice already made can be removed, not typed over.
const canType = computed(() => props.multiple || !model.value)

const showCreate = computed(
  () =>
    props.canCreate &&
    filtered.value.length !== 1 &&
    !!query.value &&
    !props.items.some((item) => item.name.toLowerCase() === query.value.toLowerCase())
)

// More than this and the list renders only the rows in view, as MustLoop's did past 20.
const virtual = computed(() => filtered.value.length > 20)

const creatableColors: Hue[] = ['gray', 'purple', 'red', 'green', 'orange', 'pink', 'blue', 'slate']
const newColor = computed(() => creatableColors[query.value.length % creatableColors.length])

function choose(item: SelectInputItem) {
  if (Array.isArray(model.value)) model.value = [...model.value, item]
  else {
    model.value = item
    emit('done')
  }
  query.value = ''
}

function remove(item: SelectInputItem) {
  model.value = Array.isArray(model.value) ? model.value.filter((chosen) => chosen.id !== item.id) : null
}

async function create() {
  const created = await props.createFn(
    props.createColored ? { name: query.value, color: newColor.value } : { name: query.value }
  )
  choose(created)
}

function onSelect(event: CustomEvent, item: SelectInputItem | 'create') {
  // The listbox keeps no selection of its own: what's chosen lives in the model, and leaves the list.
  event.preventDefault()
  if (item === 'create') create()
  else choose(item)
}

// Reka highlights the first option as the list mounts; MustLoop's highlighted nothing until a hover or an arrow key.
const listbox = ref()
let mounting = true
onMounted(() => setTimeout(() => (mounting = false), 100))
function onHighlight() {
  if (!mounting) return
  mounting = false
  nextTick(() => listbox.value && (listbox.value.highlightedElement = null))
}

// MustLoop styled every span in an option as one truncated block, a custom option's too.
const optionClass =
  'relative flex min-h-8 cursor-pointer items-center rounded-md px-2 py-1 text-sm text-sui-ink data-highlighted:bg-sui-sunken [&_span]:block [&_span]:truncate'

function onBackspace() {
  if (query.value || !selected.value.length) return
  remove(selected.value[selected.value.length - 1]!)
}
</script>

<template>
  <ListboxRoot ref="listbox" :highlight-on-hover="true" :model-value="undefined" @highlight="onHighlight">
    <div class="-m-0.5 flex min-h-12 flex-wrap items-center px-4 py-3">
      <Tag
        v-for="item in selected"
        :key="item.id"
        class="m-0.5"
        :color="item.color ?? undefined"
        :name="item.name"
        removable
        :remove-label="removeLabel"
        @remove="remove(item)"
      />
      <!-- focus: classes too: an app's forms plugin rings focused text fields, and outranks plain utilities. -->
      <ListboxFilter
        v-model="query"
        :aria-label="label"
        autofocus
        class="m-0.5 h-4 min-w-12 flex-1 rounded-none border-none bg-transparent p-0 text-sm text-sui-ink shadow-none outline-hidden placeholder:text-sui-ink-muted focus:border-none focus:shadow-none focus:ring-0 focus:outline-hidden"
        :placeholder="selected.length ? '' : inputPlaceholder"
        :readonly="!canType"
        @keydown.backspace="onBackspace"
      />
    </div>
    <div class="border-b border-sui-sunken" />
    <span v-if="loading" class="flex justify-center py-8 text-sm font-normal text-sui-ink-subtle">
      <Spinner size="sm" />
    </span>
    <ListboxContent v-else-if="filtered.length || showCreate" :aria-label="label" class="max-h-56 overflow-auto p-2">
      <div v-if="virtual" class="h-40 overflow-auto">
        <ListboxVirtualizer
          v-slot="{ option }"
          :estimate-size="32"
          :options="filtered"
          :text-content="(item) => item.name"
        >
          <ListboxItem :class="optionClass" :value="option" @select="onSelect($event, option as SelectInputItem)">
            <slot :item="option" name="option">
              <span class="rounded-md bg-sui-sunken px-2 py-0.5 text-xs font-medium text-sui-ink-body">{{
                option.name
              }}</span>
            </slot>
          </ListboxItem>
        </ListboxVirtualizer>
      </div>
      <template v-else>
        <ListboxItem
          v-for="item in filtered"
          :key="item.id"
          :class="optionClass"
          :value="item"
          @select="onSelect($event, item)"
        >
          <slot :item="item" name="option">
            <span class="rounded-md bg-sui-sunken px-2 py-0.5 text-xs font-medium text-sui-ink-body">{{
              item.name
            }}</span>
          </slot>
        </ListboxItem>
      </template>
      <ListboxItem
        v-if="showCreate"
        class="relative flex min-h-8 cursor-pointer items-center rounded-md px-2 py-1 text-sm text-sui-ink data-highlighted:bg-sui-sunken"
        value="create"
        @select="onSelect($event, 'create')"
      >
        {{ createLabel }}
        <Tag v-if="createColored" class="ml-2" :color="newColor" :name="query" />
        <span v-else class="ml-1 font-medium text-sui-ink">“{{ query }}”</span>
      </ListboxItem>
    </ListboxContent>
    <span v-else class="block p-4 text-sm font-normal text-sui-ink-subtle">{{ emptyPlaceholder }}</span>
  </ListboxRoot>
</template>
