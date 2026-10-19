<script setup lang="ts">
import { computed } from 'vue'

import Chip from '../Chip/Chip.vue'
import SelectInput from '../SelectInput/SelectInput.vue'
import type { SelectInputItem } from '../SelectInput/types'

export interface InlineFormInputSelectProps {
  options?: Record<string, unknown>[]
  optionLabel?: string
  optionValue?: string
  placeholder?: string | null
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InlineFormInputSelectProps>(), {
  options: () => [],
  optionLabel: 'label',
  optionValue: 'value',
  placeholder: null
})

const model = defineModel<string | number | null>({ default: null })

// SelectInput works on `id` and `name`; derive them from the option's value and label.
const items = computed<SelectInputItem[]>(() =>
  props.options.map((option) => ({
    ...option,
    id: option[props.optionValue] as string,
    name: String(option[props.optionLabel] ?? '')
  }))
)

const chosen = computed({
  get: () => items.value.find((item) => item[props.optionValue] === model.value) ?? null,
  set: (item) =>
    (model.value = ((item as SelectInputItem | null)?.[props.optionValue] as string | number | undefined) ?? null)
})
</script>

<template>
  <SelectInput v-model="chosen" :items="items">
    <template #trigger="{ onClick }">
      <div
        class="relative w-full max-w-[16rem] cursor-pointer rounded-lg px-3 py-1.5 transition-colors hover:bg-sui-sunken"
        @click="onClick"
      >
        <span v-if="!chosen" class="text-sui-ink-muted">{{ placeholder }}</span>
        <Chip v-else>{{ chosen.name }}</Chip>
      </div>
    </template>
    <template #option="{ item }">
      <span>{{ item.name }}</span>
    </template>
  </SelectInput>
</template>
