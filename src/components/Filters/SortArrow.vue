<template>
  <svg
    aria-hidden="true"
    class="size-3.5 shrink-0 fill-none stroke-current"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2.2"
    viewBox="0 0 24 24"
  >
    <path :d="dir === 'desc' ? 'M12 5v14M6 13l6 6 6-6' : 'M12 19V5M6 11l6-6 6 6'" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ dir: 'asc' | 'desc' }>()
</script>
