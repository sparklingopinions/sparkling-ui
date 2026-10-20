<script setup lang="ts">
export interface ErrorSummaryProps {
  errors: string[]
  title?: string
}

withDefaults(defineProps<ErrorSummaryProps>(), { title: 'The following errors have been found' })
</script>

<template>
  <div
    class="mb-6 flex gap-2.5 rounded-xl border border-sui-danger-line bg-sui-danger-soft px-3.5 py-3 text-13 leading-5 font-semibold text-sui-danger"
    role="alert"
  >
    <svg
      aria-hidden="true"
      class="mt-0.5 size-4 shrink-0 fill-none stroke-sui-danger"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5M8 11h.01" />
    </svg>
    <div>
      {{ title }}
      <ul class="mt-1 list-disc pl-4 font-normal text-sui-ink-body marker:text-sui-danger-mid">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>
