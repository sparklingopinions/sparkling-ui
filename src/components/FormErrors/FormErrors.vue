<script setup lang="ts">
export interface FormErrorsProps {
  errors: string[]
  title?: string
}

withDefaults(defineProps<FormErrorsProps>(), { title: 'The following errors have been found' })
</script>

<template>
  <div
    class="mb-6 rounded border-2 border-sui-danger bg-sui-surface/90 p-4 text-sm font-semibold text-sui-danger"
    role="alert"
  >
    {{ title }}
    <ul class="mt-2 ml-6 list-disc">
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>
  </div>
</template>
