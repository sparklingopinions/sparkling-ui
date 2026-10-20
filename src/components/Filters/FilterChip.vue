<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  RadioGroupItem,
  RadioGroupRoot
} from 'reka-ui'

import Checkbox from '../Checkbox/Checkbox.vue'
import Icon from '../Icon/Icon.vue'
import Input from '../Input/Input.vue'
import SegmentedControl from '../SegmentedControl/SegmentedControl.vue'
import CheckIcon from '../internal/CheckIcon.vue'
import FilterFrame from './FilterFrame.vue'
import FilterGlyph from './FilterGlyph.vue'
import { datePresets as defaultDatePresets, describeFilter, filterOperators } from './defaults'
import type { FilterFieldType, FilterOperator, FilterOption, FilterValue } from './types'

export interface FilterChipProps {
  /** A filter, read as a sentence; `add` is the quiet "+ Filter" that starts one (FilterMenu includes it). */
  kind?: 'filter' | 'add'
  field?: string
  /** Picks the editor: a checklist for enum, person and company, an input for text and number, presets for date, Yes / No for boolean. */
  type?: FilterFieldType
  /** An app icon for the field, instead of the type's glyph. */
  icon?: string
  /** The operators offered; English ones by type by default. */
  operators?: FilterOperator[]
  /** The choices for enum, person and company. */
  options?: FilterOption[]
  /** The live result count in the panel's footer, e.g. "120 people". */
  status?: string
  /** The plural noun once more than two values are picked: "3 stages". */
  valueLabel?: string
  datePresets?: string[]
  /** Adds a Remove action to the panel (`@remove`). */
  onRemove?: () => void
  removeLabel?: string
  addLabel?: string
  operatorLabel?: string
  searchPlaceholder?: string
  valuePlaceholder?: string
  doneLabel?: string
  closeLabel?: string
  yesLabel?: string
  noLabel?: string
}

// Attributes and listeners go to the chip itself; the root is a renderless popover.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FilterChipProps>(), {
  kind: 'filter',
  field: undefined,
  type: 'enum',
  icon: undefined,
  operators: undefined,
  options: () => [],
  status: undefined,
  valueLabel: 'values',
  datePresets: () => defaultDatePresets,
  onRemove: undefined,
  removeLabel: 'Remove',
  addLabel: 'Filter',
  operatorLabel: 'Operator',
  searchPlaceholder: 'Search…',
  valuePlaceholder: 'Type a value',
  doneLabel: 'Done',
  closeLabel: 'Close',
  yesLabel: 'Yes',
  noLabel: 'No'
})

const op = defineModel<string>('op')
const value = defineModel<FilterValue>({ default: null })
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** Your own editor, in place of the type's. */
  default?: () => unknown
}>()

const attrs = useAttrs()

const ops = computed(() => props.operators ?? filterOperators[props.type])
const current = computed(() => ops.value.find((o) => o.value === op.value))
const needsValue = computed(() => !current.value?.noValue)
const text = computed(() =>
  needsValue.value
    ? describeFilter(value.value, props.options, {
        valueLabel: props.valueLabel,
        yesLabel: props.yesLabel,
        noLabel: props.noLabel
      })
    : ''
)
const isChecklist = computed(() => ['enum', 'person', 'company'].includes(props.type))

const query = ref('')
const listed = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.options.filter((o) => o.label.toLowerCase().includes(q)) : props.options
})

const picked = computed(() => (Array.isArray(value.value) ? value.value : []))

function toggle(choice: string | number) {
  value.value = picked.value.includes(choice) ? picked.value.filter((v) => v !== choice) : [...picked.value, choice]
}

function remove() {
  open.value = false
  props.onRemove?.()
}

const chip =
  'inline-flex h-7.5 items-center gap-1.5 rounded-lg border text-13 whitespace-nowrap outline-hidden transition-[border-color,box-shadow] duration-150 focus-visible:sui-ring'
const row =
  'flex min-h-8 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-left text-13.5 outline-hidden transition-colors duration-100 focus-visible:sui-ring-inset'
