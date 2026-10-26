<script setup lang="ts">
import { computed } from 'vue'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'danger'

export interface BadgeProps {
  tone?: BadgeTone
  /**
   * `soft` is a tinted chip; `text` is a dot and a coloured label, lighter; `outline` is a small
   * neutral pill (the dot carries the tone) for a count that isn't the page's own.
   */
  variant?: 'soft' | 'text' | 'outline'
  dot?: boolean
  label?: string
}

const props = withDefaults(defineProps<BadgeProps>(), { tone: 'neutral', variant: 'soft', dot: true, label: undefined })

const tones: Record<BadgeTone, { chip: string; text: string; dot: string }> = {
  neutral: { chip: 'bg-sui-sunken text-sui-ink-subtle', text: 'text-sui-ink-muted', dot: 'bg-sui-mark-faint' },
  accent: { chip: 'bg-sui-accent-wash text-sui-accent', text: 'text-sui-accent', dot: 'bg-sui-accent-solid' },
  success: {
    chip: 'bg-sui-success-soft text-sui-success',
    text: 'text-sui-success',
    dot: 'bg-sui-success-mid'
  },
  warning: {
    chip: 'bg-sui-warning-soft text-sui-warning',
    text: 'text-sui-warning',
    dot: 'bg-sui-warning-bright'
  },
  info: { chip: 'bg-sui-info-soft text-sui-info', text: 'text-sui-info', dot: 'bg-sui-info-mid' },
  danger: { chip: 'bg-sui-danger-soft text-sui-danger', text: 'text-sui-danger', dot: 'bg-sui-danger-solid' }
}

const tone = computed(() => tones[props.tone])

const shape = computed(() => {
  if (props.variant === 'soft') return ['h-6 gap-1.5 rounded-md px-2.5 text-xs font-medium', tone.value.chip]
  if (props.variant === 'outline')
    return 'h-5 gap-1.25 rounded-full border border-sui-line bg-sui-surface pr-1.75 pl-1.5 text-11.5 leading-none font-semibold text-sui-ink-emphasis tabular-nums'
  return ['gap-1.5 text-xs font-medium', tone.value.text]
})
</script>

<template>
  <span class="inline-flex items-center whitespace-nowrap" :class="shape">
    <span v-if="dot" class="h-1.5 w-1.5 shrink-0 rounded-full" :class="tone.dot" />
    <slot>{{ label }}</slot>
  </span>
</template>
