<script setup lang="ts">
export interface SpinnerProps {
  /** 16, 24 or 32px. */
  size?: 'sm' | 'md' | 'lg'
  /** Its accessible name. */
  label?: string
}

withDefaults(defineProps<SpinnerProps>(), { size: 'lg', label: 'Loading' })

const sizes = { sm: 'size-4', md: 'size-6', lg: 'size-8' }
</script>

<template>
  <div
    :aria-label="label"
    :class="['relative z-10 mx-auto flex items-center justify-center', sizes[size]]"
    role="progressbar"
  >
    <!-- The arc grows and shrinks without turning, as MustLoop's does: its preset's spin classes never reached the svg. -->
    <svg class="size-full" viewBox="25 25 50 50">
      <circle
        class="animate-sui-spinner-dash stroke-sui-accent-solid"
        cx="50"
        cy="50"
        fill="none"
        r="20"
        stroke-dasharray="89, 200"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="8"
      />
    </svg>
  </div>
</template>
