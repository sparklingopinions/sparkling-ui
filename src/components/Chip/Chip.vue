<script setup lang="ts">
export interface ChipProps {
  label?: string
  /** The quieter, superseded side, e.g. the "from" of a stage change. */
  muted?: boolean
}

withDefaults(defineProps<ChipProps>(), { label: undefined })
</script>

<!-- A neutral label for an enum value (a status, a stage). -->
<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs whitespace-nowrap"
    :class="
      muted ? 'border-sui-line-subtle text-sui-ink-muted' : 'border-sui-line bg-sui-sunken font-medium text-sui-ink'
    "
  >
    <slot>{{ label }}</slot>
  </span>
</template>
