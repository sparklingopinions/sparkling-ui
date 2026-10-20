<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue'

import { fieldKey } from './context'

export interface FormFieldProps {
  label?: string
  hint?: string
  /** Replaces the hint and marks the control invalid. Say what to fix. */
  error?: string | null
  required?: boolean
  /** A muted "Optional" after the label, for forms where most fields are required. */
  optional?: boolean
  /** Shows a count; over the limit it and the control turn danger. */
  maxLength?: number
  /** Label above the control, or `inline` in an 88px column like PropertyRow. */
  layout?: 'stacked' | 'inline'
  /** The control's id, which the label points to. Set it here, not on the control. */
  id?: string
  optionalLabel?: string
  requiredLabel?: string
  /** The counter's name for assistive tech; `{count}` and `{max}` are replaced. */
  counterLabel?: string
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  label: undefined,
  hint: undefined,
  error: undefined,
  maxLength: undefined,
  layout: 'stacked',
  id: undefined,
  optionalLabel: 'Optional',
  requiredLabel: 'required',
  counterLabel: '{count} of {max} characters'
})

const autoId = useId()
const controlId = computed(() => props.id ?? autoId)
const messageId = computed(() => `${controlId.value}-message`)
const countId = computed(() => `${controlId.value}-count`)

const text = ref<string>()
const count = computed(() => text.value?.length ?? 0)
const over = computed(() => props.maxLength !== undefined && count.value > props.maxLength)
const message = computed(() => props.error || props.hint)
const invalid = computed(() => !!props.error || over.value)
const describedBy = computed(
  () =>
    [message.value && messageId.value, props.maxLength !== undefined && countId.value].filter(Boolean).join(' ') ||
    undefined
)

provide(fieldKey, {
  get id() {
    return controlId.value
  },
  describedBy,
  required: computed(() => props.required),
  invalid,
  text
})
</script>

<!-- Label, hint, error and counter around one control. Input, Textarea and Select inside it are wired up on their
     own; another control takes the slot's `id`, `describedBy` and `invalid`. -->
<template>
  <div
    :class="
      layout === 'inline' ? 'grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3' : 'flex min-w-0 flex-col gap-1.5'
    "
  >
    <label
      v-if="label"
      class="flex items-baseline gap-1 text-13 leading-5"
      :class="layout === 'inline' ? 'pt-2 text-sui-ink-muted' : 'font-medium text-sui-ink-emphasis'"
      :for="controlId"
    >
      {{ label }}
      <template v-if="required">
        <span aria-hidden="true" class="text-sui-danger">*</span>
        <span class="sr-only"> ({{ requiredLabel }})</span>
      </template>
      <span v-else-if="optional" class="ml-1 text-xs font-normal text-sui-ink-muted">{{ optionalLabel }}</span>
    </label>
    <div class="flex min-w-0 flex-col gap-1.5">
      <slot :id="controlId" :described-by="describedBy" :invalid="invalid" />
      <div v-if="message || maxLength !== undefined" class="flex items-start justify-between gap-3">
        <p
          v-if="message"
          :id="messageId"
          class="m-0 flex items-start gap-1.25 text-xs leading-4"
          :class="error ? 'text-sui-danger' : 'text-sui-ink-muted'"
          :role="error ? 'alert' : undefined"
        >
          <svg
            v-if="error"
            aria-hidden="true"
            class="mt-px size-3.5 shrink-0 fill-none stroke-current"
            stroke-linecap="round"
            stroke-width="1.5"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="6.25" />
            <path d="M8 4.75v3.5M8 11h.01" />
          </svg>
          {{ message }}
        </p>
        <span
          v-if="maxLength !== undefined"
          :id="countId"
          :aria-label="counterLabel.replace('{count}', String(count)).replace('{max}', String(maxLength))"
          aria-live="polite"
          class="ml-auto text-xs leading-4 tabular-nums"
          :class="over ? 'font-medium text-sui-danger' : 'text-sui-ink-muted'"
          >{{ count }}/{{ maxLength }}</span
        >
      </div>
    </div>
  </div>
</template>
