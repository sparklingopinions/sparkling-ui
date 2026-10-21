<script setup lang="ts">
import { useFieldControl } from '../FormField/context'

export interface InputProps {
  /** Marks the field as failing validation: a danger border and `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
}

const props = defineProps<InputProps>()

const model = defineModel<string | null>()

const { attrs: fieldAttrs, invalid: isInvalid } = useFieldControl(
  () => model.value,
  () => props.invalid
)
</script>

<!-- Attributes (id, type, placeholder, readonly, autocomplete...) land on the input itself. -->
<template>
  <input
    v-bind="fieldAttrs"
    :aria-invalid="isInvalid ? 'true' : undefined"
    class="m-0 h-9 w-full appearance-none rounded-lg border bg-sui-surface px-3 font-sans text-sm leading-none text-sui-ink transition-colors duration-200 placeholder:text-sui-ink-faint"
    :class="[
      isInvalid ? 'border-sui-danger-mid' : 'border-sui-line-strong hover:border-sui-ink-muted',
      disabled
        ? 'pointer-events-none cursor-default opacity-60 select-none'
        : 'focus:border-sui-accent focus:ring-0 focus-visible:sui-ring-field'
    ]"
    :disabled="disabled"
    :value="model ?? ''"
    @input="model = ($event.target as HTMLInputElement).value"
  />
</template>
