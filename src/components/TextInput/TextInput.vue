<script setup lang="ts">
export interface TextInputProps {
  /** Marks the field as failing validation: a danger border and `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
}

defineProps<TextInputProps>()

const model = defineModel<string | null>()
</script>

<!-- Attributes (id, type, placeholder, readonly, autocomplete...) land on the input itself. -->
<template>
  <input
    :aria-invalid="invalid ? 'true' : undefined"
    class="m-0 h-9 w-full appearance-none rounded-lg border bg-sui-surface px-3 font-sans text-sm leading-none text-sui-ink transition-colors duration-200 placeholder:text-sui-ink-faint"
    :class="[
      invalid ? 'border-sui-danger-mid' : 'border-sui-line hover:border-sui-line-strong',
      disabled
        ? 'pointer-events-none cursor-default opacity-60 select-none'
        : 'focus:border-sui-accent-solid focus:ring-3 focus:ring-sui-focus-ring focus:outline-hidden focus:outline-offset-0'
    ]"
    :disabled="disabled"
    :value="model ?? ''"
    @input="model = ($event.target as HTMLInputElement).value"
  />
</template>
