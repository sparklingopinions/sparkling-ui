<script setup lang="ts">
import type { Component } from 'vue'

export interface InlineFormField {
  id: string
  /** The field's editor, e.g. InlineFormInputText. */
  component: Component
  label?: string
  placeholder?: string
  class?: string
  /** Passed on to the editor as they are. */
  props?: Record<string, unknown>
  [key: string]: unknown
}

defineProps<{ fields: InlineFormField[] }>()

const model = defineModel<Record<string, unknown>>({ required: true })

// `change` names the one field that changed, for hosts that save field by field.
const emit = defineEmits<{ submit: []; change: [id: string, value: unknown] }>()

function update(id: string, value: unknown) {
  model.value[id] = value
  emit('change', id, value)
}
</script>

<!-- Label and value side by side, each value edited where it is. -->
<template>
  <form class="relative" @submit.prevent="emit('submit')">
    <div v-for="(field, index) of fields" :key="field.id">
      <div class="mb-1.5 flex items-start gap-2">
        <label
          v-if="field.label"
          class="block w-22 shrink-0 pt-1.5 text-sm font-normal text-sui-ink-muted"
          :for="field.id"
        >
          {{ field.label }}
        </label>
        <component
          :is="field.component"
          :id="field.id"
          :autofocus="index === 0"
          :class="field.class ?? undefined"
          :data-test="field.id"
          :inline="true"
          v-bind="field.props"
          :model-value="model[field.id]"
          :placeholder="field.placeholder"
          @update:model-value="(value: unknown) => update(field.id, value)"
        />
      </div>
    </div>
  </form>
</template>
