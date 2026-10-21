<script setup lang="ts" generic="T extends SelectValue">
import { computed, nextTick, ref, useAttrs } from 'vue'

import {
  ListboxContent,
  ListboxFilter,
  ListboxItem,
  ListboxRoot,
  ListboxVirtualizer,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot
} from 'reka-ui'

import type { Hue } from '../../utils/hues'
import { useFieldControl } from '../FormField/context'
import Spinner from '../Spinner/Spinner.vue'
import Tag from '../Tag/Tag.vue'
import CheckIcon from '../internal/CheckIcon.vue'
import type { SelectOption, SelectValue } from './types'

export interface SelectProps<T extends SelectValue> {
  options: SelectOption<T>[]
  multiple?: boolean
  /** A filter row at the top of the list; on by default for `multiple`, `canCreate` or more than 8 options. */
  searchable?: boolean
  /** Offers to create what was typed, through `createOption`. */
  canCreate?: boolean
  /** Makes the created option; by default its value is its label. */
  createOption?: (draft: { label: string; color?: Hue }) => SelectOption<T> | Promise<SelectOption<T>>
  /** Creates with a hue, shown as a tag. */
  createColored?: boolean
  loading?: boolean
  /** 36px for forms, 28px for table feet and toolbars. */
  size?: 'md' | 'sm'
  disabled?: boolean
  invalid?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
  createLabel?: string
  removeLabel?: string
  /** Where the list opens; it flips when there's no room. */
  side?: 'bottom' | 'top'
  align?: 'start' | 'end'
  /** The list's width, when it should differ from the trigger's, e.g. `20rem`. */
  panelWidth?: string
}

// Attributes (aria-label, class for its width) go to the trigger, the one element in the page's flow.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps<T>>(), {
  searchable: undefined,
  createOption: undefined,
  createColored: true,
  size: 'md',
  placeholder: 'Select an option',
  searchPlaceholder: 'Type to filter',
  emptyLabel: 'No results found',
  createLabel: 'Create',
  removeLabel: 'Remove',
  side: 'bottom',
  align: 'start',
  panelWidth: undefined
})

const emit = defineEmits<{ 'query-change': [query: string] }>()

// An aria-label would hide the trigger's visible value from its name; it's said before the value instead.
const attrs = useAttrs()
const label = computed(() => attrs['aria-label'] as string | undefined)
const triggerAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'aria-label')))

const model = defineModel<T | T[] | null>({ default: null })

const open = ref(false)
const query = ref('')
const keyboard = ref(false)

const values = computed<T[]>(() =>
  Array.isArray(model.value) ? model.value : model.value === null || model.value === undefined ? [] : [model.value]
)
const selected = computed(() =>
  values.value.map((value) => props.options.find((option) => option.value === value)).filter((option) => !!option)
)
const search = computed(() => props.searchable ?? (props.multiple || props.canCreate || props.options.length > 8))
const listed = computed(() => {
  const text = query.value.trim().toLowerCase()
  return props.options
    .filter((option) => !(props.multiple && search.value && values.value.includes(option.value)))
    .filter((option) => !text || option.label.toLowerCase().includes(text))
})
const showCreate = computed(() => {
  const text = query.value.trim().toLowerCase()
  return props.canCreate && !!text && !props.options.some((option) => option.label.toLowerCase() === text)
})
// More than this and the list renders only the rows in view.
const virtual = computed(() => listed.value.length > 20)

const createHues: Hue[] = ['gray', 'purple', 'red', 'green', 'orange', 'pink', 'blue', 'slate']
const newHue = computed(() => createHues[query.value.length % createHues.length])
const CREATE = { create: true } as const

const { attrs: fieldAttrs, invalid: isInvalid } = useFieldControl(
  () => undefined,
  () => props.invalid
)

function setQuery(text: string) {
  query.value = text
  emit('query-change', text)
}

function show(viaKeyboard: boolean) {
  if (props.disabled) return
  keyboard.value = viaKeyboard
  open.value = true
}

function close() {
  open.value = false
  if (query.value) setQuery('')
}

function toggle(event?: Event) {
  if (open.value) close()
  // A click from the keyboard (Enter, Space) has no pointer position.
  else show(!!event && (event as MouseEvent).detail === 0)
}

function choose(option: SelectOption<T>) {
  if (props.multiple) {
    model.value = values.value.includes(option.value)
      ? values.value.filter((value) => value !== option.value)
      : [...values.value, option.value]
    setQuery('')
  } else {
    model.value = option.value
    close()
  }
}

