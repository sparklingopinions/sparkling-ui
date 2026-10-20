<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

import Button from '../Button/Button.vue'
import CheckIcon from '../internal/CheckIcon.vue'
import FilterFrame from './FilterFrame.vue'
import FilterGlyph from './FilterGlyph.vue'
import SortArrow from './SortArrow.vue'
import { sortDirections } from './defaults'
import type { FilterField, FilterFieldType, ViewSort } from './types'

export interface SortControlProps {
  /** The sortable fields. */
  options: FilterField[]
  /** chip: the sort in the view bar, which shows only while there is one. button: the page header's Sort button. */
  as?: 'chip' | 'button'
  /** Boards can't sort: disable the button, with a Tooltip saying why. */
  disabled?: boolean
  status?: string
  /** The two directions' words for each field type, ascending first. */
  directionLabels?: Partial<Record<FilterFieldType, [string, string]>>
  title?: string
  buttonLabel?: string
  clearLabel?: string
  directionLabel?: string
  doneLabel?: string
  closeLabel?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SortControlProps>(), {
  as: 'chip',
  status: undefined,
  directionLabels: () => ({}),
  title: 'Sort by',
  buttonLabel: 'Sort',
  clearLabel: 'Clear sort',
  directionLabel: 'Direction',
  doneLabel: 'Done',
  closeLabel: 'Close'
})

const sort = defineModel<ViewSort | null>({ default: null })
const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()

const current = computed(() => (sort.value ? props.options.find((o) => o.name === sort.value!.name) : undefined))
const words = (type: FilterFieldType) => props.directionLabels[type] ?? sortDirections[type]
const dirLabel = computed(() => (current.value ? words(current.value.type)[sort.value!.dir === 'desc' ? 1 : 0] : ''))

function pickField(name: string) {
  sort.value = { name, dir: sort.value?.name === name ? sort.value.dir : 'asc' }
}

function clear() {
  sort.value = null
  open.value = false
}

const row =
  'flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-left text-13.5 outline-hidden transition-colors duration-100 focus-visible:sui-ring-inset'
</script>

<!-- A view's sort: the header's Sort button or the view bar's chip ("Name, A → Z") open a panel of fields and a direction. -->
<template>
  <PopoverRoot v-if="as === 'button' || current" v-model:open="open">
    <PopoverTrigger v-if="as === 'button'" as-child>
      <Button v-bind="attrs" :disabled="disabled" :variant="current ? 'tinted' : 'secondary'">
        <svg
          aria-hidden="true"
          class="size-4 fill-none stroke-current"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 16 16"
        >
          <path d="M5 13V3M2.5 5.5 5 3l2.5 2.5M11 3v10M8.5 10.5 11 13l2.5-2.5" />
        </svg>
        {{ buttonLabel }}
      </Button>
    </PopoverTrigger>
    <PopoverTrigger
      v-else
      v-bind="attrs"
      class="inline-flex h-7.5 items-center gap-1.5 rounded-lg border border-sui-accent-line bg-sui-accent-wash pr-1.5 pl-2 text-13 whitespace-nowrap text-sui-accent outline-hidden transition-[border-color,box-shadow] duration-150 hover:border-sui-accent-bright focus-visible:sui-ring data-[state=open]:border-sui-accent-solid data-[state=open]:shadow-[0_0_0_3px_rgb(var(--sui-focus-ring))]"
    >
      <SortArrow :dir="sort!.dir" />
      <span
        ><span class="font-medium">{{ current!.label }},</span>{{ ' ' }}{{ dirLabel }}</span
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
            <svg
              aria-hidden="true"
              class="size-4 fill-none stroke-current"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 16 16"
            >
              <path d="M5 13V3M2.5 5.5 5 3l2.5 2.5M11 3v10M8.5 10.5 11 13l2.5-2.5" />
            </svg>
            <span class="text-sm font-semibold text-sui-ink">{{ title }}</span>
            <button
              v-if="current"
              class="ml-auto inline-flex h-7 items-center rounded-lg px-2 text-12.5 font-medium text-sui-ink-muted outline-hidden transition-colors duration-150 hover:bg-sui-sunken hover:text-sui-ink focus-visible:sui-ring-inset"
              type="button"
              @click="clear"
            >
              {{ clearLabel }}
            </button>
          </div>
          <RadioGroupRoot
            :aria-label="title"
            class="max-h-64 overflow-auto px-1.5 pt-1 pb-1.5"
            :model-value="sort?.name"
            @update:model-value="pickField($event as string)"
          >
            <RadioGroupItem
              v-for="option in options"
              :key="option.name"
              :class="[
                row,
                option.name === sort?.name
                  ? 'bg-sui-accent-wash font-semibold text-sui-accent'
                  : 'text-sui-ink hover:bg-sui-sunken'
              ]"
              :value="option.name"
            >
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-md"
                :class="
                  option.name === sort?.name ? 'bg-sui-surface text-sui-accent' : 'bg-sui-sunken text-sui-ink-body'
                "
              >
                <FilterGlyph :name="option.type" />
              </span>
              <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
              <CheckIcon v-if="option.name === sort?.name" />
            </RadioGroupItem>
          </RadioGroupRoot>
          <RadioGroupRoot
            v-if="current"
            :aria-label="directionLabel"
            class="mx-3 mb-3 grid grid-cols-2 gap-0.5 rounded-lg bg-sui-sunken p-0.75"
            :model-value="sort!.dir"
            orientation="horizontal"
            @update:model-value="sort = { name: sort!.name, dir: $event as ViewSort['dir'] }"
          >
            <RadioGroupItem
              v-for="(dir, i) in ['asc', 'desc'] as const"
              :key="dir"
              class="flex h-9 items-center justify-center gap-1.5 rounded-md text-13 font-medium outline-hidden transition-colors duration-150 focus-visible:sui-ring-inset"
              :class="
                sort!.dir === dir
                  ? 'bg-sui-surface text-sui-ink shadow-(--sui-shadow-raised) ring-1 ring-sui-line-subtle'
                  : 'text-sui-ink-body hover:text-sui-ink'
              "
              :value="dir"
            >
              <SortArrow :dir="dir" />
              {{ words(current.type)[i] }}
            </RadioGroupItem>
          </RadioGroupRoot>
        </FilterFrame>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
