<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue'

import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'

export interface SelectOption<T extends string | number> {
  value: T
  label: string
  disabled?: boolean
}

export interface SelectProps<T extends string | number> {
  options: SelectOption<T>[]
  /** 36px for forms, 28px for table feet and toolbars. */
  size?: 'md' | 'sm'
  disabled?: boolean
  placeholder?: string
  /** Where the list opens; it flips when there's no room. */
  side?: 'bottom' | 'top'
}

// Attributes (id, aria-label, class for its width) go to the trigger, the one element in the page's flow.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps<T>>(), {
  size: 'md',
  placeholder: 'Select an option',
  side: 'bottom'
})

const model = defineModel<T | null>({ default: null })

// Reka learns an option's label only once the list has opened, so the trigger takes it from the options.
const chosen = computed(() => props.options.find((option) => option.value === model.value))

const sizes = { md: 'h-9 pr-2.5 pl-3 text-sm', sm: 'h-7 pr-1.5 pl-2 text-13' }
</script>

<!-- A single choice from a short list: a bordered trigger and a list styled like menus. -->
<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger
      v-bind="$attrs"
      class="group inline-flex items-center justify-between gap-1.5 rounded-(--sui-radius-button) border border-sui-line-control bg-sui-surface text-left whitespace-nowrap text-sui-ink transition-colors duration-150 hover:border-sui-ink-muted focus-visible:sui-ring-field data-disabled:pointer-events-none data-disabled:opacity-60 data-placeholder:text-sui-ink-faint"
      :class="sizes[size]"
    >
      <SelectValue :placeholder="placeholder">{{ chosen?.label ?? placeholder }}</SelectValue>
      <svg
        aria-hidden="true"
        class="size-4 shrink-0 fill-none stroke-sui-ink-muted transition-transform duration-150 group-data-[state=open]:rotate-180"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        viewBox="0 0 16 16"
      >
        <path d="M4.5 6.5 8 10l3.5-3.5" />
      </svg>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="z-[1000] max-h-[min(15rem,var(--reka-select-content-available-height))] min-w-(--reka-select-trigger-width) overflow-hidden rounded-xl border border-sui-line-subtle bg-sui-surface shadow-lg data-[state=open]:animate-sui-menu-in"
        position="popper"
        :side="side"
        :side-offset="4"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="flex min-h-8 cursor-pointer items-center justify-between gap-3 rounded-lg py-1.5 pr-2 pl-2.5 text-13 whitespace-nowrap text-sui-ink outline-hidden select-none focus-visible:sui-ring-inset data-disabled:cursor-default data-disabled:opacity-50 data-highlighted:bg-sui-sunken data-[state=checked]:font-medium data-[state=checked]:text-sui-accent"
            :disabled="option.disabled"
            :value="option.value"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="flex">
              <svg
                aria-hidden="true"
                class="size-4 fill-none stroke-sui-accent"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
