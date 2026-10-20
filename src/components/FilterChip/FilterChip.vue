<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

import Icon from '../Icon/Icon.vue'

export interface FilterChipProps {
  /** A filter or the sort, read as a sentence; `add` is the quiet "+ Filter" that starts one. */
  kind?: 'filter' | 'sort' | 'add'
  /** The field's icon, for filters, through the app's icon resolver. */
  icon?: string
  field?: string
  /** The operator ("is", "contains"), or for sort the direction ("ascending"). */
  op?: string
  value?: string
  /** For sort: the arrow's direction. */
  dir?: 'asc' | 'desc'
  /** Adds a Remove action to the panel (`@remove`). */
  onRemove?: () => void
  removeLabel?: string
  addLabel?: string
  sortLabel?: string
}

// Attributes and listeners go to the chip itself; the root is a renderless popover.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FilterChipProps>(), {
  kind: 'filter',
  icon: undefined,
  field: undefined,
  op: undefined,
  value: undefined,
  dir: 'asc',
  onRemove: undefined,
  removeLabel: 'Remove',
  addLabel: 'Filter',
  sortLabel: 'Sort by'
})

const open = defineModel<boolean>('open', { default: false })

const slots = defineSlots<{
  /** The panel's body: operator and value pickers. */
  default?: () => unknown
}>()

const attrs = useAttrs()
const hasPanel = computed(() => !!slots.default || !!props.onRemove)

function remove() {
  open.value = false
  props.onRemove?.()
}

const chip =
  'inline-flex h-7.5 items-center gap-1.5 rounded-lg border text-13 whitespace-nowrap outline-hidden transition-[border-color,box-shadow] duration-150 focus-visible:sui-ring'
const arrow = computed(() => (props.dir === 'desc' ? 'M12 5v14M6 13l6 6 6-6' : 'M12 19V5M6 11l6-6 6 6'))
</script>

<!-- A view's filter or sort as a sentence chip ("Stage is Customer"), opening a small panel to change it. -->
<template>
  <button
    v-if="kind === 'add'"
    v-bind="attrs"
    class="border-dashed border-sui-line-strong px-2 font-medium text-sui-ink-muted hover:border-sui-ink-muted hover:text-sui-ink-body"
    :class="chip"
    type="button"
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
    {{ addLabel }}
  </button>
  <PopoverRoot v-else v-model:open="open">
    <component
      :is="hasPanel ? PopoverTrigger : 'button'"
      v-bind="attrs"
      class="border-sui-accent-line bg-sui-accent-wash pr-1.5 pl-2 text-sui-accent hover:border-sui-accent-bright data-[state=open]:border-sui-accent-solid data-[state=open]:shadow-[0_0_0_3px_rgb(var(--sui-focus-ring))]"
      :class="chip"
      type="button"
    >
      <svg
        v-if="kind === 'sort'"
        aria-hidden="true"
        class="size-3.5 shrink-0 fill-none stroke-current"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.2"
        viewBox="0 0 24 24"
      >
        <path :d="arrow" />
      </svg>
      <Icon v-else-if="icon" class="size-3.5 opacity-80" color="accent" :name="icon" />
      <!-- Real spaces between the words, so the chip's name reads as a sentence. -->
      <span
        ><span class="font-medium">{{ field }}{{ kind === 'sort' ? ',' : '' }}</span
        ><template v-if="op">{{ ' ' }}{{ op }}</template
        ><template v-if="value"
          >{{ ' ' }}<span class="font-semibold">{{ value }}</span></template
        ></span
      >
      <svg
        v-if="hasPanel"
        aria-hidden="true"
        class="size-3.5 shrink-0 fill-none stroke-current opacity-70"
        stroke-linecap="round"
        stroke-width="2.2"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </component>
    <PopoverPortal>
      <PopoverContent
        align="start"
        class="z-[1000] min-w-[16rem] rounded-xl border border-sui-line-subtle bg-sui-surface text-sui-ink shadow-lg data-[state=open]:animate-sui-menu-in"
        :side-offset="4"
      >
        <div class="flex h-11 items-center gap-1.5 pr-1.5 pl-3.5 text-sui-ink-muted">
          <svg
            v-if="kind === 'sort'"
            aria-hidden="true"
            class="size-3.5 shrink-0 fill-none stroke-current"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.2"
            viewBox="0 0 24 24"
          >
            <path :d="arrow" />
          </svg>
          <Icon v-else-if="icon" color="ink-muted" :name="icon" />
          <span class="text-sm font-semibold text-sui-ink">{{ kind === 'sort' ? sortLabel : field }}</span>
          <button
            v-if="onRemove"
            class="ml-auto inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-sui-ink-muted outline-hidden transition-colors duration-150 hover:bg-sui-danger-soft hover:text-sui-danger focus-visible:sui-ring-inset"
            type="button"
            @click="remove"
          >
            <svg
              aria-hidden="true"
              class="size-3.5 fill-none stroke-current"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />
            </svg>
            {{ removeLabel }}
          </button>
        </div>
        <div v-if="$slots.default" class="px-1.5 pb-1.5">
          <slot />
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
