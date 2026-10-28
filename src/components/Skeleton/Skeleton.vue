<script setup lang="ts">
import { computed } from 'vue'

export interface SkeletonProps {
  shape?: 'rectangle' | 'circle'
  /** Width and height together, for a circle or a square; it keeps that size in a flex row. */
  size?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  size: undefined,
  width: '100%',
  height: '1rem'
})

const style = computed(() => ({ width: props.size ?? props.width, height: props.size ?? props.height }))
</script>

<template>
  <div
    aria-hidden="true"
    :class="[
      'relative animate-pulse overflow-hidden bg-sui-sunken',
      shape === 'circle' ? 'rounded-full' : 'rounded-md',
      size && 'shrink-0'
    ]"
    :style="style"
  />
</template>
