<script setup lang="ts">
defineProps<{ direction: 'left' | 'right' }>()
</script>

<template>
  <svg
    aria-hidden="true"
    fill="none"
    fill-opacity="0"
    height="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    width="16"
  >
    <path :d="direction === 'left' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'" />
  </svg>
</template>
