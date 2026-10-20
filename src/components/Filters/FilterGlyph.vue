<script setup lang="ts">
import type { FilterFieldType } from './types'

defineProps<{ name: FilterFieldType | 'search' | 'trash' | 'plus' | 'check' }>()

// The library's own glyphs for field types and panel actions, so they work with any app's icon set.
const paths: Record<string, string> = {
  text: 'M3.5 4.5V3h9v1.5M8 3v10M6 13h4',
  enum: 'M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01',
  person: 'M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4',
  company: 'M3 14V2.5h7V14M10 6h3v8M1.5 14h13M5.5 5h2M5.5 8h2M5.5 11h2',
  date: 'M3 4h10v9H3zM3 7h10M5.5 2.5v3M10.5 2.5v3',
  number: 'M6.5 2.5l-1 11M11 2.5l-1 11M3 6h10.5M2.5 10H13',
  boolean: 'M3 8.5l3 3 7-7',
  search: 'M7.25 12a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM13.5 13.5l-2.9-2.9',
  trash: 'M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9',
  plus: 'M8 3.5v9M3.5 8h9',
  check: 'M3.5 8.5l3 3 6-7'
}
</script>

<template>
  <svg
    aria-hidden="true"
    class="size-3.5 shrink-0 fill-none stroke-current"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    viewBox="0 0 16 16"
  >
    <path :d="paths[name]" />
  </svg>
</template>
