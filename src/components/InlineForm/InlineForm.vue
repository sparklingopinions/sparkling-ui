<script setup lang="ts">
import type { SelectOption, SelectValue } from '../Select/types'
import InlineField from './InlineField.vue'

export interface InlineFormField {
  id: string
  label?: string
  /** How the value is edited: one line, several, or picked from `options`. */
  type?: 'text' | 'multiline' | 'select'
  placeholder?: string
  options?: SelectOption[]
  disabled?: boolean
}

defineProps<{ fields: InlineFormField[] }>()

const model = defineModel<Record<string, unknown>>({ required: true })

// `change` names the one field that changed, for hosts that save field by field.
const emit = defineEmits<{ submit: []; change: [id: string, value: unknown] }>()

const valueOf = (id: string) => (model.value[id] ?? null) as SelectValue | null

function update(id: string, value: unknown) {
  model.value = { ...model.value, [id]: value }
  emit('change', id, value)
}
</script>

<!-- A record's details: a quiet label beside each value, every value an InlineField edited where it is. -->
<template>
  <form class="relative flex flex-col" @submit.prevent="emit('submit')">
    <div v-for="field of fields" :key="field.id" class="mb-1.5 flex items-start gap-2">
      <label
        v-if="field.label"
        class="block w-22 shrink-0 pt-1.5 text-sm font-normal text-sui-ink-muted"
        :for="field.id"
      >
        {{ field.label }}
      </label>
      <InlineField
        :id="field.id"
        :aria-label="field.label"
        :disabled="field.disabled"
        :model-value="valueOf(field.id)"
        :options="field.options"
        :placeholder="field.placeholder"
        :variant="field.type ?? 'text'"
        @update:model-value="(value) => update(field.id, value)"
      />
    </div>
  </form>
</template>
