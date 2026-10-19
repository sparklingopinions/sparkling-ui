<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

export interface TooltipProps {
  /** Line breaks are kept. For anything richer, use the `content` slot. */
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  disabled?: boolean
}

const props = withDefaults(defineProps<TooltipProps>(), { text: undefined, side: 'top' })

const slots = useSlots()
const empty = computed(() => !props.text && !slots.content)
</script>

<!-- Shows at once and only while the trigger is hovered or focused, as MustLoop's PrimeVue tooltip did. -->
<template>
  <TooltipProvider :delay-duration="0" disable-hoverable-content :skip-delay-duration="0">
    <TooltipRoot :disabled="disabled || empty">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="z-[1100] max-w-lg animate-sui-fade-in rounded-md bg-sui-inverse px-1.5 py-1 text-sm leading-none break-words whitespace-pre-line text-sui-on-inverse shadow-md"
          :side="side"
          :side-offset="4"
        >
          <slot name="content">{{ text }}</slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
