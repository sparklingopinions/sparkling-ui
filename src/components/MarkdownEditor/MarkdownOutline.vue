<script setup lang="ts">
import type { MarkdownHeading } from './MarkdownEditor.vue'

export interface MarkdownOutlineProps {
  headings: MarkdownHeading[]
  /** The heading the reader is under, from the editor's `outline` event. */
  current?: number | null
  /** Its caption and accessible name. */
  label?: string
}

withDefaults(defineProps<MarkdownOutlineProps>(), { current: null, label: 'On this page' })

const emit = defineEmits<{ select: [index: number] }>()

// Deeper headings indent under the shallowest one present.
const indents = ['', 'pl-5', 'pl-7', 'pl-9']
</script>

<!-- A document's headings beside it, the current one marked: pick one to go to it (the editor's `reveal`). -->
<template>
  <nav v-if="headings.length" :aria-label="label" class="text-13">
    <p class="m-0 mb-2 pl-2.5 text-11 font-semibold tracking-caps text-sui-ink-muted uppercase">{{ label }}</p>
    <ul class="m-0 list-none p-0">
      <li v-for="heading in headings" :key="heading.index">
        <button
          :aria-current="heading.index === current ? 'location' : undefined"
          class="block w-full cursor-pointer truncate border-0 border-l-2 bg-transparent py-1 pr-2 text-left transition-colors focus-visible:sui-ring-inset"
          :class="[
            heading.index === current
              ? 'border-sui-accent-solid text-sui-ink'
              : 'border-sui-line-subtle text-sui-ink-subtle hover:text-sui-ink',
            indents[heading.level - Math.min(...headings.map((h) => h.level))] || 'pl-2.5'
          ]"
          type="button"
          @click="emit('select', heading.index)"
        >
          {{ heading.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