async function create() {
  const label = query.value.trim()
  const draft = props.createColored ? { label, color: newHue.value } : { label }
  const option = props.createOption
    ? await props.createOption(draft)
    : ({ value: label as T, label, color: draft.color } as SelectOption<T>)
  choose(option)
}

function onSelect(event: CustomEvent, row: SelectOption<T> | typeof CREATE) {
  // What's chosen lives in the model; the listbox keeps no selection of its own.
  event.preventDefault()
  if ('create' in row) create()
  else if (!row.disabled) choose(row)
}

function remove(value: T) {
  model.value = values.value.filter((chosen) => chosen !== value)
}

function onKeydown(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) keyboard.value = true
  if (event.key === 'Backspace' && props.multiple && !query.value && values.value.length)
    remove(values.value[values.value.length - 1]!)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (!open.value && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    show(true)
  }
}

// The filter takes focus when there is one, or else the list, so the arrow keys work at once.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  nextTick(() =>
    (event.target as HTMLElement | null)?.querySelector<HTMLElement>('[data-select-filter], [role="listbox"]')?.focus()
  )
}

// Back to the trigger, which Reka can't find: it's our anchor, not its trigger.
const anchor = ref<{ $el: HTMLElement }>()
function returnFocus(event: Event) {
  event.preventDefault()
  anchor.value?.$el?.focus()
}

// Reka highlights the first option as the list mounts; only the chosen one, or the keyboard, should be.
const listbox = ref()
function onHighlight(payload: { value: unknown } | undefined) {
  if (keyboard.value || !payload) return
  if (values.value.includes(payload.value as T)) return
  nextTick(() => listbox.value && !keyboard.value && (listbox.value.highlightedElement = null))
}

const triggerSizes = { md: 'min-h-9 pr-2.5 pl-3 text-sm', sm: 'h-7 pr-1.5 pl-2 text-13' }
const optionClass =
  'flex min-h-8 cursor-pointer items-center justify-between gap-3 rounded-lg py-1.5 pr-2 pl-2.5 text-13 whitespace-nowrap text-sui-ink outline-hidden select-none data-disabled:cursor-default data-disabled:opacity-50 data-highlighted:bg-sui-sunken data-[state=checked]:font-medium data-[state=checked]:text-sui-accent group-data-keyboard/list:data-highlighted:sui-ring-inset'
</script>

<!-- One select for every choice: a short fixed list, a searchable one, several values as tags (`multiple`), or creating
     what was typed (`canCreate`). The `trigger` slot draws your own trigger and gets `open`, `toggle` and `selected`. -->
