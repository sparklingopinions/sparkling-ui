<script setup lang="ts">
import { computed } from 'vue'

import { paginationItems } from './items'

export interface PaginationProps {
  pageCount: number
  /** Pages shown on each side of the current one. */
  siblingCount?: number
  /** Pages always shown at each end. */
  boundaryCount?: number
  /** Shows first and last page buttons. */
  showEnds?: boolean
  disabled?: boolean
  /** The navigation landmark's name. */
  label?: string
  firstLabel?: string
  previousLabel?: string
  nextLabel?: string
  lastLabel?: string
  /** Each page button's name; `{page}` is its number. */
  pageLabel?: string
}

const props = withDefaults(defineProps<PaginationProps>(), {
  siblingCount: 1,
  boundaryCount: 1,
  showEnds: true,
  label: 'Pagination',
  firstLabel: 'First page',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
  lastLabel: 'Last page',
  pageLabel: 'Page {page}'
})

const page = defineModel<number>('page', { default: 1 })

const controls = computed(() => [
  ...(props.showEnds ? (['first'] as const) : []),
  'previous' as const,
  ...paginationItems(page.value, props.pageCount, props.siblingCount, props.boundaryCount),
  'next' as const,
  ...(props.showEnds ? (['last'] as const) : [])
])

function go(target: number) {
  if (!props.disabled && target >= 1 && target <= props.pageCount) page.value = target
}

const arrows = computed(() => {
  const atStart = page.value <= 1
  const atEnd = page.value >= props.pageCount
  return {
    first: { label: props.firstLabel, target: 1, off: atStart, path: 'M8 3 3 8l5 5M13 3 8 8l5 5' },
    previous: { label: props.previousLabel, target: page.value - 1, off: atStart, path: 'M10 3 5 8l5 5' },
    next: { label: props.nextLabel, target: page.value + 1, off: atEnd, path: 'm6 3 5 5-5 5' },
    last: { label: props.lastLabel, target: props.pageCount, off: atEnd, path: 'm3 3 5 5-5 5m5-10 5 5-5 5' }
  }
})

const button =
  'inline-flex h-7 min-w-7 items-center justify-center rounded-(--sui-radius-button) px-1.5 text-13 font-medium tabular-nums transition-colors duration-150 focus-visible:sui-ring disabled:cursor-default disabled:opacity-50'
const idle = 'text-sui-ink-body enabled:hover:bg-sui-sunken enabled:hover:text-sui-ink'
</script>

<!-- A table's paginator: first, previous, the pages with gaps, next, last. The current page is a solid accent tile. -->
<template>
  <nav :aria-label="label" class="flex items-center gap-0.5">
    <template v-for="control in controls" :key="control">
      <span
        v-if="control === 'gap-start' || control === 'gap-end'"
        aria-hidden="true"
        class="inline-flex size-7 items-center justify-center text-13 text-sui-ink-muted select-none"
        >…</span
      >
      <button
        v-else-if="typeof control === 'string'"
        :aria-label="arrows[control].label"
        :class="[button, idle]"
        :disabled="disabled || arrows[control].off"
        :title="arrows[control].label"
        type="button"
        @click="go(arrows[control].target)"
      >
        <svg
          aria-hidden="true"
          class="size-4 fill-none stroke-current"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 16 16"
        >
          <path :d="arrows[control].path" />
        </svg>
      </button>
      <button
        v-else
        :aria-current="control === page ? 'page' : undefined"
        :aria-label="pageLabel.replace('{page}', String(control))"
        :class="[button, control === page ? 'bg-sui-accent-solid font-semibold text-sui-on-accent' : idle]"
        :disabled="disabled"
        type="button"
        @click="go(control)"
      >
        {{ control }}
      </button>
    </template>
  </nav>
</template>
