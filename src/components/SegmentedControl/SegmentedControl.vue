<script setup lang="ts" generic="T extends string">
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'

import Icon from '../Icon/Icon.vue'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
  /** An Icon name. */
  iconName?: string
  /** An SVG path on a 24px grid. */
  icon?: string
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  /** Fills its row, the segments sharing it evenly with their labels truncated: phone tab bars. */
  block?: boolean
}

defineProps<SegmentedControlProps<T>>()

const model = defineModel<T>({ required: true })
</script>

<!-- A few choices side by side, one picked: the chosen one lifts onto a card. Arrow keys move between them. -->
<template>
  <RadioGroupRoot
    v-model="model"
    class="flex gap-0.5 rounded-lg bg-sui-sunken p-0.75 ring-1 ring-sui-line-subtle ring-inset"
    :class="block ? 'w-full' : 'w-fit'"
    orientation="horizontal"
  >
    <RadioGroupItem
      v-for="option in options"
      :key="option.value"
      class="inline-flex h-7 items-center gap-1.5 rounded-md text-13 font-medium transition-colors focus-visible:sui-ring-inset [&_svg]:shrink-0 [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]"
      :class="[
        block ? 'min-w-0 flex-1 justify-center px-2' : 'pr-3 pl-2.5',
        option.value === model
          ? 'bg-sui-surface text-sui-ink shadow-(--sui-shadow-raised) ring-1 ring-sui-line-subtle'
          : 'text-sui-ink-body hover:text-sui-ink'
      ]"
      :value="option.value"
    >
      <Icon
        v-if="option.iconName"
        class="h-4 w-4"
        :color="option.value === model ? 'ink' : 'ink-body'"
        :name="option.iconName"
      />
      <svg
        v-else-if="option.icon"
        aria-hidden="true"
        class="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path :d="option.icon" />
      </svg>
      <span class="min-w-0 truncate">{{ option.label }}</span>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
