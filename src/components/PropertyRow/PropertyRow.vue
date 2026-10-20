<script setup lang="ts">
export interface PropertyRowProps {
  label?: string
  /** Shown under the value, and turns the label red. */
  error?: string | null
  /** `start` for a value taller than one line. */
  align?: 'center' | 'start'
  /** Replaces the label's colour class. */
  labelClass?: string
  divider?: boolean
}

withDefaults(defineProps<PropertyRowProps>(), {
  label: undefined,
  error: null,
  align: 'center',
  labelClass: undefined,
  divider: true
})
</script>

<!-- A ledger row: a quiet label on the left, the value on the right. -->
<template>
  <div
    class="grid grid-cols-[88px_minmax(0,1fr)] gap-3 border-sui-line-subtle"
    :class="[
      align === 'start' ? 'items-start py-3' : [divider ? 'min-h-11' : 'min-h-9.5', 'items-center'],
      { 'border-b': divider }
    ]"
  >
    <span
      class="text-13"
      :class="[error ? 'text-sui-danger' : (labelClass ?? 'text-sui-ink-muted'), align === 'start' ? 'pt-px' : '']"
    >
      <slot name="label">{{ label }}</slot>
    </span>
    <div class="flex min-w-0 flex-col gap-0.5">
      <slot />
      <p v-if="error" class="text-xs text-sui-danger">{{ error }}</p>
    </div>
  </div>
</template>
