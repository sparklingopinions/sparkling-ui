<script setup lang="ts">
import { computed, ref } from 'vue'

import ChevronIcon from '../internal/ChevronIcon.vue'

export interface CollapsibleProps {
  /** What's folded away, shown beside the label while closed, e.g. "Phone, birthday". */
  summary: string
  /** Opens it, when any of its fields holds a value. */
  filled?: boolean
  label?: string
}

const props = withDefaults(defineProps<CollapsibleProps>(), { label: 'More details' })

const open = ref(false)
const isOpen = computed(() => open.value || props.filled)
</script>

<!-- Rarely used fields, folded away. -->
<template>
  <div>
    <button
      :aria-expanded="isOpen"
      class="flex h-10.5 w-full items-center gap-1.5 bg-transparent p-0 text-13 font-medium text-sui-ink-body focus-visible:sui-ring"
      type="button"
      @click="open = !open"
    >
      <ChevronIcon
        class="h-4 w-4 fill-sui-ink-body stroke-sui-ink-body transition-transform duration-150"
        :class="{ 'rotate-90': isOpen }"
        direction="right"
      />
      {{ label }}
      <span v-if="!isOpen" class="font-normal text-sui-ink-muted">{{ summary }}</span>
    </button>
    <div v-if="isOpen" class="-mt-1.5 pb-1">
      <slot />
    </div>
  </div>
</template>