const rowOn = 'bg-sui-accent-wash font-semibold text-sui-accent'
const rowOff = 'text-sui-ink hover:bg-sui-sunken'
const hueDots: Record<string, string> = {
  blue: 'bg-sui-hue-blue-ink',
  green: 'bg-sui-hue-green-ink',
  orange: 'bg-sui-hue-orange-ink',
  pink: 'bg-sui-hue-pink-ink',
  purple: 'bg-sui-hue-purple-ink',
  slate: 'bg-sui-hue-slate-ink',
  red: 'bg-sui-hue-red-ink',
  amber: 'bg-sui-hue-amber-ink'
}
</script>

<!-- A view's filter as a sentence chip ("Stage is any of Lead, Customer"), whose panel changes it as you go. -->
<template>
  <button
    v-if="kind === 'add'"
    v-bind="attrs"
    class="border-dashed border-sui-line-strong px-2 font-medium text-sui-ink-muted hover:border-sui-ink-muted hover:text-sui-ink-body"
    :class="chip"
    type="button"
  >
    <FilterGlyph name="plus" />
    {{ addLabel }}
  </button>
  <PopoverRoot v-else v-model:open="open">
    <PopoverTrigger
      v-bind="attrs"
      class="border-sui-accent-line bg-sui-accent-wash pr-1.5 pl-2 text-sui-accent hover:border-sui-accent-bright data-[state=open]:border-sui-accent-solid data-[state=open]:shadow-[0_0_0_3px_rgb(var(--sui-focus-ring))]"
      :class="chip"
    >
      <Icon v-if="icon" class="size-3.5 opacity-80" color="accent" :name="icon" />
      <FilterGlyph v-else class="opacity-80" :name="type" />
      <!-- Real spaces between the words, so the chip's name reads as a sentence. -->
      <span
        ><span class="font-medium">{{ field }}</span
        ><template v-if="current">{{ ' ' }}{{ current.label }}</template
        ><template v-if="text"
          >{{ ' ' }}<span class="font-semibold">{{ text }}</span></template
        ></span
      >
      <svg
        aria-hidden="true"
        class="size-3.5 shrink-0 fill-none stroke-current opacity-70"
        stroke-linecap="round"
        stroke-width="2.2"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        class="z-[1000] w-85 max-w-[calc(100vw-2rem)] origin-(--reka-popover-content-transform-origin) rounded-xl border border-sui-line bg-sui-surface text-sui-ink shadow-lg data-[state=open]:animate-sui-overlay-in"
        :side-offset="8"
      >
        <FilterFrame :close-label="closeLabel" :enter-label="doneLabel" :status="status" @enter="open = false">
          <div class="flex h-11 items-center gap-1.5 pr-1.5 pl-3.5 text-sui-ink-muted">
            <Icon v-if="icon" color="ink-muted" :name="icon" />
            <FilterGlyph v-else class="size-4" :name="type" />
            <span class="text-sm font-semibold text-sui-ink">{{ field }}</span>
            <DropdownMenuRoot v-if="ops.length > 1">
              <DropdownMenuTrigger
                :aria-label="`${operatorLabel}: ${current?.label ?? ''}`"
                class="inline-flex h-7 items-center gap-0.5 rounded-md pr-1 pl-1.5 text-13.5 font-medium text-sui-accent outline-hidden transition-colors duration-150 hover:bg-sui-accent-wash focus-visible:sui-ring-inset data-[state=open]:bg-sui-accent-wash"
              >
                {{ current?.label }}
                <svg
                  aria-hidden="true"
                  class="size-3.5 fill-none stroke-current"
                  stroke-linecap="round"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="start"
                  class="z-[1001] w-44 rounded-lg border border-sui-line bg-sui-surface p-1 shadow-lg data-[state=open]:animate-sui-menu-in"
                  :side-offset="4"
                >
                  <DropdownMenuRadioGroup v-model="op">
                    <DropdownMenuRadioItem
                      v-for="operator in ops"
                      :key="operator.value"
                      class="flex h-8 cursor-pointer items-center justify-between rounded-md px-2.5 text-13.5 text-sui-ink-body outline-hidden select-none data-highlighted:bg-sui-sunken data-[state=checked]:font-semibold data-[state=checked]:text-sui-ink"
                      :value="operator.value"
                    >
                      {{ operator.label }}
                      <CheckIcon v-if="operator.value === op" />
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
            <span v-else class="text-13.5 text-sui-ink-muted">{{ current?.label }}</span>
            <button
              v-if="onRemove"
              class="ml-auto inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-12.5 font-medium text-sui-ink-muted outline-hidden transition-colors duration-150 hover:bg-sui-danger-soft hover:text-sui-danger focus-visible:sui-ring-inset"
              type="button"
              @click="remove"
            >
              <FilterGlyph name="trash" />
              {{ removeLabel }}
            </button>
          </div>

          <slot v-if="$slots.default" />
          <template v-else-if="needsValue">
            <template v-if="isChecklist">
              <div
                v-if="options.length > 6"
                class="mx-2 mb-1 flex h-9 items-center gap-2 rounded-lg border border-sui-line-subtle px-2.5 text-sui-ink-muted"
              >
                <FilterGlyph class="size-4" name="search" />
                <!-- focus: classes too: an app's forms plugin rings focused text fields, and outranks plain utilities. -->
                <input
                  v-model="query"
                  :aria-label="searchPlaceholder"
                  autofocus
                  class="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-sm text-sui-ink shadow-none outline-hidden placeholder:text-sui-ink-faint focus:border-none focus:shadow-none focus:ring-0 focus:outline-hidden"
                  :placeholder="searchPlaceholder"
                />
              </div>
              <div class="max-h-64 overflow-auto px-1.5 pt-1 pb-1.5">
                <label
                  v-for="option in listed"
                  :key="option.value"
                  :class="[row, picked.includes(option.value) ? rowOn : rowOff]"
                >
                  <Checkbox :model-value="picked.includes(option.value)" @update:model-value="toggle(option.value)" />
                  <span v-if="option.color" class="size-1.5 shrink-0 rounded-full" :class="hueDots[option.color]" />
                  <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                  <span v-if="option.count != null" class="text-xs font-normal text-sui-ink-muted tabular-nums">{{
                    option.count
                  }}</span>
                </label>
              </div>
            </template>
            <div v-else-if="type === 'text' || type === 'number'" class="px-2 pt-1 pb-2">
              <Input
                :aria-label="field"
                autofocus
                :model-value="value == null ? '' : String(value)"
                :placeholder="valuePlaceholder"
                :type="type === 'number' ? 'number' : 'text'"
                @update:model-value="value = $event ?? null"
              />
            </div>
            <RadioGroupRoot
              v-else-if="type === 'date'"
              :aria-label="field"
              class="max-h-64 overflow-auto px-1.5 pt-1 pb-1.5"
              :model-value="typeof value === 'string' ? value : undefined"
              @update:model-value="value = String($event)"
            >
              <RadioGroupItem
                v-for="preset in datePresets"
                :key="preset"
                :class="[row, preset === value ? rowOn : rowOff]"
                :value="preset"
              >
                <FilterGlyph
                  class="size-4"
                  :class="preset === value ? 'text-sui-accent' : 'text-sui-ink-muted'"
                  name="date"
                />
                <span class="min-w-0 flex-1 truncate">{{ preset }}</span>
                <CheckIcon v-if="preset === value" />
              </RadioGroupItem>
            </RadioGroupRoot>
            <div v-else-if="type === 'boolean'" class="px-2.5 pt-1 pb-2.5">
              <SegmentedControl
                :aria-label="field"
                :model-value="value ? 'yes' : 'no'"
                :options="[
                  { value: 'yes', label: yesLabel },
                  { value: 'no', label: noLabel }
                ]"
                @update:model-value="value = $event === 'yes'"
              />
            </div>
          </template>
        </FilterFrame>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
