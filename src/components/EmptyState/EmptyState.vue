<script setup lang="ts">
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'

export interface EmptyStateProps {
  title: string
  /** Plain text; for anything richer, use the `description` slot. */
  description?: string
  /** Shown in a tile above the title; decorative. */
  emoji?: string
  /** Shows a primary button with this label, which emits `action`. Or put your own in the `action` slot. */
  actionLabel?: string
  actionIcon?: string
}

withDefaults(defineProps<EmptyStateProps>(), {
  description: undefined,
  emoji: undefined,
  actionLabel: undefined,
  actionIcon: 'plus'
})

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div
      v-if="emoji"
      aria-hidden="true"
      class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sui-sunken text-3xl"
    >
      {{ emoji }}
    </div>
    <div class="mb-1.5 text-base font-semibold text-sui-ink">{{ title }}</div>
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