<template>
  <PopoverRoot :open="open" @update:open="(value) => (value ? show(false) : close())">
    <PopoverAnchor ref="anchor" as-child>
      <slot name="trigger" :open="open" :selected="selected" :toggle="toggle">
        <button
          v-bind="{ ...fieldAttrs, ...triggerAttrs }"
          :aria-expanded="open"
          aria-haspopup="listbox"
          :aria-invalid="isInvalid ? 'true' : undefined"
          class="group inline-flex items-center justify-between gap-1.5 rounded-(--sui-radius-button) border bg-sui-surface text-left text-sui-ink transition-[border-color,box-shadow] duration-150 focus-visible:border-sui-accent focus-visible:sui-ring-field disabled:pointer-events-none disabled:opacity-60"
          :class="[
            triggerSizes[size],
            isInvalid ? 'border-sui-danger-mid' : 'border-sui-line-strong hover:border-sui-ink-muted'
          ]"
          :disabled="disabled"
          type="button"
          @click="toggle"
          @keydown="onTriggerKeydown"
        >
          <span v-if="label" class="sr-only">{{ label }}: </span>
          <span v-if="!selected.length" class="text-sui-ink-faint">{{ placeholder }}</span>
          <span v-else-if="multiple" class="flex flex-wrap gap-1 py-1.25">
            <Tag
              v-for="option in selected"
              :key="option.value"
              :color="option.color ?? undefined"
              :name="option.label"
            />
          </span>
          <Tag v-else-if="selected[0]!.color" :color="selected[0]!.color" :name="selected[0]!.label" />
          <span v-else class="min-w-0 truncate whitespace-nowrap">{{ selected[0]!.label }}</span>
          <svg
            aria-hidden="true"
            class="size-4 shrink-0 fill-none stroke-sui-ink-muted transition-transform duration-150 group-aria-expanded:rotate-180"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            viewBox="0 0 16 16"
          >
            <path d="M4.5 6.5 8 10l3.5-3.5" />
          </svg>
        </button>
      </slot>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        :align="align"
        :aria-label="label ?? placeholder"
        class="z-[1000] overflow-hidden rounded-xl border border-sui-line-subtle bg-sui-surface text-sui-ink shadow-lg data-[state=open]:animate-sui-menu-in"
        :class="
          search ? 'min-w-[max(var(--reka-popover-trigger-width),15rem)]' : 'min-w-(--reka-popover-trigger-width)'
        "
        :side="side"
        :side-offset="4"
        :style="panelWidth ? { width: panelWidth } : undefined"
        @close-auto-focus="returnFocus"
        @open-auto-focus="onOpenAutoFocus"
      >
        <ListboxRoot
          ref="listbox"
          :highlight-on-hover="true"
          :model-value="multiple ? values : (values[0] ?? undefined)"
          :multiple="multiple"
          @highlight="onHighlight"
          @keydown="onKeydown"
          @pointermove="keyboard = false"
        >
          <div
            v-if="search"
            class="flex min-h-11 flex-wrap items-center gap-1 border-b border-sui-line-subtle px-3 py-2.5"
          >
            <template v-if="multiple">
              <Tag
                v-for="option in selected"
                :key="option.value"
                :color="option.color ?? undefined"
                :name="option.label"
                removable
                :remove-label="removeLabel"
                @remove="remove(option.value)"
              />
            </template>
            <!-- focus: classes too: an app's forms plugin rings focused text fields, and outranks plain utilities. -->
            <ListboxFilter
              :aria-label="label ?? placeholder"
              class="h-5 min-w-16 flex-1 rounded-none border-none bg-transparent p-0 text-13 text-sui-ink shadow-none outline-hidden placeholder:text-sui-ink-faint focus:border-none focus:shadow-none focus:ring-0 focus:outline-hidden"
              data-select-filter
              :model-value="query"
              :placeholder="multiple && selected.length ? '' : searchPlaceholder"
              @update:model-value="setQuery"
            />
          </div>
          <div v-if="loading" class="flex justify-center py-6"><Spinner size="sm" /></div>
          <ListboxContent
            v-else-if="listed.length || showCreate"
            :aria-label="label ?? placeholder"
            class="group/list max-h-60 overflow-auto p-1 outline-hidden"
            :data-keyboard="keyboard || undefined"
          >
            <ListboxVirtualizer
              v-if="virtual"
              v-slot="{ option }"
              :estimate-size="32"
              :options="listed"
              :text-content="(option) => option.label"
            >
              <ListboxItem
                :class="optionClass"
                :disabled="option.disabled"
                :value="option.value"
                @select="onSelect($event, option as SelectOption<T>)"
              >
                <span class="inline-flex min-w-0 items-center gap-1.5 truncate">
                  <slot name="option" :option="option as SelectOption<T>">
                    <Tag v-if="option.color" :color="option.color" :name="option.label" />
                    <template v-else>{{ option.label }}</template>
                  </slot>
                </span>
                <CheckIcon v-if="values.includes(option.value)" />
              </ListboxItem>
            </ListboxVirtualizer>
            <template v-else>
              <ListboxItem
                v-for="option in listed"
                :key="option.value"
                :class="optionClass"
                :disabled="option.disabled"
                :value="option.value"
                @select="onSelect($event, option)"
              >
                <span class="inline-flex min-w-0 items-center gap-1.5 truncate">
                  <slot name="option" :option="option">
                    <Tag v-if="option.color" :color="option.color" :name="option.label" />
                    <template v-else>{{ option.label }}</template>
                  </slot>
                </span>
                <CheckIcon v-if="values.includes(option.value)" />
              </ListboxItem>
            </template>
            <ListboxItem v-if="showCreate" :class="optionClass" :value="CREATE" @select="onSelect($event, CREATE)">
              <span class="inline-flex min-w-0 items-center gap-1.5">
                {{ createLabel }}
                <Tag v-if="createColored" :color="newHue" :name="query.trim()" />
                <strong v-else class="font-medium">“{{ query.trim() }}”</strong>
              </span>
            </ListboxItem>
          </ListboxContent>
          <div v-else class="px-3.5 py-3 text-13 text-sui-ink-muted">{{ emptyLabel }}</div>
        </ListboxRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
