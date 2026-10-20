<script setup lang="ts">
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'

export interface EmptyStateProps {
  title: string
  /** Plain text; for anything richer, use the `description` slot. */
  description?: string
  /** What the list holds, as an icon name (users, inbox, search for no matches), in a tile above the title. Decorative. */
  icon?: string
  /** `accent` for a list waiting to be filled; `neutral` for no matches or a filtered view. */
  tone?: 'accent' | 'neutral'
  /** Shows a primary button with this label, which emits `action`. Or put your own in the `action` slot. */
  actionLabel?: string
  actionIcon?: string
  /** The title's heading level, to fit the page's outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

withDefaults(defineProps<EmptyStateProps>(), {
  description: undefined,
  icon: undefined,
  tone: 'accent',
  actionLabel: undefined,
  actionIcon: 'plus',
  headingLevel: 2
})

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div
      v-if="icon"
      aria-hidden="true"
      class="mb-4 flex size-12 items-center justify-center rounded-xl ring-1 ring-inset"
      :class="tone === 'accent' ? 'bg-sui-accent-wash ring-sui-accent-line' : 'bg-sui-sunken ring-sui-line-subtle'"
    >
      <Icon class="size-6" :color="tone === 'accent' ? 'accent' : 'ink-muted'" :name="icon" />
    </div>
    <component :is="`h${headingLevel}`" class="m-0 mb-1.5 text-base font-semibold text-sui-ink">{{ title }}</component>
    <div class="max-w-xs text-sm leading-relaxed text-sui-ink-muted">
      <slot name="description">{{ description }}</slot>
    </div>
    <slot name="action">
      <Button v-if="actionLabel" class="mt-4" variant="primary" @click="$emit('action')">
        <Icon v-if="actionIcon" :name="actionIcon" />
        {{ actionLabel }}
      </Button>
    </slot>
  </div>
</template>
